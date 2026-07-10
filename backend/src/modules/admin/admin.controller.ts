import { Controller, Post, Get, Body, Query, Headers, HttpException } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly svc: AdminService) {}

  private guard(h: Record<string, string>) {
    const token = h['authorization']?.replace('Bearer ', '');
    if (!this.svc.verifyToken(token || '')) throw new HttpException('未授权', 401);
  }

  @Post('login')
  login(@Body() dto: { password: string }) { return this.svc.login(dto.password); }

  @Post('feedback')
  feedback(@Body() dto: { content: string; type: string; userId?: string }) { return this.svc.submitFeedback(dto); }

  @Get('dashboard')
  dashboard(@Headers() h: Record<string, string>) { this.guard(h); return this.svc.getDashboard(); }

  @Get('users')
  users(@Headers() h: Record<string, string>, @Query('search') q?: string, @Query('page') p?: string) {
    this.guard(h); return this.svc.getUsers(q, Number(p) || 1);
  }

  @Get('user-detail')
  userDetail(@Headers() h: Record<string, string>, @Query('id') id: string) {
    this.guard(h); return this.svc.getUserHistory(id);
  }

  @Get('features')
  features(@Headers() h: Record<string, string>) { this.guard(h); return this.svc.getFeatureStats(); }

  @Get('feedbacks')
  feedbacks(@Headers() h: Record<string, string>, @Query('page') p?: string) {
    this.guard(h); return this.svc.getFeedbacks(Number(p) || 1);
  }

  @Get('health')
  health(@Headers() h: Record<string, string>) { this.guard(h); return this.svc.healthCheck(); }
}
