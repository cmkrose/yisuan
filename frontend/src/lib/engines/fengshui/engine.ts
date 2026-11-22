import {
  BAGUA_NAMES, EAST_FOUR, WEST_FOUR, ER_SHI_SI_SHAN,
  SHAN_BAGUA, SHAN_ELEMENT, DIRECTION_DEGREES,
  STAR_NAMES, PALACE_INDEX_MAP,
  EightMansionResult, FlyingStarResult, CompassData,
} from './constants';

const GUA_TO_BAGUA = [
  '', '坎', '坤', '震', '巽', '', '乾', '兑', '艮', '离',
];
const BAGUA_ELEMENT: Record<string, string> = { 坎:'水',坤:'土',震:'木',巽:'木',乾:'金',兑:'金',艮:'土',离:'火' };

const FOUR_GOOD = ['生气','天医','延年','伏位'];
const FOUR_BAD = ['祸害','六煞','五鬼','绝命'];

const EAST_GOOD_DIR: Record<string, string[]> = {
  坎: ['巽','震','离','坎'], 离: ['震','巽','坎','离'],
  震: ['离','巽','坎','震'], 巽: ['坎','离','震','巽'],
};
const EAST_BAD_DIR: Record<string, string[]> = {
  坎: ['兑','坤','艮','乾'], 离: ['艮','乾','兑','坤'],
  震: ['乾','兑','坤','艮'], 巽: ['艮','乾','坤','兑'],
};
const WEST_GOOD_DIR: Record<string, string[]> = {
  乾: ['兑','坤','艮','乾'], 坤: ['艮','乾','兑','坤'],
  艮: ['坤','乾','兑','艮'], 兑: ['乾','艮','坤','兑'],
};
const WEST_BAD_DIR: Record<string, string[]> = {
  乾: ['巽','震','坎','离'], 坤: ['离','坎','震','巽'],
  艮: ['巽','震','坎','离'], 兑: ['震','离','巽','坎'],
};

export function calculateEightMansion(birthYear: number, gender: 'male' | 'female'): EightMansionResult {
  // 命卦通行公式：出生年各位数字和化简为个位 n；
  // 男命 2000 年前 10-n、2000 年后 9-n；女命 2000 年前 n+5、2000 年后 n+4；得 5 男寄坤、女寄艮。
  let n = birthYear;
  while (n > 9) n = String(n).split('').reduce((s, ch) => s + Number(ch), 0);
  let guaNum = gender === 'male'
    ? (birthYear < 2000 ? 10 - n : 9 - n)
    : (birthYear < 2000 ? n + 5 : n + 4);
  guaNum = ((guaNum - 1) % 9 + 9) % 9 + 1;
  if (guaNum === 5) guaNum = gender === 'male' ? 2 : 8;
  return buildMansion(GUA_TO_BAGUA[guaNum]);
}

// 按宅卦（坐山八卦）计算八宅八方游星，供阳宅页使用，与个人命卦同一口径。
export function calculateHouseMansion(sittingGua: string): EightMansionResult {
  return buildMansion(sittingGua);
}

// 由朝向（二十四山）取对宫坐山，再映射到八卦宅型。
export function getSittingGua(facing: string): string {
  const idx = ER_SHI_SI_SHAN.indexOf(facing as any);
  const sittingShan = idx >= 0 ? ER_SHI_SI_SHAN[(idx + 12) % 24] : facing;
  return SHAN_BAGUA[sittingShan] || '坎';
}

function buildMansion(birthGua: string): EightMansionResult {
  const birthElement = BAGUA_ELEMENT[birthGua] || '土';
  const isEastFour = EAST_FOUR.includes(birthGua as any);

  const goodBagua = isEastFour ? EAST_GOOD_DIR[birthGua] : WEST_GOOD_DIR[birthGua];
  const badBagua = isEastFour ? EAST_BAD_DIR[birthGua] : WEST_BAD_DIR[birthGua];

  const goodRatings = ['生气(大吉)','天医(中吉)','延年(小吉)','伏位(平)'];
  const badRatings = ['祸害(小凶)','六煞(中凶)','五鬼(大凶)','绝命(极凶)'];

  const favorableDirections = goodBagua.map((g, i) => {
    const shan = Object.entries(SHAN_BAGUA).find(([_, bg]) => bg === g)?.[0] || g;
    return { direction: g, shan, degree: DIRECTION_DEGREES[shan] || 0, rating: goodRatings[i] };
  });
  const unfavorableDirections = badBagua.map((b, i) => {
    const shan = Object.entries(SHAN_BAGUA).find(([_, bg]) => bg === b)?.[0] || b;
    return { direction: b, shan, degree: DIRECTION_DEGREES[shan] || 0, rating: badRatings[i] };
  });

  return { birthGua, birthElement, isEastFour, favorableDirections, unfavorableDirections };
}

export function calculateFlyingStars(year: number): FlyingStarResult {
  const centerStar = ((10 - (year % 9)) % 9) + 1;
  // 洛书轨迹顺飞：中→乾→兑→艮→离→坎→坤→震→巽（宫序 5,6,7,8,9,1,2,3,4）。
  const TRACK = [5, 6, 7, 8, 9, 1, 2, 3, 4];
  const starByPalace: Record<number, number> = {};
  TRACK.forEach((palace, k) => {
    starByPalace[palace] = ((centerStar - 1 + k) % 9) + 1;
  });

  const grid = PALACE_INDEX_MAP.map((palace) => {
    const star = starByPalace[palace];
    const info = STAR_NAMES[star];
    return {
      palace,
      star,
      name: info.name,
      fortune: info.fortune,
      element: info.element,
      color: info.color,
      note: info.note,
    };
  });

  // 财位：八白所落之宫
  const wealthEntry = grid.find((g) => g.star === 8);
  const wealthPalace = wealthEntry ? wealthEntry.palace : 5;
  const wealthPosNames: Record<number, string> = { 1:'北',2:'西南',3:'东',4:'东南',5:'中',6:'西北',7:'西',8:'东北',9:'南' };
  const wealthPosition = wealthPosNames[wealthPalace] || '不明';

  return { year, centerStar, grid, wealthPosition };
}

// 宅运盘：以元运星入中，按洛书轨迹顺飞（与年盘同一轨迹）。
export function calculateYunFlyingStars(yun: number) {
  const centerStar = ((yun - 1) % 9 + 9) % 9 + 1;
  const TRACK = [5, 6, 7, 8, 9, 1, 2, 3, 4];
  const starByPalace: Record<number, number> = {};
  TRACK.forEach((palace, k) => { starByPalace[palace] = ((centerStar - 1 + k) % 9) + 1; });
  const grid = PALACE_INDEX_MAP.map((palace) => {
    const star = starByPalace[palace];
    const info = STAR_NAMES[star];
    return { palace, star, name: info.name, fortune: info.fortune, element: info.element, color: info.color, note: info.note };
  });
  const wealthEntry = grid.find((g) => g.star === 8);
  const wealthPalace = wealthEntry ? wealthEntry.palace : 5;
  const wealthPosNames: Record<number, string> = { 1:'北',2:'西南',3:'东',4:'东南',5:'中',6:'西北',7:'西',8:'东北',9:'南' };
  return { yun: centerStar, centerStar, grid, wealthPosition: wealthPosNames[wealthPalace] || '不明' };
}

export function getCompassData(): CompassData {
  const mountains = ER_SHI_SI_SHAN.map((name) => ({
    name,
    degree: DIRECTION_DEGREES[name],
    bagua: SHAN_BAGUA[name],
    element: SHAN_ELEMENT[name],
  }));
  return { mountains };
}

export function analyzeHouse(year: number, facing: string) {
  const stars = calculateFlyingStars(year);
  const compass = getCompassData();
  const facingElement = SHAN_ELEMENT[facing] || '未知';

  return {
    year,
    facing,
    compass,
    flyingStars: stars,
    wealthPosition: stars.wealthPosition,
    summary: `${year}年，坐向${facing}(${facingElement})。财位在${stars.wealthPosition}方。${stars.centerStar}入中宫。`,
  };
}
