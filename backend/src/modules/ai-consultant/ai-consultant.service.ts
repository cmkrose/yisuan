import { Injectable, Logger } from '@nestjs/common';
import { AiReportEngine, AiReport, AiRequest } from './core';

@Injectable()
export class AiConsultantService {
  private readonly logger = new Logger(AiConsultantService.name);
  private engine: AiReportEngine;

  constructor() {
    this.engine = new AiReportEngine();
  }

  async analyze(req: AiRequest & { conversationHistory?: { role: 'user'; content: string }[] }): Promise<AiReport> {
    this.logger.log(`AI分析: ${req.categories.join('、')} - ${req.question}`);
    return this.engine.analyze(req);
  }
}
