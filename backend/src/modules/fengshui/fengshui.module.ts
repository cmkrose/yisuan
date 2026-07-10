import { Module } from '@nestjs/common';
import { FengshuiController } from './fengshui.controller';
import { FengshuiService } from './fengshui.service';

@Module({
  controllers: [FengshuiController],
  providers: [FengshuiService],
  exports: [FengshuiService],
})
export class FengshuiModule {}
