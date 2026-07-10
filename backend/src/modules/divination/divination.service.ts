import { Injectable, Logger } from '@nestjs/common';
import { analyzeLiuyao, timeDivination, numberDivination, nameDivination, xiaoLiuRenDivine, quickDivine, randomDivine } from './core';

@Injectable()
export class DivinationService {
  private readonly logger = new Logger(DivinationService.name);

  // 六爻
  liuyao() {
    this.logger.log('六爻纳甲起卦');
    return analyzeLiuyao();
  }

  // 梅花 - 时间
  meihuaTime() {
    this.logger.log('梅花易数时间起卦');
    return timeDivination(new Date());
  }

  // 梅花 - 数字
  meihuaNumber(nums: number[]) {
    this.logger.log(`梅花易数数字起卦: ${nums.join(',')}`);
    return numberDivination(nums);
  }

  // 梅花 - 姓名
  meihuaName(name: string) {
    this.logger.log(`梅花易数姓名起卦: ${name}`);
    return nameDivination(name);
  }

  // 小六壬 - 农历月日时
  xiaoLiuRen(month: number, day: number, hour: number) {
    this.logger.log(`小六壬: ${month}月${day}日${hour}时`);
    return xiaoLiuRenDivine(month, day, hour);
  }

  // 小六壬 - 即时
  xiaoLiuRenQuick() {
    return quickDivine();
  }

  // 小六壬 - 随机
  xiaoLiuRenRandom() {
    return randomDivine();
  }
}
