import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Req() req: any) {
    return this.usersService.getUser(req.user.id);
  }

  @Put('me')
  updateMe(@Req() req: any, @Body() dto: { nickname?: string; avatarUrl?: string }) {
    return this.usersService.updateUser(req.user.id, dto);
  }

  @Get('profile')
  getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('profile')
  updateProfile(@Req() req: any, @Body() dto: any) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Get('charts')
  getMyCharts(@Req() req: any) {
    return this.usersService.getMyCharts(req.user.id);
  }

  @Get('analysis-records')
  getMyAnalysisRecords(@Req() req: any) {
    return this.usersService.getMyAnalysisRecords(req.user.id);
  }
}
