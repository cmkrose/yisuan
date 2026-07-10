import { Module } from '@nestjs/common';
import { VisualAnalysisController } from './visual-analysis.controller';
import { VisualAnalysisService } from './visual-analysis.service';

@Module({
  controllers: [VisualAnalysisController],
  providers: [VisualAnalysisService],
  exports: [VisualAnalysisService],
})
export class VisualAnalysisModule {}
