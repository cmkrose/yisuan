# 《易算》生产环境部署文档

## 1. 环境要求

| 组件 | 版本 | 说明 |
|------|------|------|
| Node.js | >= 20 LTS | 运行环境 |
| pnpm | >= 8.x | 包管理器 |
| PostgreSQL | >= 16 | 主数据库 |
| Redis | >= 7 | 缓存 |
| Nginx | >= 1.24 | 反向代理 |
| Docker | >= 24 | 容器化（推荐） |
| Certbot | latest | SSL证书（Let's Encrypt） |

**推荐服务器配置**：4核CPU · 8GB内存 · 100GB SSD · Ubuntu 22.04 LTS

## 2. 快速部署 (Docker Compose)

### 2.1 项目文件

```bash
# 克隆项目
git clone https://github.com/your-org/yisuan.git
cd yisuan

# 配置环境变量
cp .env.example .env.production
vim .env.production  # 修改数据库密码、JWT密钥等
```

### 2.2 Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: yisuan-db
    restart: always
    environment:
      POSTGRES_DB: yisuan
      POSTGRES_USER: yisuan
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backend/src/database/migrations:/docker-entrypoint-initdb.d
    ports:
      - "127.0.0.1:5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U yisuan"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: yisuan-cache
    restart: always
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redisdata:/data
    ports:
      - "127.0.0.1:6379:6379"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: yisuan-api
    restart: always
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://yisuan:${DB_PASSWORD}@postgres:5432/yisuan
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - APP_URL=https://yisuan.com
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    ports:
      - "127.0.0.1:3001:3001"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: yisuan-web
    restart: always
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.yisuan.com
      - NEXT_PUBLIC_APP_URL=https://yisuan.com
    ports:
      - "127.0.0.1:3000:3000"

  nginx:
    image: nginx:alpine
    container_name: yisuan-proxy
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - backend
      - frontend

volumes:
  pgdata:
  redisdata:
```

### 2.3 启动

```bash
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml logs -f  # 查看日志
```

## 3. Nginx 配置

```nginx
# nginx/nginx.conf
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    # 基础优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # 安全头
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip 压缩
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_proxied any;
    gzip_vary on;

    # 限流区域
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # HTTP -> HTTPS 重定向
    server {
        listen 80;
        server_name yisuan.com www.yisuan.com;
        return 301 https://$host$request_uri;
    }

    # 主站
    server {
        listen 443 ssl http2;
        server_name yisuan.com www.yisuan.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 1d;

        # 静态资源缓存 (CDN)
        location /_next/static/ {
            proxy_pass http://frontend:3000;
            expires 365d;
            add_header Cache-Control "public, immutable";
        }

        location /images/ {
            proxy_pass http://frontend:3000;
            expires 30d;
            add_header Cache-Control "public";
        }

        # 前端页面
        location / {
            proxy_pass http://frontend:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API 接口
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 30s;
        }

        # 登录限流
        location /api/auth/login {
            limit_req zone=login burst=3 nodelay;
            proxy_pass http://backend:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### 2.4 SSL 证书 (Let's Encrypt)

```bash
# 安装 certbot
apt install certbot python3-certbot-nginx

# 获取证书
certbot certonly --webroot -w /var/www/certbot -d yisuan.com -d www.yisuan.com

# 自动续期 (crontab)
0 3 * * * certbot renew --quiet && nginx -s reload
```

## 4. 数据库运维

### 4.1 备份脚本

```bash
#!/bin/bash
# deploy/scripts/backup.sh
BACKUP_DIR="/backup/yisuan"
DB_NAME="yisuan"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# PostgreSQL 全量备份
PGPASSWORD=$DB_PASSWORD pg_dump -h localhost -U yisuan -Fc $DB_NAME > "$BACKUP_DIR/yisuan_$TIMESTAMP.dump"

# 保留最近14天的备份
find $BACKUP_DIR -name "*.dump" -mtime +14 -delete

echo "Backup completed: yisuan_$TIMESTAMP.dump"
```

### 4.2 健康检查

```bash
#!/bin/bash
# deploy/scripts/healthcheck.sh
API_URL="https://yisuan.com/api"
TIMEOUT=10

check_endpoint() {
    local url=$1
    local code=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url")
    if [ "$code" != "200" ] && [ "$code" != "201" ]; then
        echo "ALERT: $url returned $code"
        return 1
    fi
    return 0
}

echo "Health Check: $(date)"
check_endpoint "$API_URL/knowledge/categories"
check_endpoint "$API_URL/bazi/calculate"
check_endpoint "$API_URL/divination/liuyao"

# 数据库连接检查
PGPASSWORD=$DB_PASSWORD psql -h localhost -U yisuan -d yisuan -c "SELECT 1" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "ALERT: Database connection failed!"
    exit 1
fi

echo "All checks passed."
```

## 5. CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: deploy
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/yisuan
            git pull origin main
            pnpm install --frozen-lockfile
            pnpm build
            docker compose -f docker-compose.prod.yml up -d --build
            docker compose -f docker-compose.prod.yml exec -T backend pnpm db:migrate
```

## 6. 监控方案

```
┌─────────────────────────────────────────────────────┐
│                    监控架构                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  应用监控:                                          │
│  └── Sentry (错误追踪)                               │
│      - DSN 配置在 .env.production                   │
│      - 覆盖前后端异常上报                            │
│                                                     │
│  服务器监控:                                        │
│  └── Prometheus + Grafana                           │
│      - Node Exporter (CPU/内存/磁盘/网络)            │
│      - PostgreSQL Exporter (连接数/慢查询/锁等待)    │
│      - Redis Exporter (命中率/内存/连接数)           │
│                                                     │
│  日志管理:                                          │
│  └── Winston (应用日志) → ELK Stack (可选)           │
│      - 日志级别: error/warn/info/debug              │
│      - 日志轮转: 每日分割，保留30天                  │
│                                                     │
│  告警通知:                                          │
│  └── 钉钉/企业微信 Webhook                          │
│      - CPU > 85% · 内存 > 90% · 磁盘 > 85%         │
│      - API响应时间 > 2s · 错误率 > 5%               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 6.1 Prometheus 部署

```yaml
# deploy/kubernetes/monitoring/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
        
  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:9187']
        
  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:9121']
```

## 7. 安全检查清单

| 检查项 | 状态 | 说明 |
|--------|------|------|
| HTTPS 强制 | ✅ | Nginx 301 重定向 |
| JWT 密钥 | ✅ | 环境变量管理，256位随机密钥 |
| bcrypt 加密 | ✅ | 密码 hash 12轮 |
| CORS 白名单 | ✅ | 仅允许 APP_URL 来源 |
| 请求限流 | ✅ | Nginx 10r/s + 登录 5r/min |
| SQL注入防护 | ✅ | Prisma ORM 参数化查询 |
| XSS 防护头 | ✅ | CSP/X-Frame/X-Content-Type 头 |
| 敏感信息脱敏 | ✅ | 生产环境不输出 stack trace |
| 文件上传校验 | ✅ | 仅接受 image/* 类型 |
| 依赖安全审计 | ⬜ | `pnpm audit` 定期执行 |
| Docker 安全 | ⬜ | 非 root 用户运行 |

## 8. 域名 & DNS 配置

| 记录 | 类型 | 值 |
|------|------|------|
| `yisuan.com` | A | 服务器 IP |
| `www.yisuan.com` | CNAME | `yisuan.com` |
| `api.yisuan.com` | CNAME | `yisuan.com` |
| `cdn.yisuan.com` | CNAME | CDN厂商地址 |

## 9. 运营检查清单

- [ ] 配置 JWT_SECRET (256位随机字符串)
- [ ] 修改默认管理员密码
- [ ] 配置 SMTP 邮件服务
- [ ] 申请支付宝/微信支付商户号
- [ ] 配置 OpenAI/DeepSeek API Key (可选)
- [ ] 部署前 `pnpm build` 验证无编译错误
- [ ] 部署前 `pnpm test` 验证测试通过
- [ ] 设置防火墙规则 (仅开放 80/443)
- [ ] 配置自动备份 cron 任务
- [ ] 配置 Grafana 告警规则

## 10. 故障恢复

```bash
# 场景1: 前端服务异常
docker compose -f docker-compose.prod.yml restart frontend

# 场景2: 数据库恢复
docker compose -f docker-compose.prod.yml stop backend
PGPASSWORD=$DB_PASSWORD pg_restore -h localhost -U yisuan -d yisuan /backup/yisuan_latest.dump
docker compose -f docker-compose.prod.yml start backend

# 场景3: 全部重启
docker compose -f docker-compose.prod.yml restart

# 场景4: SSL证书过期
certbot renew --force-renewal
docker compose -f docker-compose.prod.yml restart nginx

# 场景5: 磁盘空间不足
docker system prune -af  # 清理未使用的镜像/容器
journalctl --vacuum-size=500M  # 清理系统日志
```

---

**文档版本**: v1.0  
**最后更新**: 2024年  
**维护**: 易算运维团队
