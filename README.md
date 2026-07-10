# 《易算》- 东方传统文化智能分析平台

<p align="center">
  <strong>集八字命理、姓名学、紫微斗数、风水、占卜、择日、AI分析于一体的综合网站</strong>
</p>

---

## 项目简介

《易算》是一个基于现代AI技术的东方传统文化智能分析平台，致力于为用户提供专业、准确、易用的命理分析服务。

### 核心功能

- **八字命理** - 四柱八字排盘、五行分析、十神分析、大运流年
- **姓名学** - 姓名五格分析、三才配置、姓名吉凶
- **紫微斗数** - 紫微星盘排盘、宫位分析、星曜解读
- **风水分析** - 八宅风水、玄空飞星、罗盘分析
- **占卜预测** - 六爻占卜、梅花易数
- **择日查询** - 结婚择日、搬家择日、开业择日
- **AI分析** - 智能解读、综合分析报告

## 技术栈

### 前端

- **框架**: Next.js 14 (App Router)
- **UI库**: React 18 + TypeScript
- **样式**: Tailwind CSS 3
- **动画**: Framer Motion
- **状态管理**: Zustand
- **数据获取**: React Query

### 后端

- **框架**: NestJS 10
- **ORM**: Prisma
- **数据库**: PostgreSQL 16 + Redis 7 + MongoDB 7
- **认证**: JWT + Passport
- **API文档**: Swagger

### DevOps

- **容器化**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **反向代理**: Nginx
- **监控**: Prometheus + Grafana

## 项目结构

```
yisuan/
├── frontend/          # Next.js前端应用
├── backend/           # NestJS后端服务
├── shared/            # 共享类型和工具
│   ├── types/         # 共享类型定义
│   ├── constants/     # 共享常量
│   └── utils/         # 共享工具函数
├── deploy/            # 部署配置
├── docs/              # 项目文档
└── docker-compose.yml # Docker配置
```

## 快速开始

### 环境要求

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-org/yisuan.git
cd yisuan
```

2. **安装依赖**
```bash
pnpm install
```

3. **启动数据库**
```bash
docker-compose up -d postgres redis mongodb
```

4. **初始化数据库**
```bash
cd backend
pnpm db:migrate
pnpm db:seed
```

5. **启动开发服务器**
```bash
# 在项目根目录
pnpm dev
```

6. **访问应用**
- 前端: http://localhost:3000
- 后端API: http://localhost:3001
- API文档: http://localhost:3001/api/docs

## 文档

- [架构设计文档](./docs/architecture.md)
- [数据库设计文档](./docs/database.md)
- [API文档](./docs/api.md)
- [开发指南](./docs/development.md)
- [部署文档](./docs/deployment.md)

## 开发路线图

| 阶段 | 时间 | 目标 |
|------|------|------|
| 第一阶段 | Week 1-4 | 基础架构、用户系统 |
| 第二阶段 | Week 5-12 | 核心功能（八字、姓名、占卜） |
| 第三阶段 | Week 13-18 | 扩展功能（紫微、风水、择日） |
| 第四阶段 | Week 19-22 | 智能化（AI分析、推荐） |

详细路线图请查看 [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md)

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目主页: https://github.com/your-org/yisuan
- 问题反馈: https://github.com/your-org/yisuan/issues
- 邮箱: contact@yisuan.com
