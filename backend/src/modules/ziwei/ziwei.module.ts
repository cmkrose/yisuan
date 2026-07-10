import { Module } from '@nestjs/common';
import { ZiweiController } from './ziwei.controller';
import { ZiweiService } from './ziwei.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ZiweiController],
  providers: [ZiweiService, PrismaService],
  exports: [ZiweiService],
})
export class ZiweiModule {}
