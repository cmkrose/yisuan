import { Controller, Post, Body, Get } from '@nestjs/common';
import { FengshuiService } from './fengshui.service';

@Controller('api/fengshui')
export class FengshuiController {
  constructor(private readonly svc: FengshuiService) {}

  @Post('eight-mansion')
  eightMansion(@Body() dto: { birthYear: number; gender: 'male' | 'female' }) {
    return this.svc.eightMansion(dto);
  }

  @Post('flying-stars')
  flyingStars(@Body() dto: { year: number }) {
    return this.svc.flyingStars(dto);
  }

  @Get('compass')
  compass() { return this.svc.compass(); }

  @Post('analyze')
  analyze(@Body() dto: { year: number; facing: string }) {
    return this.svc.analyze(dto);
  }
}
