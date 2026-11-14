import { calculateBazi } from '../bazi/calculate';
import { getStemElement, getBranchElement } from '../bazi/constants';

// 合婚判定规则（纯规则表，无随机分）：
// 维度与权重：日主生克 25% / 夫妻宫(日支) 30% / 五行互补 20% / 生肖(年支) 10% / 喜用神互补 15%。
// 各维度按固定关系表取值，综合分 = 加权和。

export interface HehunPersonInput {
  name?: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
}

export interface HehunDimension {
  key: string;
  name: string;
  weight: number;
  score: number;
  relation: string;
  detail: string;
}

export interface HehunResult {
  a: { name: string; gender: string; pillars: string; dayMaster: string; element: string; strength: string; favorable: string[] };
  b: { name: string; gender: string; pillars: string; dayMaster: string; element: string; strength: string; favorable: string[] };
  dimensions: HehunDimension[];
  totalScore: number;
  verdict: string;
  summary: string;
}

const SHENG: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

function elementRelation(a: string, b: string): '相生' | '比和' | '相克' {
  if (a === b) return '比和';
  if (SHENG[a] === b || SHENG[b] === a) return '相生';
  return '相克';
}

const LIUHE = [['子','丑'],['寅','亥'],['卯','戌'],['辰','酉'],['巳','申'],['午','未']];
const CHONG = [['子','午'],['丑','未'],['寅','申'],['卯','酉'],['辰','戌'],['巳','亥']];
const HAI = [['子','未'],['丑','午'],['寅','巳'],['卯','辰'],['申','亥'],['酉','戌']];
const SANHE = [['申','子','辰'],['亥','卯','未'],['寅','午','戌'],['巳','酉','丑']];
const XING = [['子','卯'],['寅','巳'],['巳','申'],['寅','申'],['丑','戌'],['戌','未'],['丑','未'],['辰','辰'],['午','午'],['酉','酉'],['亥','亥']];

function inPair(list: string[][], a: string, b: string): boolean {
  return list.some((p) => (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a));
}
function inTriple(groups: string[][], a: string, b: string): boolean {
  return groups.some((g) => g.includes(a) && g.includes(b) && a !== b);
}
function branchRelation(a: string, b: string): string {
  if (inPair(LIUHE, a, b)) return '六合';
  if (inPair(CHONG, a, b)) return '相冲';
  if (inTriple(SANHE, a, b)) return '三合';
  if (inPair(HAI, a, b)) return '相害';
  if (inPair(XING, a, b)) return '相刑';
  if (a === b) return '同支';
  return '无';
}

const BRANCH_SCORE: Record<string, number> = { 六合: 95, 三合: 88, 无: 70, 同支: 68, 相害: 55, 相刑: 50, 相冲: 35 };
const ELEMENT_SCORE: Record<string, number> = { 相生: 85, 比和: 78, 相克: 52 };

function topElements(elementCounts: Record<string, number>): string[] {
  return Object.entries(elementCounts).sort((x, y) => (y[1] as number) - (x[1] as number)).slice(0, 2).map(([e]) => e);
}

export function calculateHehun(a: HehunPersonInput, b: HehunPersonInput): HehunResult {
  const ra = calculateBazi(a as any);
  const rb = calculateBazi(b as any);
  const dma = ra.analysis.dayMasterAnalysis;
  const dmb = rb.analysis.dayMasterAnalysis;

  const aEl = ra.bazi.dayMasterElement as string;
  const bEl = rb.bazi.dayMasterElement as string;
  const aDay = ra.bazi.day.branch as string;
  const bDay = rb.bazi.day.branch as string;
  const aYear = ra.bazi.year.branch as string;
  const bYear = rb.bazi.year.branch as string;

  const dRel = elementRelation(aEl, bEl);
  const spouseRel = branchRelation(aDay, bDay);
  const zodiacRel = branchRelation(aYear, bYear);

  const favorsA: string[] = dma.favorable;
  const favorsB: string[] = dmb.favorable;
  const aAbundant = topElements(dma.elementCounts);
  const bAbundant = topElements(dmb.elementCounts);
  const crossA = favorsA.filter((e) => bAbundant.includes(e)).length;
  const crossB = favorsB.filter((e) => aAbundant.includes(e)).length;
  const wuxingScore = Math.max(30, Math.min(95, 60 + 15 * crossA + 15 * crossB));

  const aFavB = favorsA.includes(bEl);
  const bFavA = favorsB.includes(aEl);
  const xiyongScore = 50 + (aFavB ? 25 : 0) + (bFavA ? 25 : 0);

  const dimensions: HehunDimension[] = [
    {
      key: 'daymaster', name: '日主生克', weight: 0.25, score: ELEMENT_SCORE[dRel], relation: dRel,
      detail: `甲方日主${ra.bazi.dayMaster}属${aEl}，乙方日主${rb.bazi.dayMaster}属${bEl}，五行关系为「${dRel}」。`,
    },
    {
      key: 'spouse', name: '夫妻宫(日支)', weight: 0.30, score: BRANCH_SCORE[spouseRel], relation: spouseRel,
      detail: `甲方日支${aDay}，乙方日支${bDay}，地支关系为「${spouseRel}」。（六合/三合为佳，冲刑害需磨合）`,
    },
    {
      key: 'wuxing', name: '五行互补', weight: 0.20, score: wuxingScore, relation: `${crossA + crossB}项互补`,
      detail: `甲方喜用${favorsA.join('、')}，乙方旺${bAbundant.join('、')}；乙方喜用${favorsB.join('、')}，甲方旺${aAbundant.join('、')}。互补项：${crossA + crossB}。`,
    },
    {
      key: 'zodiac', name: '生肖关系', weight: 0.10, score: BRANCH_SCORE[zodiacRel], relation: zodiacRel,
      detail: `甲方生肖支${aYear}，乙方生肖支${bYear}，关系为「${zodiacRel}」。`,
    },
    {
      key: 'xiyong', name: '喜用神互补', weight: 0.15, score: xiyongScore, relation: `${aFavB ? '甲喜乙' : ''}${bFavA ? '乙喜甲' : ''}` || '无互补',
      detail: `甲方喜用${aFavB ? '包含' : '不包含'}乙方日主五行(${bEl})；乙方喜用${bFavA ? '包含' : '不包含'}甲方日主五行(${aEl})。`,
    },
  ];

  const totalScore = Math.round(dimensions.reduce((s, d) => s + d.score * d.weight, 0));
  const verdict = totalScore >= 80 ? '上等婚配' : totalScore >= 65 ? '中上婚配' : totalScore >= 50 ? '中平婚配' : '需多磨合';

  const best = [...dimensions].sort((x, y) => y.score - x.score)[0];
  const worst = [...dimensions].sort((x, y) => x.score - y.score)[0];
  const summary = `综合评分 ${totalScore} 分（${verdict}）。优势在「${best.name}」（${best.relation}），需留意「${worst.name}」（${worst.relation}）。命理合婚仅供参考，实际相处仍以双方性格、沟通与包容为重。`;

  return {
    a: { name: a.name || '甲方', gender: a.gender, pillars: `${ra.bazi.year.stem}${ra.bazi.year.branch} ${ra.bazi.month.stem}${ra.bazi.month.branch} ${ra.bazi.day.stem}${ra.bazi.day.branch} ${ra.bazi.hour.stem}${ra.bazi.hour.branch}`, dayMaster: ra.bazi.dayMaster, element: aEl, strength: dma.strength, favorable: favorsA },
    b: { name: b.name || '乙方', gender: b.gender, pillars: `${rb.bazi.year.stem}${rb.bazi.year.branch} ${rb.bazi.month.stem}${rb.bazi.month.branch} ${rb.bazi.day.stem}${rb.bazi.day.branch} ${rb.bazi.hour.stem}${rb.bazi.hour.branch}`, dayMaster: rb.bazi.dayMaster, element: bEl, strength: dmb.strength, favorable: favorsB },
    dimensions,
    totalScore,
    verdict,
    summary,
  };
}
