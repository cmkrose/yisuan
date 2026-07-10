import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();

    this.$use(async (params, next) => {
      if (params.model === 'Chart' || params.model === 'AnalysisRecord') {
        const jsonFields = ['inputData', 'chartData', 'resultData'];

        for (const field of jsonFields) {
          const val = params.args?.data?.[field];
          if (val !== undefined && typeof val === 'object') {
            params.args.data[field] = JSON.stringify(val);
          }
        }

        const result = await next(params);

        if (Array.isArray(result)) {
          for (const item of result) {
            for (const field of jsonFields) {
              if (typeof item?.[field] === 'string') {
                try { item[field] = JSON.parse(item[field]); } catch {}
              }
            }
          }
        } else if (result) {
          for (const field of jsonFields) {
            if (typeof result[field] === 'string') {
              try { result[field] = JSON.parse(result[field]); } catch {}
            }
          }
        }

        return result;
      }
      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
