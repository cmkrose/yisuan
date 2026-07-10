import {
  BaziResult, Pillar, TianGan, DiZhi, WuXing, ShiShen,
  HEAVENLY_STEMS, EARTHLY_BRANCHES,
  getStemElement, getBranchElement, getShiShen,
} from './constants';

interface ElementCount { count: number; score: number }
type ElementMap = Record<WuXing, ElementCount>;

export interface DayMasterAnalysis {
  dayMaster: TianGan;
  element: WuXing;
  strength: '极强' | '强' | '偏强' | '中和' | '偏弱' | '弱' | '极弱';
  score: number;
  elementCounts: Record<string, number>;
  favorable: WuXing[];
  unfavorable: WuXing[];
  favorableGods: ShiShen[];
  unfavorableGods: ShiShen[];
}

export interface PatternResult {
  name: string;
  type: string;
  description: string;
}

export interface Dayun {
  age: number;
  stem: TianGan;
  branch: DiZhi;
  element: WuXing;
  isGood: boolean;
}

export interface BaziAnalysis {
  dayMasterAnalysis: DayMasterAnalysis;
  pattern: PatternResult;
  dayun: Dayun[][];
  liunian: { year: number; stem: TianGan; shishen: ShiShen }[];
  summary: string;
}

const SUPPORTING: ShiShen[] = ['比肩','劫财','正印','偏印'];
const DRAINING: ShiShen[] = ['食神','伤官','正财','偏财','七杀','正官'];

export function analyzeBazi(bazi: BaziResult, gender: 'male' | 'female'): BaziAnalysis {
  const dm = dayMasterStrength(bazi);
  const pattern = judgePattern(bazi);
  const dayun = calcDayun(bazi, gender);
  const liunian = calcLiunian(bazi.dayMaster, bazi.year.stem, 10);
  const summary = buildSummary(dm, pattern);

  return {
    dayMasterAnalysis: dm,
    pattern,
    dayun,
    liunian,
    summary,
  };
}

export function dayMasterStrength(bazi: BaziResult): DayMasterAnalysis {
  const dm = bazi.dayMaster;
  const dmE = bazi.dayMasterElement;
  const allPillars = [bazi.year, bazi.month, bazi.day, bazi.hour];

  const elementCounts: Record<string, number> = {};
  const initialCounts: Record<WuXing, number> = { 木:0, 火:0, 土:0, 金:0, 水:0 };
  const em: ElementMap = JSON.parse(JSON.stringify(initialCounts));

  for (const p of allPillars) {
    em[getStemElement(p.stem)].count++;
    em[getBranchElement(p.branch)].count += 0.5;
    for (const cg of p.cangGan) {
      em[cg.element].count += 0.3;
    }
  }

  // Check month branch as seasonal factor
  const seasonScore: Record<WuXing, number> = getSeasonalScore(bazi.month.branch, dmE);
  for (const el of Object.keys(seasonScore) as WuXing[]) {
    em[el].count += seasonScore[el];
  }

  const supportingScore = em[dmE].count;
  const producingScore = getProducing(dmE).reduce((s, el) => s + em[el].count, 0);
  const drainingScore = getControlling(dmE).reduce((s, el) => s + em[el].count, 0)
    + getControlledBy(dmE).reduce((s, el) => s + em[el].count, 0);

  const total = supportingScore + producingScore + drainingScore;
  const supportRatio = total > 0 ? (supportingScore + producingScore) / total : 0.5;
  const adjRatio = supportRatio * 100;

  let strength: DayMasterAnalysis['strength'];
  if (adjRatio >= 65) strength = '极强';
  else if (adjRatio >= 55) strength = '强';
  else if (adjRatio >= 50) strength = '偏强';
  else if (adjRatio > 45) strength = '中和';
  else if (adjRatio >= 40) strength = '偏弱';
  else if (adjRatio >= 30) strength = '弱';
  else strength = '极弱';

  const isStrong = ['极强','强','偏强'].includes(strength);
  const favorable: WuXing[] = isStrong
    ? [...getControlling(dmE), ...getControlledBy(dmE), ...getProducedBy(dmE)]
    : [dmE, ...getProducing(dmE)];
  const unfavorable: WuXing[] = isStrong
    ? [dmE, ...getProducing(dmE)]
    : [...getControlling(dmE), ...getControlledBy(dmE), ...getProducedBy(dmE)];

  const allGods = [...SUPPORTING, ...DRAINING] as ShiShen[];
  const favorableGods = allGods.filter((g) => isGodFavorable(g, isStrong));
  const unfavorableGods = allGods.filter((g) => !isGodFavorable(g, isStrong));

  const ecDisplay: Record<string, number> = {};
  for (const el of Object.keys(em) as WuXing[]) {
    ecDisplay[el] = Math.round(em[el].count * 100) / 100;
  }

  return {
    dayMaster: dm,
    element: dmE,
    strength,
    score: Math.round(adjRatio),
    elementCounts: ecDisplay,
    favorable: [...new Set(favorable)],
    unfavorable: [...new Set(unfavorable)],
    favorableGods,
    unfavorableGods,
  };
}

export function judgePattern(bazi: BaziResult): PatternResult {
  const dmE = bazi.dayMasterElement;
  const monthBranch = bazi.month.branch;
  const monthEle = getBranchElement(monthBranch);

  const patterns = [
    { name: '正官格', test: () => bazi.month.shishen === '正官' },
    { name: '七杀格', test: () => bazi.month.shishen === '七杀' },
    { name: '正印格', test: () => bazi.month.shishen === '正印' },
    { name: '偏印格', test: () => bazi.month.shishen === '偏印' },
    { name: '正财格', test: () => bazi.month.shishen === '正财' },
    { name: '偏财格', test: () => bazi.month.shishen === '偏财' },
    { name: '食神格', test: () => bazi.month.shishen === '食神' },
    { name: '伤官格', test: () => bazi.month.shishen === '伤官' },
    { name: '建禄格', test: () => bazi.month.branch === EARTHLY_BRANCHES[HEAVENLY_STEMS.indexOf(bazi.dayMaster)] },
  ];

  for (const p of patterns) {
    if (p.test()) return { name: p.name, type: '正格', description: `月令取格，${p.name}` };
  }
  return { name: '杂格', type: '杂格', description: `${dmE}日主，${monthEle}月令，属杂格` };
}

export function calcDayun(bazi: BaziResult, gender: 'male' | 'female'): Dayun[][] {
  const dmYY = bazi.day.stemYinYang;
  const yYY = bazi.year.stemYinYang;
  const isYang = dmYY === '阳';
  const isMale = gender === 'male';
  const forward = (isYang && isMale) || (!isYang && !isMale);

  const dec = 10;
  const startAge = 1;
  const termStep = forward ? 1 : -1;

  const result: Dayun[][] = [];
  // Generate 8 ten-year cycles
  for (let cycle = 0; cycle < 8; cycle++) {
    const decade: Dayun[] = [];
    const startStemIndex = (HEAVENLY_STEMS.indexOf(bazi.month.stem) + termStep * (cycle + 1) + 20) % 10;
    const startBranchIndex = (EARTHLY_BRANCHES.indexOf(bazi.month.branch) + termStep * (cycle + 1) + 24) % 12;
    const ageOffset = startAge + cycle * dec;

    for (let i = 0; i < dec; i++) {
      const stemIdx = (startStemIndex + i * termStep + 10) % 10;
      const stem = HEAVENLY_STEMS[stemIdx] as TianGan;
      const branchIdx = (startBranchIndex + i * termStep + 12) % 12;
      const branch = EARTHLY_BRANCHES[branchIdx];
      const shi = getShiShen(bazi.dayMaster, stem);
      const favor = [...SUPPORTING].includes(shi);

      decade.push({
        age: ageOffset + i,
        stem,
        branch,
        element: getStemElement(stem),
        isGood: favor,
      });
    }
    result.push(decade);
  }
  return result;
}

export function calcLiunian(dayMaster: TianGan, yearStem: TianGan, count: number): { year: number; stem: TianGan; shishen: ShiShen }[] {
  const curYear = new Date().getFullYear();
  const results = [];
  for (let i = 0; i < count; i++) {
    const y = curYear + i;
    const si = (y - 4) % 10;
    const stem = HEAVENLY_STEMS[si < 0 ? si + 10 : si];
    results.push({ year: y, stem, shishen: getShiShen(dayMaster, stem) });
  }
  return results;
}

function buildSummary(dm: DayMasterAnalysis, pattern: PatternResult): string {
  const favorEl = dm.favorable.slice(0, 2).join('、');
  const unfavorEl = dm.unfavorable.slice(0, 2).join('、');
  const favorGods = dm.favorableGods.slice(0, 3).join('、');
  return `日主${dm.dayMaster}(${dm.element})，${dm.strength}。格局：${pattern.name}。喜神：${favorEl}(${favorGods})，忌神：${unfavorEl}。`;
}

function getSeasonalScore(branch: DiZhi, dmElement: WuXing): Record<WuXing, number> {
  const seasonal: Record<string, Record<WuXing, number>> = {
    寅: { 木:2, 火:1, 土:0, 金:-1, 水:-1 },
    卯: { 木:3, 火:0.5, 土:-0.5, 金:-1, 水:-1 },
    辰: { 木:1, 火:0, 土:2, 金:0, 水:-1 },
    巳: { 木:-1, 火:3, 土:0.5, 金:0.5, 水:-1.5 },
    午: { 木:-1, 火:3, 土:1, 金:-1, 水:-1.5 },
    未: { 木:-0.5, 火:2, 土:2, 金:0, 水:-1 },
    申: { 木:-1, 火:-1, 土:0, 金:3, 水:1 },
    酉: { 木:-1.5, 火:-1, 土:-1, 金:3, 水:0.5 },
    戌: { 木:-1, 火:-0.5, 土:2.5, 金:1, 水:0 },
    亥: { 木:1, 火:-1, 土:-1, 金:0, 水:3 },
    子: { 木:-0.5, 火:-1.5, 土:-1, 金:0.5, 水:3 },
    丑: { 木:-0.5, 火:-1, 土:2.5, 金:1, 水:0.5 },
  };
  return seasonal[branch] || { 木:0, 火:0, 土:0, 金:0, 水:0 };
}

function getProducing(el: WuXing): WuXing[] {
  const m: Record<WuXing, WuXing[]> = {
    木:['水'], 火:['木'], 土:['火'], 金:['土'], 水:['金'],
  };
  return m[el];
}

function getProducedBy(el: WuXing): WuXing[] {
  const m: Record<WuXing, WuXing[]> = {
    木:['火'], 火:['土'], 土:['金'], 金:['水'], 水:['木'],
  };
  return m[el];
}

function getControlling(el: WuXing): WuXing[] {
  const m: Record<WuXing, WuXing[]> = {
    木:['土'], 火:['金'], 土:['水'], 金:['木'], 水:['火'],
  };
  return m[el];
}

function getControlledBy(el: WuXing): WuXing[] {
  const m: Record<WuXing, WuXing[]> = {
    木:['金'], 火:['水'], 土:['木'], 金:['火'], 水:['土'],
  };
  return m[el];
}

function isGodFavorable(god: ShiShen, isStrong: boolean): boolean {
  const favorForStrong: ShiShen[] = ['食神','伤官','正财','偏财','七杀','正官'];
  const favorForWeak: ShiShen[] = ['比肩','劫财','正印','偏印'];
  return isStrong ? favorForStrong.includes(god) : favorForWeak.includes(god);
}
