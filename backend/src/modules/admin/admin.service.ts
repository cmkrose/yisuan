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
    const chartStats = await this.prisma.chart.groupBy({ by: ['chartType'], _count: true });
    const analysisStats = await this.prisma.analysisRecord.groupBy({ by: ['analysisType'], _count: true });

    const allTypes = ['bazi','ziwei','name','fengshui','divination','zeri','ai','liuyao','meihua','xiaoliuren','qimen'];

    const merged = new Map<string, { charts: number; analyses: number }>();
    for (const t of allTypes) merged.set(t, { charts: 0, analyses: 0 });
    for (const s of chartStats) {
      const m = merged.get(s.chartType) || { charts: 0, analyses: 0 };
      m.charts = s._count;
      merged.set(s.chartType, m);
    }
    for (const s of analysisStats) {
      const m = merged.get(s.analysisType) || { charts: 0, analyses: 0 };
      m.analyses = s._count;
      merged.set(s.analysisType, m);
    }

    return Array.from(merged.entries())
      .map(([type, counts]) => ({
        type: chartTypeLabel(type),
        key: type,
        charts: counts.charts,
        analyses: counts.analyses,
        total: counts.charts + counts.analyses,
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

    try { await this.prisma.$queryRaw`SELECT 1`; checks.push({ name: '数据库', status: 'ok', message: 'PostgreSQL 正常' }); }
    catch { checks.push({ name: '数据库', status: 'error', message: 'PostgreSQL 连接失败' }); }

    try {
      const res = await fetch(process.env.LLM_BASE_URL + '/models', { headers: { Authorization: `Bearer ${process.env.LLM_API_KEY}` } });
      checks.push({ name: 'AI接口', status: res.ok ? 'ok' : 'error', message: res.ok ? 'LLM API 正常' : `LLM API 状态码 ${res.status}` });
    } catch {
      checks.push({ name: 'AI接口', status: 'error', message: 'LLM API 未配置或不可达' });
    }

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
    divination:'占卜预测', zeri:'择日', ai:'AI命理', liuyao:'六爻',
    meihua:'梅花易数', xiaoliuren:'小六壬', qimen:'奇门遁甲', sanshi:'三式',
    analysis:'在线排盘',
  };
  return map[type] || type;
}
