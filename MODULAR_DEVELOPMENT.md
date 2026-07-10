# 《易算》智能分析平台 - 模块化开发方案

## 1. 模块化设计原则

### 1.1 核心设计思想

```
┌─────────────────────────────────────────────────────────────────┐
│                    模块化设计原则 (Modular Design Principles)    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 单一职责原则 (SRP)                                          │
│     每个模块只负责一个特定的业务功能                              │
│                                                                 │
│  2. 开闭原则 (OCP)                                              │
│     模块对扩展开放，对修改关闭                                   │
│                                                                 │
│  3. 依赖倒置原则 (DIP)                                          │
│     高层模块不依赖低层模块，都依赖抽象                           │
│                                                                 │
│  4. 接口隔离原则 (ISP)                                          │
│     模块间通过定义良好的接口通信                                 │
│                                                                 │
│  5. 最小知识原则 (LKP)                                          │
│     模块只了解与其直接交互的模块                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 模块边界定义

```
┌─────────────────────────────────────────────────────────────────┐
│                    模块边界 (Module Boundaries)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   共享层 (Shared Layer)                   │   │
│  │  • 类型定义 (Types)                                      │   │
│  │  • 常量定义 (Constants)                                  │   │
│  │  • 工具函数 (Utils)                                      │   │
│  │  • 通用组件 (Common Components)                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   核心层 (Core Layer)                     │   │
│  │  • 命理计算引擎 (Fortune Calculation Engine)              │   │
│  │  • 数据转换器 (Data Transformers)                        │   │
│  │  • 验证器 (Validators)                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   业务层 (Business Layer)                 │   │
│  │  • 八字模块 (Bazi Module)                                │   │
│  │  • 紫微模块 (Ziwei Module)                               │   │
│  │  • 风水模块 (Fengshui Module)                            │   │
│  │  • 占卜模块 (Divination Module)                          │   │
│  │  • 姓名模块 (Name Module)                                │   │
│  │  • 择日模块 (Zeri Module)                                │   │
│  │  • AI分析模块 (AI Analysis Module)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   接口层 (Interface Layer)                │   │
│  │  • REST API                                             │   │
│  │  • WebSocket                                            │   │
│  │  • GraphQL (可选)                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 2. 模块接口规范

### 2.1 命理模块接口

```typescript
// modules/fortune/types.ts

/**
 * 命理模块统一接口
 */
export interface IFortuneModule<TInput, TOutput, TAnalysis> {
  // 模块元数据
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly description: string;

  // 初始化
  init(config: ModuleConfig): Promise<void>;

  // 验证输入
  validateInput(input: unknown): input is TInput;

  // 计算
  calculate(input: TInput): Promise<TOutput>;

  // 分析
  analyze(input: TInput, output: TOutput): Promise<TAnalysis>;

  // 生成报告
  generateReport(analysis: TAnalysis): Promise<Report>;

  // 获取模板
  getTemplate(templateId: string): Promise<Template>;

  // 健康检查
  healthCheck(): Promise<boolean>;
}

// 模块配置
export interface ModuleConfig {
  enabled: boolean;
  options: Record<string, unknown>;
}

// 报告模板
export interface Template {
  id: string;
  name: string;
  type: 'html' | 'pdf' | 'json';
  content: string;
}
```

### 2.2 八字模块实现示例

```typescript
// modules/bazi/bazi.module.ts

import { IFortuneModule } from '../fortune/types';
import { BaziInput, BaziOutput, BaziAnalysis } from './types';

export class BaziModule implements IFortuneModule<BaziInput, BaziOutput, BaziAnalysis> {
  readonly id = 'bazi';
  readonly name = '八字命理';
  readonly version = '1.0.0';
  readonly description = '四柱八字排盘与分析';

  private initialized = false;

  async init(config: ModuleConfig): Promise<void> {
    // 初始化模块配置
    this.initialized = true;
  }

  validateInput(input: unknown): input is BaziInput {
    // 验证输入数据
    const { birthDate, gender } = input as BaziInput;
    return !!birthDate && !!gender;
  }

  async calculate(input: BaziInput): Promise<BaziOutput> {
    if (!this.initialized) {
      throw new Error('Module not initialized');
    }

    // 1. 计算四柱
    const pillars = this.calculatePillars(input);
    
    // 2. 计算十神
    const shishen = this.calculateShishen(pillars);
    
    // 3. 计算五行
    const wuxing = this.calculateWuxing(pillars);
    
    // 4. 计算纳音
    const nayin = this.calculateNayin(pillars);

    return {
      pillars,
      shishen,
      wuxing,
      nayin,
      dayMaster: pillars.dayPillar.tianGan,
      dayMasterElement: pillars.dayPillar.tianGanElement,
    };
  }

  async analyze(input: BaziInput, output: BaziOutput): Promise<BaziAnalysis> {
    // 1. 分析日主强弱
    const strength = this.analyzeStrength(output);
    
    // 2. 确定用神喜忌
    const yongshen = this.determineYongshen(output, strength);
    
    // 3. 分析大运流年
    const dayun = this.analyzeDayun(input, output);
    
    // 4. 综合分析
    const comprehensive = this.comprehensiveAnalysis(output, strength, yongshen);

    return {
      strength,
      yongshen,
      dayun,
      comprehensive,
    };
  }

  async generateReport(analysis: BaziAnalysis): Promise<Report> {
    // 生成HTML报告
    return {
      title: '八字命理分析报告',
      content: this.renderReport(analysis),
      type: 'html',
    };
  }

  async getTemplate(templateId: string): Promise<Template> {
    // 获取报告模板
    return this.templates[templateId];
  }

  async healthCheck(): Promise<boolean> {
    return this.initialized;
  }

  // 私有方法
  private calculatePillars(input: BaziInput): Pillars {
    // 实现四柱计算逻辑
    return {} as Pillars;
  }

  private calculateShishen(pillars: Pillars): Record<string, number> {
    // 实现十神计算逻辑
    return {};
  }

  private calculateWuxing(pillars: Pillars): WuxingDistribution {
    // 实现五行计算逻辑
    return {} as WuxingDistribution;
  }

  private calculateNayin(pillars: Pillars): string {
    // 实现纳音计算逻辑
    return '';
  }

  private analyzeStrength(output: BaziOutput): StrengthAnalysis {
    // 实现日主强弱分析
    return {} as StrengthAnalysis;
  }

  private determineYongshen(output: BaziOutput, strength: StrengthAnalysis): Yongshen {
    // 实现用神喜忌分析
    return {} as Yongshen;
  }

  private analyzeDayun(input: BaziInput, output: BaziOutput): DayunAnalysis {
    // 实现大运分析
    return {} as DayunAnalysis;
  }

  private comprehensiveAnalysis(
    output: BaziOutput,
    strength: StrengthAnalysis,
    yongshen: Yongshen
  ): ComprehensiveAnalysis {
    // 实现综合分析
    return {} as ComprehensiveAnalysis;
  }

  private renderReport(analysis: BaziAnalysis): string {
    // 渲染HTML报告
    return '';
  }
}
```

### 2.3 模块注册表

```typescript
// modules/registry.ts

import { IFortuneModule } from './fortune/types';

export class FortuneModuleRegistry {
  private static instance: FortuneModuleRegistry;
  private modules: Map<string, IFortuneModule<any, any, any>> = new Map();
  private initialized = false;

  private constructor() {}

  static getInstance(): FortuneModuleRegistry {
    if (!FortuneModuleRegistry.instance) {
      FortuneModuleRegistry.instance = new FortuneModuleRegistry();
    }
    return FortuneModuleRegistry.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // 动态加载所有模块
    const modules = await this.loadModules();
    
    for (const module of modules) {
      await module.init({
        enabled: true,
        options: {},
      });
      this.modules.set(module.id, module);
    }

    this.initialized = true;
  }

  async register<TInput, TOutput, TAnalysis>(
    module: IFortuneModule<TInput, TOutput, TAnalysis>
  ): Promise<void> {
    if (this.modules.has(module.id)) {
      throw new Error(`Module ${module.id} already registered`);
    }

    await module.init({
      enabled: true,
      options: {},
    });

    this.modules.set(module.id, module);
  }

  getModule(id: string): IFortuneModule<any, any, any> | undefined {
    return this.modules.get(id);
  }

  getAllModules(): IFortuneModule<any, any, any>[] {
    return Array.from(this.modules.values());
  }

  getEnabledModules(): IFortuneModule<any, any, any>[] {
    return this.getAllModules().filter(m => m.healthCheck());
  }

  async calculate<TInput, TOutput, TAnalysis>(
    moduleId: string,
    input: TInput
  ): Promise<TOutput> {
    const module = this.getModule(moduleId);
    if (!module) {
      throw new Error(`Module ${module.id} not found`);
    }

    if (!module.validateInput(input)) {
      throw new Error('Invalid input');
    }

    return module.calculate(input);
  }

  async analyze<TInput, TOutput, TAnalysis>(
    moduleId: string,
    input: TInput,
    output: TOutput
  ): Promise<TAnalysis> {
    const module = this.getModule(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }

    return module.analyze(input, output);
  }

  private async loadModules(): Promise<IFortuneModule<any, any, any>[]> {
    // 动态导入模块
    const { BaziModule } = await import('./bazi/bazi.module');
    const { ZiweiModule } = await import('./ziwei/ziwei.module');
    const { FengshuiModule } = await import('./fengshui/fengshui.module');
    const { DivinationModule } = await import('./divination/divination.module');
    const { NameModule } = await import('./name/name.module');

    return [
      new BaziModule(),
      new ZiweiModule(),
      new FengshuiModule(),
      new DivinationModule(),
      new NameModule(),
    ];
  }
}
```

## 3. 前端模块化设计

### 3.1 组件模块结构

```
frontend/src/components/
├── ui/                    # 基础UI组件 (无业务逻辑)
│   ├── button/
│   │   ├── Button.tsx
│   │   ├── ButtonGroup.tsx
│   │   ├── button.test.tsx
│   │   ├── button.stories.tsx
│   │   └── index.ts
│   ├── input/
│   ├── modal/
│   └── ...
│
├── charts/                # 命盘组件 (业务组件)
│   ├── BaziChart/
│   │   ├── BaziChart.tsx
│   │   ├── TianGanCell.tsx
│   │   ├── DiZhiCell.tsx
│   │   ├── WuXingChart.tsx
│   │   ├── bazi-chart.test.tsx
│   │   ├── bazi-chart.stories.tsx
│   │   └── index.ts
│   ├── ZiweiChart/
│   └── ...
│
├── forms/                 # 表单组件
│   ├── BaziForm/
│   │   ├── BaziForm.tsx
│   │   ├── DatePicker.tsx
│   │   ├── TimePicker.tsx
│   │   ├── validation.ts
│   │   └── index.ts
│   └── ...
│
└── analysis/              # 分析结果组件
    ├── AnalysisResult/
    ├── AIReport/
    └── ...
```

### 3.2 状态管理模块

```typescript
// store/index.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// 认证状态
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,

        login: async (credentials: LoginCredentials) => {
          const response = await authApi.login(credentials);
          set((state) => {
            state.user = response.user;
            state.token = response.token;
            state.isAuthenticated = true;
          });
        },

        logout: () => {
          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
          });
        },

        updateUser: (user: User) => {
          set((state) => {
            state.user = user;
          });
        },
      })),
      {
        name: 'auth-storage',
        partialize: (state) => ({ token: state.token }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// 命盘状态
export const useChartStore = create<ChartState>()(
  devtools(
    immer((set, get) => ({
      charts: [],
      currentChart: null,
      isLoading: false,

      fetchCharts: async () => {
        set((state) => {
          state.isLoading = true;
        });

        const charts = await chartApi.getAll();
        
        set((state) => {
          state.charts = charts;
          state.isLoading = false;
        });
      },

      createChart: async (input: CreateChartInput) => {
        const chart = await chartApi.create(input);
        
        set((state) => {
          state.charts.unshift(chart);
        });

        return chart;
      },

      setCurrentChart: (chart: Chart) => {
        set((state) => {
          state.currentChart = chart;
        });
      },

      deleteChart: async (id: string) => {
        await chartApi.delete(id);
        
        set((state) => {
          state.charts = state.charts.filter((c) => c.id !== id);
          if (state.currentChart?.id === id) {
            state.currentChart = null;
          }
        });
      },
    })),
    { name: 'ChartStore' }
  )
);

// 分析状态
export const useAnalysisStore = create<AnalysisState>()(
  devtools(
    immer((set, get) => ({
      analyses: [],
      currentAnalysis: null,
      isLoading: false,

      performAnalysis: async (input: AnalysisInput) => {
        set((state) => {
          state.isLoading = true;
        });

        const analysis = await analysisApi.perform(input);
        
        set((state) => {
          state.analyses.unshift(analysis);
          state.currentAnalysis = analysis;
          state.isLoading = false;
        });

        return analysis;
      },

      fetchAnalyses: async (chartId: string) => {
        set((state) => {
          state.isLoading = true;
        });

        const analyses = await analysisApi.getByChartId(chartId);
        
        set((state) => {
          state.analyses = analyses;
          state.isLoading = false;
        });
      },

      clearCurrentAnalysis: () => {
        set((state) => {
          state.currentAnalysis = null;
        });
      },
    })),
    { name: 'AnalysisStore' }
  )
);
```

### 3.3 API模块设计

```typescript
// lib/api/client.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store';

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token过期，尝试刷新
          const refreshToken = useAuthStore.getState().refreshToken;
          if (refreshToken) {
            try {
              const response = await this.client.post('/auth/refresh', {
                refreshToken,
              });
              const { accessToken } = response.data;
              useAuthStore.getState().setToken(accessToken);
              
              // 重试原始请求
              error.config.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(error.config);
            } catch (refreshError) {
              useAuthStore.getState().logout();
              window.location.href = '/login';
            }
          } else {
            useAuthStore.getState().logout();
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = ApiClient.getInstance();
```

```typescript
// lib/api/modules/bazi.ts

import { apiClient } from '../client';
import { BaziInput, BaziOutput, BaziAnalysis, ApiResponse } from '@yisuan/shared-types';

export const baziApi = {
  /**
   * 八字排盘
   */
  async calculate(input: BaziInput): Promise<ApiResponse<BaziOutput>> {
    return apiClient.post('/bazi/calculate', input);
  },

  /**
   * 八字分析
   */
  async analyze(input: BaziInput): Promise<ApiResponse<BaziAnalysis>> {
    return apiClient.post('/bazi/analyze', input);
  },

  /**
   * 获取大运流年
   */
  async getDayun(birthDate: string, gender: string): Promise<ApiResponse<Dayun[]>> {
    return apiClient.get('/bazi/dayun', {
      params: { birthDate, gender },
    });
  },

  /**
   * 八字合婚
   */
  async compatibility(
    input1: BaziInput,
    input2: BaziInput
  ): Promise<ApiResponse<CompatibilityResult>> {
    return apiClient.post('/bazi/compatibility', { input1, input2 });
  },
};
```

## 4. 后端模块化设计

### 4.1 NestJS模块结构

```typescript
// modules/bazi/bazi.module.ts

import { Module } from '@nestjs/common';
import { BaziController } from './bazi.controller';
import { BaziService } from './bazi.service';
import { BaziCoreModule } from './core/bazi-core.module';
import { AnalysisModule } from '../analysis/analysis.module';
import { ChartsModule } from '../charts/charts.module';

@Module({
  imports: [
    BaziCoreModule,
    AnalysisModule,
    ChartsModule,
  ],
  controllers: [BaziController],
  providers: [BaziService],
  exports: [BaziService],
})
export class BaziModule {}
```

```typescript
// modules/bazi/bazi.controller.ts

import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BaziService } from './bazi.service';
import { CalculateBaziDto } from './dto/calculate-bazi.dto';
import { AnalyzeBaziDto } from './dto/analyze-bazi.dto';

@ApiTags('八字命理')
@Controller('bazi')
export class BaziController {
  constructor(private readonly baziService: BaziService) {}

  @Post('calculate')
  @ApiOperation({ summary: '八字排盘' })
  @ApiResponse({ status: 200, description: '排盘成功' })
  async calculate(@Body() dto: CalculateBaziDto) {
    return this.baziService.calculate(dto);
  }

  @Post('analyze')
  @ApiOperation({ summary: '八字分析' })
  @ApiResponse({ status: 200, description: '分析成功' })
  async analyze(@Body() dto: AnalyzeBaziDto) {
    return this.baziService.analyze(dto);
  }

  @Post('save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '保存命盘' })
  @ApiResponse({ status: 200, description: '保存成功' })
  async save(@Req() req, @Body() dto: AnalyzeBaziDto) {
    return this.baziService.save(req.user.id, dto);
  }

  @Post('compatibility')
  @ApiOperation({ summary: '八字合婚' })
  @ApiResponse({ status: 200, description: '合婚分析成功' })
  async compatibility(@Body() dto: CompatibilityDto) {
    return this.baziService.compatibility(dto);
  }
}
```

```typescript
// modules/bazi/bazi.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { BaziCoreService } from './core/bazi-core.service';
import { AnalysisService } from '../analysis/analysis.service';
import { ChartsService } from '../charts/charts.service';
import { CalculateBaziDto } from './dto/calculate-bazi.dto';
import { AnalyzeBaziDto } from './dto/analyze-bazi.dto';

@Injectable()
export class BaziService {
  private readonly logger = new Logger(BaziService.name);

  constructor(
    private readonly baziCore: BaziCoreService,
    private readonly analysisService: AnalysisService,
    private readonly chartsService: ChartsService,
  ) {}

  async calculate(dto: CalculateBaziDto) {
    this.logger.log('Calculating bazi chart');

    // 1. 计算四柱
    const pillars = this.baziCore.calculatePillars(dto.birthDate, dto.birthTime);

    // 2. 计算十神
    const shishen = this.baziCore.calculateShishen(pillars);

    // 3. 计算五行
    const wuxing = this.baziCore.calculateWuxing(pillars);

    // 4. 计算纳音
    const nayin = this.baziCore.calculateNayin(pillars);

    return {
      pillars,
      shishen,
      wuxing,
      nayin,
      dayMaster: pillars.dayPillar.tianGan,
      dayMasterElement: pillars.dayPillar.tianGanElement,
    };
  }

  async analyze(dto: AnalyzeBaziDto) {
    this.logger.log('Analyzing bazi chart');

    // 1. 计算排盘
    const chart = await this.calculate(dto);

    // 2. 分析日主强弱
    const strength = this.baziCore.analyzeStrength(chart);

    // 3. 确定用神喜忌
    const yongshen = this.baziCore.determineYongshen(chart, strength);

    // 4. 分析大运流年
    const dayun = this.baziCore.analyzeDayun(dto.birthDate, dto.gender, chart);

    // 5. 综合分析
    const comprehensive = this.baziCore.comprehensiveAnalysis(chart, strength, yongshen);

    return {
      chart,
      strength,
      yongshen,
      dayun,
      comprehensive,
    };
  }

  async save(userId: string, dto: AnalyzeBaziDto) {
    this.logger.log(`Saving bazi chart for user ${userId}`);

    // 1. 计算分析
    const analysis = await this.analyze(dto);

    // 2. 保存命盘
    const chart = await this.chartsService.create({
      userId,
      chartType: 'bazi',
      inputData: dto,
      chartData: analysis.chart,
    });

    // 3. 保存分析记录
    const analysisRecord = await this.analysisService.create({
      userId,
      chartId: chart.id,
      analysisType: 'bazi_analysis',
      inputData: dto,
      resultData: analysis,
    });

    return {
      chart,
      analysis: analysisRecord,
    };
  }

  async compatibility(dto: CompatibilityDto) {
    this.logger.log('Calculating bazi compatibility');

    const chart1 = await this.calculate(dto.input1);
    const chart2 = await this.calculate(dto.input2);

    const result = this.baziCore.calculateCompatibility(chart1, chart2);

    return {
      chart1,
      chart2,
      compatibility: result,
    };
  }
}
```

## 5. 模块依赖管理

### 5.1 依赖图

```
┌─────────────────────────────────────────────────────────────────┐
│                    模块依赖图 (Module Dependency Graph)          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                              ┌───────────┐                      │
│                              │   Main    │                      │
│                              │  Module   │                      │
│                              └─────┬─────┘                      │
│                                    │                            │
│              ┌─────────────────────┼─────────────────────┐     │
│              │                     │                     │     │
│              ▼                     ▼                     ▼     │
│        ┌──────────┐          ┌──────────┐          ┌──────────┐│
│        │   Auth   │          │  Charts  │          │Analysis  ││
│        │  Module  │          │  Module  │          │  Module  ││
│        └────┬─────┘          └────┬─────┘          └────┬─────┘│
│             │                     │                     │      │
│             │                     │                     │      │
│             ▼                     ▼                     ▼      │
│        ┌──────────┐          ┌──────────┐          ┌──────────┐│
│        │  Users   │          │ Fortune  │          │ Reports  ││
│        │  Module  │          │ Modules  │          │  Module  ││
│        └──────────┘          └────┬─────┘          └──────────┘│
│                                   │                            │
│              ┌────────────────────┼────────────────────┐      │
│              │                    │                    │      │
│              ▼                    ▼                    ▼      │
│        ┌──────────┐          ┌──────────┐          ┌──────────┐│
│        │   Bazi   │          │  Ziwei   │          │Fengshui  ││
│        │  Module  │          │  Module  │          │  Module  ││
│        └──────────┘          └──────────┘          └──────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 依赖注入配置

```typescript
// common/providers/database.provider.ts

import { Provider } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../database/redis.service';
import { MongoService } from '../../database/mongo.service';

export const databaseProviders: Provider[] = [
  {
    provide: PrismaService,
    useClass: PrismaService,
  },
  {
    provide: RedisService,
    useClass: RedisService,
  },
  {
    provide: MongoService,
    useClass: MongoService,
  },
];

// common/providers/cache.provider.ts

import { Provider } from '@nestjs/common';
import { CacheService } from '../../cache/cache.service';

export const cacheProviders: Provider[] = [
  {
    provide: CacheService,
    useClass: CacheService,
  },
];

// common/providers/queue.provider.ts

import { Provider } from '@nestjs/common';
import { QueueService } from '../../queue/queue.service';

export const queueProviders: Provider[] = [
  {
    provide: QueueService,
    useClass: QueueService,
  },
];
```

## 6. 测试策略

### 6.1 单元测试

```typescript
// modules/bazi/bazi.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { BaziService } from './bazi.service';
import { BaziCoreService } from './core/bazi-core.service';
import { AnalysisService } from '../analysis/analysis.service';
import { ChartsService } from '../charts/charts.service';

describe('BaziService', () => {
  let service: BaziService;
  let baziCore: jest.Mocked<BaziCoreService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BaziService,
        {
          provide: BaziCoreService,
          useValue: {
            calculatePillars: jest.fn(),
            calculateShishen: jest.fn(),
            calculateWuxing: jest.fn(),
            calculateNayin: jest.fn(),
            analyzeStrength: jest.fn(),
            determineYongshen: jest.fn(),
          },
        },
        {
          provide: AnalysisService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ChartsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BaziService>(BaziService);
    baziCore = module.get(BaziCoreService);
  });

  describe('calculate', () => {
    it('should calculate bazi chart correctly', async () => {
      const input = {
        birthDate: '1990-01-15',
        birthTime: '08:30',
        gender: 'male' as const,
      };

      baziCore.calculatePillars.mockReturnValue({
        yearPillar: { tianGan: '己', diZhi: '巳' },
        monthPillar: { tianGan: '丁', diZhi: '丑' },
        dayPillar: { tianGan: '甲', diZhi: '子' },
        hourPillar: { tianGan: '戊', diZhi: '辰' },
      });

      const result = await service.calculate(input);

      expect(result).toBeDefined();
      expect(baziCore.calculatePillars).toHaveBeenCalledWith(
        '1990-01-15',
        '08:30'
      );
    });
  });
});
```

### 6.2 集成测试

```typescript
// test/bazi.integration.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Bazi (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/bazi/calculate (POST)', () => {
    it('should calculate bazi chart', () => {
      return request(app.getHttpServer())
        .post('/bazi/calculate')
        .send({
          birthDate: '1990-01-15',
          birthTime: '08:30',
          gender: 'male',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.pillars).toBeDefined();
          expect(res.body.dayMaster).toBeDefined();
        });
    });

    it('should return 400 for invalid input', () => {
      return request(app.getHttpServer())
        .post('/bazi/calculate')
        .send({
          birthDate: 'invalid-date',
        })
        .expect(400);
    });
  });
});
```

## 7. 总结

该模块化开发方案遵循以下原则：

1. **清晰的模块边界**：每个模块职责明确，边界清晰
2. **统一的接口规范**：所有命理模块遵循统一的接口设计
3. **松耦合设计**：模块间通过接口通信，降低耦合度
4. **可扩展性**：新增模块只需实现接口并注册
5. **完整的测试策略**：单元测试、集成测试、端到端测试覆盖
6. **前后端分离**：前端组件模块化，后端NestJS模块化
7. **共享类型**：通过共享包确保类型一致性
