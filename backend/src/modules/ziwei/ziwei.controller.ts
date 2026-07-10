import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ZiweiService } from './ziwei.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../../database/prisma.service';

@Controller('api/ziwei')
export class ZiweiController {
  constructor(
    private readonly ziweiService: ZiweiService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('calculate')
  calculate(@Body() input: any) {
    return this.ziweiService.calculate(input);
  }

  @Post('save')
  @UseGuards(JwtAuthGuard)
  async save(@Req() req: any, @Body() input: any) {
    const result = this.ziweiService.calculate(input);
    const chart = await this.prisma.chart.create({
      data: {
        userId: req.user.id,
        chartType: 'ziwei',
        title: `紫微命盘 - ${input.birthYear}年${input.birthMonth}月${input.birthDay}日`,
        inputData: input as any,
        chartData: result as any,
      },
    });
    await this.prisma.analysisRecord.create({
      data: {
        userId: req.user.id,
        chartId: chart.id,
        analysisType: 'ziwei',
        inputData: input as any,
        resultData: result as any,
      },
    });
    return { chart, result };
  }
}
