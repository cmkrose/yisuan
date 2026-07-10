import { Module } from '@nestjs/common';
import { SanshiController } from './sanshi.controller';
import { SanshiService } from './sanshi.service';

@Module({
  controllers: [SanshiController],
  providers: [SanshiService],
  exports: [SanshiService],
})
export class SanshiModule {}
