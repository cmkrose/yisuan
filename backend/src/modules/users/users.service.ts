import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException('用户资料不存在');
    }
    return profile;
  }

  async updateProfile(userId: string, dto: {
    realName?: string;
    gender?: string;
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    birthProvince?: string;
    birthCity?: string;
  }) {
    return this.prisma.userProfile.update({
      where: { userId },
      data: dto,
    });
  }

  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        nickname: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('用户不存在');
    return user;
  }

  async updateUser(userId: string, dto: { nickname?: string; avatarUrl?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        phone: true,
        nickname: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async getMyCharts(userId: string) {
    return this.prisma.chart.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getMyAnalysisRecords(userId: string) {
    return this.prisma.analysisRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
