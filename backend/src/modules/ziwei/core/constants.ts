export const HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'] as const;
export const EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'] as const;
export type TianGan = typeof HEAVENLY_STEMS[number];
export type DiZhi = typeof EARTHLY_BRANCHES[number];

export const PALACES = [
  '命宫','兄弟','夫妻','子女','财帛','疾厄',
  '迁移','交友','事业','田宅','福德','父母',
] as const;
export type PalaceName = typeof PALACES[number];

export const MAJOR_STARS = [
  '紫微','天机','太阳','武曲','天同','廉贞',
  '天府','太阴','贪狼','巨门','天相','天梁','七杀','破军',
] as const;

export const AUXILIARY_STARS = [
  '文昌','文曲','左辅','右弼','天魁','天钺',
  '禄存','天马','擎羊','陀罗','火星','铃星','地空','地劫',
] as const;

export type StarName = typeof MAJOR_STARS[number] | typeof AUXILIARY_STARS[number];

export interface Star {
  name: StarName;
  brightness: '庙' | '旺' | '得' | '利' | '平' | '不' | '陷';
  isMajor: boolean;
}

export interface Palace {
  name: PalaceName;
  branch: DiZhi;
  stem: TianGan;
  majorStars: Star[];
  minorStars: Star[];
  isBodyPalace: boolean;
  majorLimit: { startAge: number; endAge: number } | null;
}

export interface ZiweiResult {
  palaces: Palace[];
  bodyPalace: PalaceName;
  fiveElementBureau: string;
  majorCycles: { palace: PalaceName; startAge: number; endAge: number }[];
  currentCycle: { palace: PalaceName; startAge: number; endAge: number } | null;
}
