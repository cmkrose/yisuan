import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { NameAnalysisService } from './name-analysis.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../../database/prisma.service';

@Controller('api/name-analysis')
export class NameAnalysisController {
  constructor(
    private readonly nameService: NameAnalysisService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('analyze')
  analyze(@Body() input: { surname: string; givenName: string; gender: 'male' | 'female'; birthDate?: string }) {
    return this.nameService.analyze(input);
  }

  @Post('suggest')
  suggest(@Body() input: { surname: string; gender: 'male' | 'female'; count?: number }) {
    return this.nameService.suggest(input);
  }

  @Post('save')
  @UseGuards(JwtAuthGuard)
  async save(@Req() req: any, @Body() input: { surname: string; givenName: string; gender: 'male' | 'female' }) {
    const result = this.nameService.analyze(input);

    const chart = await this.prisma.chart.create({
      data: {
        userId: req.user.id,
        chartType: 'name',
        title: `姓名分析 - ${input.surname}${input.givenName}`,
        inputData: input as any,
        chartData: result as any,
      },
    });

    await this.prisma.analysisRecord.create({
      data: {
        userId: req.user.id,
        chartId: chart.id,
        analysisType: 'name',
        inputData: input as any,
        resultData: result as any,
      },
    });

    return { chart, result };
  }
}
