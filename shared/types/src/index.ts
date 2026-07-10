// ==================== 用户类型 ====================

export type UserRole = 'user' | 'admin' | 'moderator';
export type UserStatus = 'active' | 'inactive' | 'banned' | 'pending';
export type Gender = 'male' | 'female' | 'unknown';
export type Theme = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  nickname: string;
  avatarUrl?: string;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  realName?: string;
  gender?: Gender;
  birthDate?: Date;
  birthTime?: string;
  birthTimezone: string;
  birthPlace?: string;
  birthLongitude?: number;
  birthLatitude?: number;
  chineseZodiac?: string;
  zodiacSign?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  language: string;
  theme: Theme;
  timezone: string;
  notificationEmail: boolean;
  notificationPush: boolean;
  notificationSms: boolean;
  privacyShowBirth: boolean;
  privacyShowName: boolean;
}

// ==================== 命盘类型 ====================

export type ChartType = 'bazi' | 'ziwei' | 'fengshui' | 'divination' | 'name';

export interface Chart {
  id: string;
  userId?: string;
  chartType: ChartType;
  title?: string;
  description?: string;
  inputData: Record<string, unknown>;
  chartData: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== 八字类型 ====================

export type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';
export type WuXingElement = '金' | '木' | '水' | '火' | '土';
export type ShiShen = '比肩' | '劫财' | '食神' | '伤官' | '偏财' | '正财' | '七杀' | '正官' | '偏印' | '正印';

export interface Pillar {
  tianGan: TianGan;
  diZhi: DiZhi;
  tianGanElement: WuXingElement;
  diZhiElement: WuXingElement;
  shishen: ShiShen;
  cangGan?: Array<{
    tianGan: TianGan;
    element: WuXingElement;
    shishen: ShiShen;
  }>;
}

export interface BaziChart {
  id: string;
  chartId: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour?: number;
  birthMinute?: number;
  lunarYear?: string;
  lunarMonth?: string;
  lunarDay?: string;
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar?: Pillar;
  dayMaster: TianGan;
  dayMasterElement: WuXingElement;
  nayin?: string;
  shishen?: Record<string, number>;
  wuxing: Record<WuXingElement, number>;
}

export interface BaziInput {
  birthDate: string;
  birthTime?: string;
  gender: Gender;
  birthPlace?: string;
}

// ==================== 紫微斗数类型 ====================

export type PalaceName = 
  | '命宫' | '兄弟' | '夫妻' | '子女' | '财帛' | '疾厄'
  | '迁移' | '交友' | '官禄' | '田宅' | '福德' | '父母';

export type StarName = 
  | '紫微' | '天机' | '太阳' | '武曲' | '天同' | '廉贞'
  | '天府' | '太阴' | '贪狼' | '巨门' | '天相' | '天梁'
  | '七杀' | '破军' | '文昌' | '文曲' | '左辅' | '右弼'
  | '天魁' | '天钺' | '禄存' | '天马' | '擎羊' | '陀罗'
  | '火星' | '铃星' | '地空' | '地劫';

export interface Palace {
  name: PalaceName;
  stars: Star[];
  tianGan: TianGan;
  diZhi: DiZhi;
  majorPeriod?: number;
}

export interface Star {
  name: StarName;
  brightness: string;
  isMajor: boolean;
}

export interface ZiweiChart {
  id: string;
  chartId: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  gender: Gender;
  palaces: Palace[];
  majorPeriod?: {
    current: number;
    startAge: number;
    endAge: number;
  };
}

// ==================== 风水类型 ====================

export type FengShuiMethod = 'eight_mansions' | 'flying_star' | 'san_he';

export interface FengShuiInput {
  address?: string;
  longitude: number;
  latitude: number;
  orientation: string;
  buildingYear?: number;
  floorNumber?: number;
  roomLayout?: Record<string, unknown>;
}

export interface FengShuiAnalysis {
  id: string;
  chartId: string;
  analysisType: FengShuiMethod;
  input: FengShuiInput;
  baguaData?: Record<string, unknown>;
  flyingStarData?: Record<string, unknown>;
  recommendations: Array<{
    category: string;
    advice: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

// ==================== 占卜类型 ====================

export type DivinationMethod = 'liuyao' | 'meihua' | 'qimen';

export interface DivinationInput {
  question: string;
  method: DivinationMethod;
}

export interface Hexagram {
  name: string;
  symbol: string;
  lines: number[];
  meaning: string;
}

export interface DivinationResult {
  id: string;
  chartId: string;
  question: string;
  method: DivinationMethod;
  originalHexagram: Hexagram;
  changedHexagram?: Hexagram;
  movingLines: number[];
  interpretation: Record<string, unknown>;
}

// ==================== 姓名学类型 ====================

export interface NameInput {
  fullName: string;
  surname: string;
  givenName: string;
  gender?: Gender;
}

export interface NameAnalysis {
  id: string;
  chartId: string;
  fullName: string;
  surname: string;
  givenName: string;
  gender?: Gender;
  wuge: {
    tianGe: number;
    renGe: number;
    diGe: number;
    waiGe: number;
    zongGe: number;
  };
  sancai?: {
    ren: string;
    di: string;
    tian: string;
  };
  wuxing: Record<string, number>;
  strokeCount: number;
  luckyNumbers: number[];
  luckyColors: string[];
  luckyDirections: string[];
}

// ==================== 分析类型 ====================

export type AnalysisType = 
  | 'bazi_analysis'
  | 'ziwei_analysis'
  | 'fengshui_analysis'
  | 'divination_analysis'
  | 'name_analysis'
  | 'comprehensive_analysis';

export interface Analysis {
  id: string;
  userId?: string;
  chartId?: string;
  analysisType: AnalysisType;
  inputData: Record<string, unknown>;
  resultData: Record<string, unknown>;
  aiInterpretation?: string;
  aiModel?: string;
  score?: number;
  isPremium: boolean;
  viewCount: number;
  createdAt: Date;
}

export interface AnalysisResult {
  summary: string;
  sections: Array<{
    title: string;
    content: string;
    score?: number;
    highlights?: string[];
    warnings?: string[];
  }>;
  recommendations: Array<{
    category: string;
    advice: string;
    priority: 'high' | 'medium' | 'low';
    timeframe?: string;
  }>;
  luckyElements?: {
    colors?: string[];
    numbers?: number[];
    directions?: string[];
    gemstones?: string[];
  };
}

// ==================== API 响应类型 ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== 认证类型 ====================

export interface LoginInput {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterInput {
  email?: string;
  phone?: string;
  password: string;
  nickname: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JWTPayload {
  sub: string;
  email?: string;
  phone?: string;
  iat: number;
  exp: number;
}
