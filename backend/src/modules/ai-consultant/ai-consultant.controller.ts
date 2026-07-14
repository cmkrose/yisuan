import { Controller, Post, Body } from '@nestjs/common';
import { AiConsultantService } from './ai-consultant.service';

@Controller('api/ai-consultant')
export class AiConsultantController {
  constructor(private readonly svc: AiConsultantService) {}

  @Post('analyze')
  analyze(@Body() req: {
    question: string;
    categories: ('bazi'|'ziwei'|'divination')[];
    baziData?: any;
    ziweiData?: any;
    divinationData?: any;
    conversationHistory?: { role: 'user'; content: string }[];
  }) {
    return this.svc.analyze(req);
  }
}
