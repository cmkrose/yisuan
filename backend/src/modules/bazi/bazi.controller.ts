import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { BaziService, BaziInput } from './bazi.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../../database/prisma.service';

@Controller('api/bazi')
export class BaziController {
  constructor(
    private readonly baziService: BaziService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('calculate')
  calculate(@Body() input: BaziInput) {
    return this.baziService.calculate(input);
  }

  @Post('save')
  @UseGuards(JwtAuthGuard)
  async save(@Req() req: any, @Body() input: BaziInput) {
    const result = this.baziService.calculate(input);

    const chart = await this.prisma.chart.create({
      data: {
        userId: req.user.id,
        chartType: 'bazi',
        title: `${input.name || '八字命盘'} - ${input.birthYear}年${input.birthMonth}月${input.birthDay}日`,
        inputData: input as any,
        chartData: result as any,
      },
    });

    await this.prisma.analysisRecord.create({
      data: {
        userId: req.user.id,
        chartId: chart.id,
        analysisType: 'bazi',
        inputData: input as any,
        resultData: result as any,
      },
    });

    return { chart, result };
  }
}
