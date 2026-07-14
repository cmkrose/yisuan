import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly ADMIN_KEY = process.env.ADMIN_KEY || 'yisuan-admin-2024';
  private readonly ADMIN_PASSWORD_HASH: string;

  constructor(private prisma: PrismaService) {
    this.ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'yisuan123', 10);
  }

  // ============ 登录 ============
  async login(password: string) {
    const valid = await bcrypt.compare(password, this.ADMIN_PASSWORD_HASH);
    if (!valid) throw new Error('密码错误');
    return { token: this.ADMIN_KEY, role: 'admin' };
  }

  verifyToken(token: string) {
    return token === this.ADMIN_KEY;
  }

  // ============ 仪表盘统计 ============
  async getDashboard() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalUsers, todayUsers, totalAnalyses, chartStats] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.analysisRecord.count(),
      this.prisma.chart.groupBy({ by: ['chartType'], _count: true }),
    ]);

    const featureUsage = (chartStats as any[]).map((c: any) => ({
      name: chartTypeLabel(c.chartType),
      count: c._count,
    })).sort((a: any, b: any) => b.count - a.count);

    const totalVisits = totalAnalyses;

    return { totalUsers, todayUsers, totalVisits, featureUsage, topFeature: featureUsage[0]?.name || '暂无' };
  }

  // ============ 用户列表 ============
  async getUsers(search?: string, page = 1, limit = 20) {
    const where: any = {};
    if (search) {
      where.OR = [
        { nickname: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true, nickname: true, email: true, phone: true,
          status: true, createdAt: true,
          _count: { select: { charts: true, analysisRecords: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  // ============ 用户历史 ============
  async getUserHistory(userId: string) {
    const [user, charts, analyses] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, nickname: true, email: true, phone: true, status: true, createdAt: true },
      }),
      this.prisma.chart.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.analysisRecord.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    const featureUsage = new Map<string, number>();
    for (const c of charts) {
      const label = chartTypeLabel(c.chartType);
      featureUsage.set(label, (featureUsage.get(label) || 0) + 1);
    }

    return { user, chartCount: charts.length, analysisCount: analyses.length, featureUsage: Array.from(featureUsage.entries()).map(([name, count]) => ({ name, count })), recentAnalyses: analyses.slice(0, 10) };
  }

  // ============ 功能统计 ============
  async getFeatureStats() {
    const charts = await this.prisma.chart.findMany({
      select: { chartType: true, userId: true, user: { select: { nickname: true } } },
    });
    const analyses = await this.prisma.analysisRecord.findMany({
      select: { analysisType: true, userId: true, user: { select: { nickname: true } } },
    });

    const typeMap = new Map<string, { users: Map<string, { name: string; count: number; lastUsed: Date }>; total: number }>();

    for (const c of charts) {
      const type = chartTypeLabel(c.chartType);
      if (!typeMap.has(type)) typeMap.set(type, { users: new Map(), total: 0 });
      const t = typeMap.get(type)!;
      t.total++;
      const uid = c.userId;
      if (!t.users.has(uid)) t.users.set(uid, { name: c.user?.nickname || '未知', count: 0, lastUsed: new Date(0) });
      t.users.get(uid)!.count++;
    }

    for (const a of analyses) {
      const type = chartTypeLabel(a.analysisType);
      if (!typeMap.has(type)) typeMap.set(type, { users: new Map(), total: 0 });
      const t = typeMap.get(type)!;
      t.total++;
      const uid = a.userId;
      if (!t.users.has(uid)) t.users.set(uid, { name: a.user?.nickname || '未知', count: 0, lastUsed: new Date(0) });
      t.users.get(uid)!.count++;
    }

    return Array.from(typeMap.entries())
      .map(([type, data]) => ({
        type,
        total: data.total,
        userCount: data.users.size,
        users: Array.from(data.users.entries())
          .map(([userId, u]) => ({ userId, nickname: u.name, count: u.count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
      }))
      .sort((a, b) => b.total - a.total);
  }

  // ============ 反馈 ============
  async submitFeedback(dto: { content: string; type: string; userId?: string }) {
    return this.prisma.feedback.create({
      data: {
        content: dto.content,
        feedbackType: dto.type || '建议',
        userId: dto.userId || null,
      },
    });
  }

  async getFeedbacks(page = 1, limit = 20) {
    const [items, total] = await Promise.all([
      this.prisma.feedback.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.feedback.count(),
    ]);
    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  // ============ 健康检查 ============
  async healthCheck() {
    const checks: { name: string; status: 'ok' | 'error'; message: string }[] = [];

    try { await this.prisma.$queryRaw`SELECT 1`; checks.push({ name: '数据库', status: 'ok', message: 'SQLite 正常' }); }
    catch { checks.push({ name: '数据库', status: 'error', message: '数据库连接失败' }); }

    const totalUsers = await this.prisma.user.count();
    const todayCharts = await this.prisma.chart.count({
      where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) } },
    });
    checks.push({ name: '流量', status: 'ok', message: `${totalUsers} 注册用户，今日 ${todayCharts} 次使用` });

    return { status: checks.every((c) => c.status === 'ok') ? 'healthy' : 'degraded', checks };
  }
}

function chartTypeLabel(type: string): string {
  const map: Record<string, string> = {
    bazi:'八字命理', ziwei:'紫微斗数', name:'姓名学', fengshui:'风水堪舆',
    zeri:'择日', qimen:'奇门遁甲', liuren:'大六壬', knowledge:'知识库',
    divination:'占卜预测', analysis:'在线排盘',
  };
  return map[type] || type;
}
