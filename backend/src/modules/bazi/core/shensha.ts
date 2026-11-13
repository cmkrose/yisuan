import { HEAVENLY_STEMS, EARTHLY_BRANCHES, TianGan, DiZhi, BaziResult } from './constants';

// 起例口径说明：
// - 天乙贵人 / 文昌贵人 / 禄神 / 羊刃：以「日干」起例。
// - 桃花(咸池) / 驿马 / 华盖 / 将星：以「日支」三合局起例（申子辰、亥卯未、寅午戌、巳酉丑）。
// - 旬空(空亡)：以「日柱」所在旬起例（甲子旬空戌亥，依次类推），在四柱中标注落入空亡的地支。
// - 胎元：月干进一位、月支进三位。
// - 命宫：以子=1起例，命宫序号 = 14 - 月支序 - 时支序（超出 1..12 取模修正），天干用年干五虎遁推得。
// - 身宫：以子=1起例，身宫序号 = 月支序 + 时支序（超出 12 减 12），天干用年干五虎遁推得。

const ST = HEAVENLY_STEMS as readonly string[];
const BR = EARTHLY_BRANCHES as readonly string[];

const TIANYI: Record<string, string[]> = {
  甲: ['丑', '未'], 戊: ['丑', '未'], 庚: ['丑', '未'],
  乙: ['子', '申'], 己: ['子', '申'],
  丙: ['亥', '酉'], 丁: ['亥', '酉'],
  壬: ['卯', '巳'], 癸: ['卯', '巳'],
  辛: ['午', '寅'],
};
const WENCHANG: Record<string, string> = { 甲:'巳', 乙:'午', 丙:'申', 丁:'酉', 戊:'申', 己:'酉', 庚:'亥', 辛:'子', 壬:'寅', 癸:'卯' };
const LUSHEN: Record<string, string> = { 甲:'寅', 乙:'卯', 丙:'巳', 丁:'午', 戊:'巳', 己:'午', 庚:'申', 辛:'酉', 壬:'亥', 癸:'子' };
const YANGREN: Record<string, string> = { 甲:'卯', 乙:'辰', 丙:'午', 丁:'未', 戊:'午', 己:'未', 庚:'酉', 辛:'戌', 壬:'子', 癸:'丑' };

function sanheTarget(branch: string, map: Record<'shenzi'|'haism'|'yinwu'|'siyou', string>): string {
  if (['申', '子', '辰'].includes(branch)) return map.shenzi;
  if (['亥', '卯', '未'].includes(branch)) return map.haism;
  if (['寅', '午', '戌'].includes(branch)) return map.yinwu;
  return map.siyou;
}
const TAOHUA = { shenzi: '酉', haism: '子', yinwu: '卯', siyou: '午' };
const YIMA = { shenzi: '寅', haism: '巳', yinwu: '申', siyou: '亥' };
const HUAGAI = { shenzi: '辰', haism: '未', yinwu: '戌', siyou: '丑' };
const JIANGXING = { shenzi: '子', haism: '卯', yinwu: '午', siyou: '酉' };

// 五虎遁：年干 → 寅月天干
const WUHU: Record<string, string> = { 甲:'丙', 己:'丙', 乙:'戊', 庚:'戊', 丙:'庚', 辛:'庚', 丁:'壬', 壬:'壬', 戊:'甲', 癸:'甲' };
function stemByYearGanAndBranch(yearStem: string, branch: string): string {
  const base = ST.indexOf(WUHU[yearStem] || '丙');
  const offset = ((BR.indexOf(branch) - BR.indexOf('寅')) % 12 + 12) % 12;
  return ST[(base + offset) % 10];
}

function jiaziIndexOf(stemIdx: number, branchIdx: number): number {
  for (let i = 0; i < 60; i++) if (i % 10 === stemIdx && i % 12 === branchIdx) return i;
  return -1;
}

const XUN_KONG: string[][] = [
  ['戌', '亥'], // 甲子旬
  ['申', '酉'], // 甲戌旬
  ['午', '未'], // 甲申旬
  ['辰', '巳'], // 甲午旬
  ['寅', '卯'], // 甲辰旬
  ['子', '丑'], // 甲寅旬
];
const XUN_NAME = ['甲子旬', '甲戌旬', '甲申旬', '甲午旬', '甲辰旬', '甲寅旬'];

export interface ShenShaHit { name: string; basis: string; targets: string[]; hits: string[]; }
export interface KongWang { xun: string; emptyBranches: string[]; hitPillars: string[]; hitBranches: string[]; }
export interface BaziExtras {
  shensha: ShenShaHit[];
  kongwang: KongWang;
  taiyuan: { stem: string; branch: string };
  minggong: { stem: string; branch: string };
  shengong: { stem: string; branch: string };
}

export function computeExtras(bazi: BaziResult): BaziExtras {
  const pillarNames = ['年柱', '月柱', '日柱', '时柱'];
  const branches = [bazi.year.branch, bazi.month.branch, bazi.day.branch, bazi.hour.branch] as DiZhi[];
  const dayStem = bazi.day.stem as TianGan;
  const dayBranch = bazi.day.branch as DiZhi;

  const hitPillars = (targets: string[]): string[] =>
    pillarNames.filter((_, i) => targets.includes(branches[i]));

  const shensha: ShenShaHit[] = [
    { name: '天乙贵人', basis: '日干', targets: TIANYI[dayStem] || [], hits: hitPillars(TIANYI[dayStem] || []) },
    { name: '文昌贵人', basis: '日干', targets: [WENCHANG[dayStem]], hits: hitPillars([WENCHANG[dayStem]]) },
    { name: '桃花(咸池)', basis: '日支', targets: [sanheTarget(dayBranch, TAOHUA)], hits: hitPillars([sanheTarget(dayBranch, TAOHUA)]) },
    { name: '驿马', basis: '日支', targets: [sanheTarget(dayBranch, YIMA)], hits: hitPillars([sanheTarget(dayBranch, YIMA)]) },
    { name: '华盖', basis: '日支', targets: [sanheTarget(dayBranch, HUAGAI)], hits: hitPillars([sanheTarget(dayBranch, HUAGAI)]) },
    { name: '禄神', basis: '日干', targets: [LUSHEN[dayStem]], hits: hitPillars([LUSHEN[dayStem]]) },
    { name: '羊刃', basis: '日干', targets: [YANGREN[dayStem]], hits: hitPillars([YANGREN[dayStem]]) },
    { name: '将星', basis: '日支', targets: [sanheTarget(dayBranch, JIANGXING)], hits: hitPillars([sanheTarget(dayBranch, JIANGXING)]) },
  ];

  // 旬空（日柱起例）
  const jz = jiaziIndexOf(ST.indexOf(bazi.day.stem), BR.indexOf(bazi.day.branch));
  const xun = jz >= 0 ? Math.floor(jz / 10) : 0;
  const emptyBranches = XUN_KONG[xun];
  const hitIdx = pillarNames.filter((_, i) => emptyBranches.includes(branches[i]));
  const kongwang: KongWang = {
    xun: XUN_NAME[xun],
    emptyBranches,
    hitPillars: hitIdx,
    hitBranches: branches.filter((b) => emptyBranches.includes(b)),
  };

  // 胎元：月干进一位，月支进三位
  const mStemIdx = ST.indexOf(bazi.month.stem);
  const mBranchIdx = BR.indexOf(bazi.month.branch);
  const taiyuan = {
    stem: ST[(mStemIdx + 1) % 10],
    branch: BR[(mBranchIdx + 3) % 12],
  };

  // 命宫 / 身宫（子=1 起例）
  const mNum = BR.indexOf(bazi.month.branch) + 1;
  const hNum = BR.indexOf(bazi.hour.branch) + 1;
  let mgNum = 14 - mNum - hNum;
  while (mgNum <= 0) mgNum += 12;
  while (mgNum > 12) mgNum -= 12;
  const minggongBranch = BR[mgNum - 1];

  let sgNum = mNum + hNum;
  if (sgNum > 12) sgNum -= 12;
  const shengongBranch = BR[sgNum - 1];

  const minggong = { stem: stemByYearGanAndBranch(bazi.year.stem, minggongBranch), branch: minggongBranch };
  const shengong = { stem: stemByYearGanAndBranch(bazi.year.stem, shengongBranch), branch: shengongBranch };

  return { shensha, kongwang, taiyuan, minggong, shengong };
}
