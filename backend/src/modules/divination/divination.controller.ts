import { Controller, Post, Body } from '@nestjs/common';
import { DivinationService } from './divination.service';

@Controller('api/divination')
export class DivinationController {
  constructor(private readonly svc: DivinationService) {}

  @Post('liuyao')
  liuyao() { return this.svc.liuyao(); }

  @Post('meihua/time')
  meihuaTime() { return this.svc.meihuaTime(); }

  @Post('meihua/number')
  meihuaNumber(@Body() dto: { numbers: number[] }) { return this.svc.meihuaNumber(dto.numbers); }

  @Post('meihua/name')
  meihuaName(@Body() dto: { name: string }) { return this.svc.meihuaName(dto.name); }

  @Post('xiaoliuren')
  xiaoLiuRen(@Body() dto: { month: number; day: number; hour: number }) {
    return this.svc.xiaoLiuRen(dto.month, dto.day, dto.hour);
  }

  @Post('xiaoliuren/quick')
  xiaoLiuRenQuick() { return this.svc.xiaoLiuRenQuick(); }

  @Post('xiaoliuren/random')
  xiaoLiuRenRandom() { return this.svc.xiaoLiuRenRandom(); }
}
