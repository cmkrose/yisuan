import { Module } from '@nestjs/common';
import { BaziController } from './bazi.controller';
import { BaziService } from './bazi.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [BaziController],
  providers: [BaziService, PrismaService],
  exports: [BaziService],
})
export class BaziModule {}
