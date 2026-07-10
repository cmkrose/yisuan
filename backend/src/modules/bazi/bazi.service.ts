import { Injectable, Logger } from '@nestjs/common';
import { calculatePillars, analyzeBazi, BaziAnalysis } from './core';

export interface BaziInput {
  name?: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthPlace?: string;
}

@Injectable()
export class BaziService {
  private readonly logger = new Logger(BaziService.name);

  calculate(input: BaziInput) {
    this.logger.log(`八字排盘: ${input.birthYear}-${input.birthMonth}-${input.birthDay} ${input.birthHour}时`);

    const bazi = calculatePillars(
      input.birthYear,
      input.birthMonth,
      input.birthDay,
      input.birthHour,
    );

    const analysis = analyzeBazi(bazi, input.gender);

    const h = input.birthHour;
    const twelveHours = [
      { start: 23, end: 1, name: '子时', key: 'zi' },
      { start: 1, end: 3, name: '丑时', key: 'chou' },
      { start: 3, end: 5, name: '寅时', key: 'yin' },
      { start: 5, end: 7, name: '卯时', key: 'mao' },
      { start: 7, end: 9, name: '辰时', key: 'chen' },
      { start: 9, end: 11, name: '巳时', key: 'si' },
      { start: 11, end: 13, name: '午时', key: 'wu' },
      { start: 13, end: 15, name: '未时', key: 'wei' },
      { start: 15, end: 17, name: '申时', key: 'shen' },
      { start: 17, end: 19, name: '酉时', key: 'you' },
      { start: 19, end: 21, name: '戌时', key: 'xu' },
      { start: 21, end: 23, name: '亥时', key: 'hai' },
    ];
    const birthHourName = twelveHours.find(
      (t) => (h >= t.start && h < t.end) || (t.start === 23 && (h >= 23 || h < 1))
    )?.name || '未知';

    return {
      input: {
        name: input.name || '',
        gender: input.gender,
        birthYear: input.birthYear,
        birthMonth: input.birthMonth,
        birthDay: input.birthDay,
        birthHour: input.birthHour,
        birthHourName,
        birthPlace: input.birthPlace || '',
      },
      bazi,
      analysis,
    };
  }
}
