import {
  BAGUA_NAMES, EAST_FOUR, WEST_FOUR, ER_SHI_SI_SHAN,
  SHAN_BAGUA, SHAN_ELEMENT, DIRECTION_DEGREES,
  HOUSE_GUA_TABLE, FLYING_STAR_GRID, STAR_NAMES, PALACE_INDEX_MAP,
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
  const lastDigit = birthYear % 10;
  const lastTwo = birthYear % 100;
  const adjustedYear = lastTwo > 0 ? lastTwo : 100;
  const index = adjustedYear % 20;
  const guaNum = HOUSE_GUA_TABLE[gender][Math.max(0, index - 1)] || 1;
  const birthGua = GUA_TO_BAGUA[guaNum];
  const birthElement = BAGUA_ELEMENT[birthGua];
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
  const centerStar = 11 - (year % 9) || 9;
  const arr = FLYING_STAR_GRID[centerStar] || FLYING_STAR_GRID[5];

  const grid = PALACE_INDEX_MAP.map((palace, i) => {
    const star = arr[i];
    const info = STAR_NAMES[star];
    return {
      palace,
      star,
      name: info.name,
      fortune: info.fortune,
      element: info.element,
      color: info.color,
    };
  });

  // Find wealth position (where star 8 is located)
  const wealthIdx = arr.indexOf(8);
  const wealthPalace = PALACE_INDEX_MAP[wealthIdx];
  const wealthPosNames: Record<number, string> = { 1:'北',2:'西南',3:'东',4:'东南',5:'中',6:'西北',7:'西',8:'东北',9:'南' };
  const wealthPosition = wealthPosNames[wealthPalace] || '不明';

  return { year, centerStar, grid, wealthPosition };
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
