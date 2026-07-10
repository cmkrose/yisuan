import { Injectable, Logger } from '@nestjs/common';
import { analyzeFace } from './face-analysis/engine';
import { analyzePalm } from './palm-analysis/engine';

@Injectable()
export class VisualAnalysisService {
  private readonly logger = new Logger(VisualAnalysisService.name);

  analyzeFace() {
    this.logger.log('面相分析');
    return analyzeFace();
  }

  analyzePalm() {
    this.logger.log('手相分析');
    return analyzePalm();
  }
}
