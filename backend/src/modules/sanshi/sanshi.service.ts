import { Injectable, Logger } from '@nestjs/common';
import { calculateQimen } from './qimen/engine';
import { calculateLiuren } from './liuren/engine';

@Injectable()
export class SanshiService {
  private readonly logger = new Logger(SanshiService.name);

  qimen(input: { year: number; month: number; day: number; hour: number }) {
    this.logger.log(`奇门遁甲: ${input.year}-${input.month}-${input.day} ${input.hour}时`);
    return calculateQimen(input.year, input.month, input.day, input.hour);
  }

  liuren(input: { month: number; hour: number }) {
    this.logger.log(`大六壬: 月${input.month} 时${input.hour}`);
    return calculateLiuren(input.month, input.hour);
  }
}
