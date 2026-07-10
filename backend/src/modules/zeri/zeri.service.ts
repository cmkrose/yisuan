import { Injectable, Logger } from '@nestjs/common';
import { getDayInfo, selectDates, getMonthCalendar } from './core';

@Injectable()
export class ZeriService {
  private readonly logger = new Logger(ZeriService.name);

  getDay(dto: { year: number; month: number; day: number }) {
    return getDayInfo(dto.year, dto.month, dto.day);
  }

  select(dto: { year: number; month: number; purpose: 'wedding'|'business'|'moving'|'construction' }) {
    this.logger.log(`择日: ${dto.year}年${dto.month}月 ${dto.purpose}`);
    return selectDates(dto.year, dto.month, dto.purpose);
  }

  calendar(dto: { year: number; month: number }) {
    return getMonthCalendar(dto.year, dto.month);
  }
}
