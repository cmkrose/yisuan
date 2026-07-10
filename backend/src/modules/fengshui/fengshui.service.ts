import { Injectable, Logger } from '@nestjs/common';
import { calculateEightMansion, calculateFlyingStars, getCompassData, analyzeHouse } from './core';

@Injectable()
export class FengshuiService {
  private readonly logger = new Logger(FengshuiService.name);

  eightMansion(dto: { birthYear: number; gender: 'male' | 'female' }) {
    this.logger.log(`八宅: ${dto.birthYear} ${dto.gender}`);
    return calculateEightMansion(dto.birthYear, dto.gender);
  }

  flyingStars(dto: { year: number }) {
    this.logger.log(`飞星: ${dto.year}`);
    return calculateFlyingStars(dto.year);
  }

  compass() {
    return getCompassData();
  }

  analyze(dto: { year: number; facing: string }) {
    this.logger.log(`住宅分析: ${dto.year} ${dto.facing}`);
    return analyzeHouse(dto.year, dto.facing);
  }
}
