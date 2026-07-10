import { Controller, Post, Body } from '@nestjs/common';
import { ZeriService } from './zeri.service';

@Controller('api/zeri')
export class ZeriController {
  constructor(private readonly svc: ZeriService) {}

  @Post('day')
  day(@Body() dto: { year: number; month: number; day: number }) {
    return this.svc.getDay(dto);
  }

  @Post('select')
  select(@Body() dto: { year: number; month: number; purpose: 'wedding'|'business'|'moving'|'construction' }) {
    return this.svc.select(dto);
  }

  @Post('calendar')
  calendar(@Body() dto: { year: number; month: number }) {
    return this.svc.calendar(dto);
  }
}
