import { Module } from '@nestjs/common';
import { ZeriController } from './zeri.controller';
import { ZeriService } from './zeri.service';

@Module({
  controllers: [ZeriController],
  providers: [ZeriService],
  exports: [ZeriService],
})
export class ZeriModule {}
