export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
export type TianGan = typeof HEAVENLY_STEMS[number];
export type DiZhi = typeof EARTHLY_BRANCHES[number];
export type WuXing = '木' | '火' | '土' | '金' | '水';
export type YinYang = '阳' | '阴';
export type ShiShen = '比肩' | '劫财' | '食神' | '伤官' | '偏财' | '正财' | '七杀' | '正官' | '偏印' | '正印';

export const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'] as const;

const STEM_ELEMENT: Record<TianGan, WuXing> = {
  甲:'木', 乙:'木', 丙:'火', 丁:'火', 戊:'土', 己:'土', 庚:'金', 辛:'金', 壬:'水', 癸:'水',
};
const STEM_YINYANG: Record<TianGan, YinYang> = {
  甲:'阳', 乙:'阴', 丙:'阳', 丁:'阴', 戊:'阳', 己:'阴', 庚:'阳', 辛:'阴', 壬:'阳', 癸:'阴',
};

const BRANCH_ELEMENT: Record<DiZhi, WuXing> = {
  子:'水', 丑:'土', 寅:'木', 卯:'木', 辰:'土', 巳:'火',
  午:'火', 未:'土', 申:'金', 酉:'金', 戌:'土', 亥:'水',
};
const BRANCH_YINYANG: Record<DiZhi, YinYang> = {
  子:'阳', 丑:'阴', 寅:'阳', 卯:'阴', 辰:'阳', 巳:'阴',
  午:'阳', 未:'阴', 申:'阳', 酉:'阴', 戌:'阳', 亥:'阴',
};

const BRANCH_CANGGAN: Record<DiZhi, TianGan[]> = {
  子:['癸'],           丑:['己','癸','辛'], 寅:['甲','丙','戊'],
  卯:['乙'],           辰:['戊','乙','癸'], 巳:['丙','庚','戊'],
  午:['丁','己'],      未:['己','丁','乙'], 申:['庚','壬','戊'],
  酉:['辛'],           戌:['戊','辛','丁'], 亥:['壬','甲'],
};

const BRANCH_HOURS: Record<DiZhi, string> = {
  子:'23:00-01:00', 丑:'01:00-03:00', 寅:'03:00-05:00', 卯:'05:00-07:00',
  辰:'07:00-09:00',  巳:'09:00-11:00', 午:'11:00-13:00', 未:'13:00-15:00',
  申:'15:00-17:00',  酉:'17:00-19:00', 戌:'19:00-21:00', 亥:'21:00-23:00',
};

export function getStemElement(s: TianGan): WuXing { return STEM_ELEMENT[s]; }
export function getStemYinYang(s: TianGan): YinYang { return STEM_YINYANG[s]; }
export function getBranchElement(b: DiZhi): WuXing { return BRANCH_ELEMENT[b]; }
export function getBranchYinYang(b: DiZhi): YinYang { return BRANCH_YINYANG[b]; }
export function getBranchCangGan(b: DiZhi): TianGan[] { return BRANCH_CANGGAN[b]; }
export function getBranchHours(b: DiZhi): string { return BRANCH_HOURS[b]; }

export interface Pillar {
  stem: TianGan;
  branch: DiZhi;
  stemElement: WuXing;
  branchElement: WuXing;
  stemYinYang: YinYang;
  branchYinYang: YinYang;
  cangGan: { stem: TianGan; element: WuXing }[];
  shishen: ShiShen | null;
  nayin: string;
}

export interface BaziResult {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  dayMaster: TianGan;
  dayMasterElement: WuXing;
}

export function getShiShen(dayMaster: TianGan, targetStem: TianGan): ShiShen {
  const dmE = STEM_ELEMENT[dayMaster];
  const dmYY = STEM_YINYANG[dayMaster];
  const tE = STEM_ELEMENT[targetStem];
  const tYY = STEM_YINYANG[targetStem];
  const relations: Record<WuXing, Record<WuXing, string>> = {
    木: { 木:'same', 火:'produce', 土:'control', 金:'controlled', 水:'produced' },
    火: { 火:'same', 土:'produce', 金:'control', 水:'controlled', 木:'produced' },
    土: { 土:'same', 金:'produce', 水:'control', 木:'controlled', 火:'produced' },
    金: { 金:'same', 水:'produce', 木:'control', 火:'controlled', 土:'produced' },
    水: { 水:'same', 木:'produce', 火:'control', 土:'controlled', 金:'produced' },
  };
  const r = relations[dmE][tE];
  if (r === 'same') return dmYY === tYY ? '比肩' : '劫财';
  if (r === 'produce') return dmYY === tYY ? '食神' : '伤官';
  if (r === 'control') return dmYY === tYY ? '偏财' : '正财';
  if (r === 'controlled') return dmYY === tYY ? '七杀' : '正官';
  return dmYY === tYY ? '偏印' : '正印';
}

const NAYIN_TABLE: string[][] = [
  ['海中金','炉中火','大林木','路旁土','剑锋金','山头火'],
  ['涧下水','城头土','白蜡金','杨柳木','泉中水','屋上土'],
  ['霹雳火','松柏木','流年水','砂石金','山下火','平地木'],
  ['壁上土','金箔金','覆灯火','天河水','大驿土','钗环金'],
  ['桑柘木','大溪水','砂中土','山下火','平地木','壁上土'],
  ['金箔金','覆灯火','天河水','大驿土','钗环金','桑柘木'],
  ['大溪水','砂中土','山下火','平地木','壁上土','金箔金'],
  ['覆灯火','天河水','大驿土','钗环金','桑柘木','大溪水'],
  ['砂中土','山下火','平地木','壁上土','金箔金','覆灯火'],
  ['天河水','大驿土','钗环金','桑柘木','大溪水','砂中土'],
];

export function getNayin(stemIndex: number, branchIndex: number): string {
  return NAYIN_TABLE[stemIndex % 10][branchIndex % 6];
}
