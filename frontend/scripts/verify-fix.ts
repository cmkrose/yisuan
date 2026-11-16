import { calculateZiwei, EARTHLY_BRANCHES } from '../src/lib/engines/ziwei/calculator';
import { calculateZiwei as backZiwei } from '../../backend/src/modules/ziwei/core/calculator';
import { calculateBazi } from '../src/lib/engines/bazi/calculate';
import { calculatePillars as backPillars } from '../../backend/src/modules/bazi/core/pillars';
import { articles } from '../src/lib/data/articles';

let fail = 0;
const check = (label: string, got: any, exp: any) => {
  const ok = got === exp;
  if (!ok) fail++;
  console.log(`  ${label}: ${got} 期望=${exp} ${ok ? 'PASS' : 'FAIL'}`);
};
const starBranch = (r: any, star: string) =>
  r.palaces.find((p: any) => p.majorStars.some((s: any) => s.name === star))?.branch;

console.log('== 补修一：紫微 8 盘 ==');
type ZCase = { y: number; m: number; d: number; h: number; g: 'male' | 'female'; mg?: string; ju: string; zw: string; tf: string };
const zcases: ZCase[] = [
  { y: 1990, m: 5, d: 15, h: 10, g: 'male', mg: '戊子', ju: '火六局', zw: '寅', tf: '寅' },
  { y: 2026, m: 11, d: 13, h: 10, g: 'female', mg: '甲午', ju: '金四局', zw: '子', tf: '辰' },
  { y: 2000, m: 1, d: 1, h: 0, g: 'male', ju: '水二局', zw: '丑', tf: '卯' },
  { y: 1985, m: 8, d: 20, h: 14, g: 'female', ju: '火六局', zw: '丑', tf: '卯' },
  { y: 1975, m: 3, d: 3, h: 22, g: 'male', ju: '土五局', zw: '戌', tf: '午' },
  { y: 2010, m: 12, d: 25, h: 6, g: 'female', ju: '水二局', zw: '亥', tf: '巳' },
  { y: 1966, m: 6, d: 6, h: 18, g: 'male', ju: '火六局', zw: '辰', tf: '子' },
  { y: 1999, m: 9, d: 9, h: 2, g: 'female', ju: '土五局', zw: '未', tf: '酉' },
];
for (const c of zcases) {
  const r = calculateZiwei(c.y, c.m, c.d, c.h, c.g);
  const be = backZiwei(c.y, c.m, c.d, c.h, c.g);
  const mg = r.palaces[0].stem + r.palaces[0].branch;
  if (c.mg) check(`${c.y}-${c.m}-${c.d} ${c.h}时 命宫`, mg, c.mg);
  check(`${c.y}-${c.m}-${c.d} ${c.h}时 五行局`, r.fiveElementBureau, c.ju);
  check(`${c.y}-${c.m}-${c.d} ${c.h}时 紫微`, starBranch(r, '紫微'), c.zw);
  check(`${c.y}-${c.m}-${c.d} ${c.h}时 天府`, starBranch(r, '天府'), c.tf);
  check(`${c.y}-${c.m}-${c.d} ${c.h}时 前后端一致`,
    `${be.palaces[0].stem}${be.palaces[0].branch}|${be.fiveElementBureau}|${starBranch(be, '紫微')}|${starBranch(be, '天府')}`,
    `${mg}|${r.fiveElementBureau}|${starBranch(r, '紫微')}|${starBranch(r, '天府')}`);
}

console.log('== 补修二：八字节气交接日 ==');
const bcases: { y: number; m: number; d: number; h: number; year?: string; month: string }[] = [
  { y: 1995, m: 9, d: 8, h: 12, month: '乙酉' },
  { y: 2052, m: 8, d: 7, h: 9, month: '戊申' },
  { y: 2097, m: 2, d: 3, h: 13, year: '丁巳', month: '壬寅' },
];
for (const c of bcases) {
  const b = calculateBazi({ gender: 'male', birthYear: c.y, birthMonth: c.m, birthDay: c.d, birthHour: c.h }).bazi;
  if (c.year) check(`${c.y}-${c.m}-${c.d} 年柱`, b.year.stem + b.year.branch, c.year);
  check(`${c.y}-${c.m}-${c.d} 月柱`, b.month.stem + b.month.branch, c.month);
  const bp = backPillars(c.y, c.m, c.d, c.h);
  check(`${c.y}-${c.m}-${c.d} 前后端一致`, `${bp.year.stem}${bp.year.branch}${bp.month.stem}${bp.month.branch}`, `${b.year.stem}${b.year.branch}${b.month.stem}${b.month.branch}`);
}
console.log('== 回归全盘 ==');
for (const [y, m, d, h, exp] of [
  [1990, 5, 15, 10, '庚午 辛巳 庚辰 辛巳'], [2026, 11, 13, 10, '丙午 己亥 辛卯 癸巳'],
] as [number, number, number, number, string][]) {
  const b = calculateBazi({ gender: 'male', birthYear: y, birthMonth: m, birthDay: d, birthHour: h }).bazi;
  check(`${y}-${m}-${d} ${h}时`, [b.year, b.month, b.day, b.hour].map((p: any) => p.stem + p.branch).join(' '), exp);
}
console.log('== 文章数组空洞 ==');
check('articles.length', articles.length, 21);
check('articles 过滤后', (articles as any[]).filter(Boolean).length, 21);

console.log(fail === 0 ? 'FIX: ALL PASS' : `FIX: FAIL(${fail})`);
