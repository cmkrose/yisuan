export const BAGUA_NAMES = ['坎','艮','震','巽','离','坤','兑','乾'] as const;
export type BaguaName = typeof BAGUA_NAMES[number];

export const EAST_FOUR = ['坎','离','震','巽'] as const;
export const WEST_FOUR = ['乾','坤','艮','兑'] as const;

export const ER_SHI_SI_SHAN = [
  '子','癸','丑','艮','寅','甲','卯','乙','辰','巽','巳','丙',
  '午','丁','未','坤','申','庚','酉','辛','戌','乾','亥','壬',
] as const;

export const SHAN_BAGUA: Record<string, string> = {
  子:'坎',癸:'坎',丑:'艮',艮:'艮',寅:'艮',甲:'震',卯:'震',乙:'震',
  辰:'巽',巽:'巽',巳:'巽',丙:'离',午:'离',丁:'离',未:'坤',坤:'坤',
  申:'坤',庚:'兑',酉:'兑',辛:'兑',戌:'乾',乾:'乾',亥:'乾',壬:'坎',
};

export const SHAN_ELEMENT: Record<string, string> = {
  子:'水',癸:'水',丑:'土',艮:'土',寅:'木',甲:'木',卯:'木',乙:'木',
  辰:'土',巽:'木',巳:'火',丙:'火',午:'火',丁:'火',未:'土',坤:'土',
  申:'金',庚:'金',酉:'金',辛:'金',戌:'土',乾:'金',亥:'水',壬:'水',
};

export const DIRECTION_DEGREES: Record<string, number> = {
  子:0, 癸:15, 丑:30, 艮:45, 寅:60, 甲:75,
  卯:90, 乙:105, 辰:120, 巽:135, 巳:150, 丙:165,
  午:180, 丁:195, 未:210, 坤:225, 申:240, 庚:255,
  酉:270, 辛:285, 戌:300, 乾:315, 亥:330, 壬:345,
};

export const HOUSE_GUA_TABLE: Record<string, number[]> = {
  male: [1,9,8,7,6,5,4,3,2,1,9,8,7,6,5,4,3,2,1,9],
  female: [5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6],
};

export const FLYING_STAR_GRID: Record<number, number[]> = {
  1: [1,2,3,4,5,6,7,8,9],
  2: [2,3,4,5,6,7,8,9,1],
  3: [3,4,5,6,7,8,9,1,2],
  4: [4,5,6,7,8,9,1,2,3],
  5: [5,6,7,8,9,1,2,3,4],
  6: [6,7,8,9,1,2,3,4,5],
  7: [7,8,9,1,2,3,4,5,6],
  8: [8,9,1,2,3,4,5,6,7],
  9: [9,1,2,3,4,5,6,7,8],
};

export const STAR_NAMES: Record<number, { name: string; color: string; element: string; fortune: string }> = {
  1: { name: '一白贪狼星', color: '白', element: '水', fortune: '吉' },
  2: { name: '二黑巨门星', color: '黑', element: '土', fortune: '凶' },
  3: { name: '三碧禄存星', color: '碧', element: '木', fortune: '凶' },
  4: { name: '四绿文曲星', color: '绿', element: '木', fortune: '吉' },
  5: { name: '五黄廉贞星', color: '黄', element: '土', fortune: '大凶' },
  6: { name: '六白武曲星', color: '白', element: '金', fortune: '吉' },
  7: { name: '七赤破军星', color: '赤', element: '金', fortune: '凶' },
  8: { name: '八白左辅星', color: '白', element: '土', fortune: '大吉' },
  9: { name: '九紫右弼星', color: '紫', element: '火', fortune: '吉' },
};

export const PALACE_INDEX_MAP = [4, 9, 2, 3, 5, 7, 8, 1, 6];

export interface EightMansionResult {
  birthGua: string;
  birthElement: string;
  isEastFour: boolean;
  favorableDirections: { direction: string; shan: string; degree: number; rating: string }[];
  unfavorableDirections: { direction: string; shan: string; degree: number; rating: string }[];
}

export interface FlyingStarResult {
  year: number;
  centerStar: number;
  grid: { palace: number; star: number; name: string; fortune: string; element: string; color: string }[];
  wealthPosition: string;
}

export interface CompassData {
  mountains: { name: string; degree: number; bagua: string; element: string }[];
}
