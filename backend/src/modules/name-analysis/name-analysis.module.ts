import { Module } from '@nestjs/common';
import { NameAnalysisController } from './name-analysis.controller';
import { NameAnalysisService } from './name-analysis.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [NameAnalysisController],
  providers: [NameAnalysisService, PrismaService],
  exports: [NameAnalysisService],
})
export class NameAnalysisModule {}
