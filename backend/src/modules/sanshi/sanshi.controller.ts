import { Controller, Post, Body } from '@nestjs/common';
import { SanshiService } from './sanshi.service';

@Controller('api/sanshi')
export class SanshiController {
  constructor(private readonly svc: SanshiService) {}

  @Post('qimen')
  qimen(@Body() dto: { year: number; month: number; day: number; hour: number }) {
    return this.svc.qimen(dto);
  }

  @Post('liuren')
  liuren(@Body() dto: { month: number; hour: number }) {
    return this.svc.liuren(dto);
  }
}
