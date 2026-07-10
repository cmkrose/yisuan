import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BaziModule } from './modules/bazi/bazi.module';
import { NameAnalysisModule } from './modules/name-analysis/name-analysis.module';
import { ZiweiModule } from './modules/ziwei/ziwei.module';
import { DivinationModule } from './modules/divination/divination.module';
import { SanshiModule } from './modules/sanshi/sanshi.module';
import { FengshuiModule } from './modules/fengshui/fengshui.module';
import { ZeriModule } from './modules/zeri/zeri.module';
import { AiConsultantModule } from './modules/ai-consultant/ai-consultant.module';
import { VisualAnalysisModule } from './modules/visual-analysis/visual-analysis.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [AuthModule, UsersModule, BaziModule, NameAnalysisModule, ZiweiModule, DivinationModule, SanshiModule, FengshuiModule, ZeriModule, AiConsultantModule, VisualAnalysisModule, KnowledgeBaseModule, AdminModule],
})
export class AppModule {}
