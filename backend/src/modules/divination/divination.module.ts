import { Module } from '@nestjs/common';
import { DivinationController } from './divination.controller';
import { DivinationService } from './divination.service';

@Module({
  controllers: [DivinationController],
  providers: [DivinationService],
  exports: [DivinationService],
})
export class DivinationModule {}
