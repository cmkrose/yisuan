import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: { email?: string; phone?: string; password: string; nickname?: string }) {
    const { email, phone, password, nickname } = dto;

    if (!email && !phone) {
      throw new UnauthorizedException('邮箱或手机号至少填写一项');
    }

    if (!nickname || !nickname.trim()) {
      throw new UnauthorizedException('昵称不能为空');
    }

    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: email || undefined }, { phone: phone || undefined }] },
    });
    if (existing) {
      throw new ConflictException('该邮箱或手机号已注册');
    }

    const existingNickname = await this.prisma.user.findFirst({
      where: { nickname: nickname.trim() },
    });
    if (existingNickname) {
      throw new ConflictException('该昵称已被使用');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        nickname: nickname || '易算用户',
      },
    });

    await this.prisma.userProfile.create({
      data: { userId: user.id },
    });

    return this.generateToken(user);
  }

  async login(dto: { account: string; password: string }) {
    const { account, password } = dto;

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: account }, { phone: account }],
        status: 'active',
      },
    });

    if (!user) {
      throw new UnauthorizedException('账号或密码错误');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('账号或密码错误');
    }

    return this.generateToken(user);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) throw new UnauthorizedException('用户不存在');

    const { password, ...safe } = user;
    return safe;
  }

  private generateToken(user: { id: string; email: string | null; phone: string | null }) {
    const payload = { sub: user.id, email: user.email, phone: user.phone };

    return {
      accessToken: this.jwt.sign(payload),
      expiresIn: '7d',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
      },
    };
  }
}
