import { Injectable, Logger } from '@nestjs/common';
import { calculatePillars, analyzeBazi } from './core';

export interface BaziInput {
  name?: string; gender: 'male' | 'female';
  birthYear: number; birthMonth: number; birthDay: number; birthHour: number; birthPlace?: string;
}

@Injectable()
export class BaziService {
  private readonly logger = new Logger(BaziService.name);

  calculate(input: BaziInput): any {
    try {
      const bazi = calculatePillars(input.birthYear, input.birthMonth, input.birthDay, input.birthHour);
      const analysis = analyzeBazi(bazi, input.gender);

      const twelveHours = [
        { start: 23, end: 1, name: '子时' }, { start: 1, end: 3, name: '丑时' },
        { start: 3, end: 5, name: '寅时' }, { start: 5, end: 7, name: '卯时' },
        { start: 7, end: 9, name: '辰时' }, { start: 9, end: 11, name: '巳时' },
        { start: 11, end: 13, name: '午时' }, { start: 13, end: 15, name: '未时' },
        { start: 15, end: 17, name: '申时' }, { start: 17, end: 19, name: '酉时' },
        { start: 19, end: 21, name: '戌时' }, { start: 21, end: 23, name: '亥时' },
      ];
      const h = input.birthHour;
      const birthHourName = twelveHours.find(
        (t) => (h >= t.start && h < t.end) || (t.start === 23 && (h >= 23 || h < 1))
      )?.name || '未知';

      return {
        input: { name: input.name || '', gender: input.gender, birthYear: input.birthYear,
          birthMonth: input.birthMonth, birthDay: input.birthDay, birthHour: input.birthHour,
          birthHourName, birthPlace: input.birthPlace || '' },
        bazi, analysis,
      };
    } catch (e: any) {
      this.logger.error('Bazi calculate error: ' + e.message);
      return { error: e.message, input };
    }
  }
}
