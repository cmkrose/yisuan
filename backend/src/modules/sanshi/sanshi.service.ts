import { Injectable, Logger } from '@nestjs/common';
import { calculateQimen, analyzeQimen } from './qimen/engine';
import { calculateLiuren, analyzeLiuren } from './liuren/engine';

@Injectable()
export class SanshiService {
  private readonly logger = new Logger(SanshiService.name);

  qimen(input: { year: number; month: number; day: number; hour: number; birthYear?: number; birthMonth?: number; birthDay?: number; birthHour?: number; gender?: string; location?: string; purpose?: string }) {
    this.logger.log(`奇门遁甲: ${input.year}-${input.month}-${input.day} ${input.hour}时 purpose=${input.purpose}`);
    const chartData = calculateQimen(input.year, input.month, input.day, input.hour);
    const analysis = analyzeQimen(chartData, {
      year: input.year, month: input.month, day: input.day, hour: input.hour,
      birthYear: input.birthYear || 1990, birthMonth: input.birthMonth || 1,
      birthDay: input.birthDay || 1, birthHour: input.birthHour || 12,
      gender: input.gender || 'male', location: input.location || '未指定',
      purpose: input.purpose || 'general',
    });
    return { ...chartData, analysis };
  }

  liuren(input: { month: number; hour: number }) {
    this.logger.log(`大六壬: 月${input.month} 时${input.hour}`);
    const chartData = calculateLiuren(input.month, input.hour);
    const analysis = analyzeLiuren(chartData, input.month, input.hour);
    return { ...chartData, analysis };
  }
}
