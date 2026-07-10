import { Injectable, Logger } from '@nestjs/common';
import { calculateZiwei } from './core';

@Injectable()
export class ZiweiService {
  private readonly logger = new Logger(ZiweiService.name);

  calculate(input: {
    birthYear: number; birthMonth: number; birthDay: number;
    birthHour: number; gender: 'male' | 'female';
  }) {
    this.logger.log(`紫微排盘: ${input.birthYear}-${input.birthMonth}-${input.birthDay} ${input.birthHour}时`);
    return calculateZiwei(
      input.birthYear, input.birthMonth, input.birthDay,
      input.birthHour, input.gender,
    );
  }
}
