import { Controller, Post } from '@nestjs/common';
import { VisualAnalysisService } from './visual-analysis.service';

@Controller('api/visual')
export class VisualAnalysisController {
  constructor(private readonly svc: VisualAnalysisService) {}

  @Post('face')
  analyzeFace() { return this.svc.analyzeFace(); }

  @Post('palm')
  analyzePalm() { return this.svc.analyzePalm(); }
}
