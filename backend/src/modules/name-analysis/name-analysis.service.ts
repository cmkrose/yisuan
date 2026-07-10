import { Injectable, Logger } from '@nestjs/common';
import { analyzeName, suggestNames, NameInput, NameAnalysisResult } from './core/analyzer';

@Injectable()
export class NameAnalysisService {
  private readonly logger = new Logger(NameAnalysisService.name);

  analyze(input: NameInput) {
    this.logger.log(`分析姓名: ${input.surname}${input.givenName}`);
    return analyzeName({ ...input, gender: input.gender || 'male' });
  }

  suggest(input: { surname: string; gender: 'male' | 'female'; count?: number }) {
    this.logger.log(`生成改名建议: ${input.surname} ${input.gender}`);
    return suggestNames(input.surname, input.gender || 'male', input.count || 5);
  }
}
