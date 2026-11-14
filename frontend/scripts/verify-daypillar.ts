import { Solar } from 'lunar-javascript';
import { calculatePillars } from '../src/lib/engines/bazi/pillars';
import { calculateBazi } from '../src/lib/engines/bazi/calculate';

const lz = (y: number, m: number, d: number) =>
  Solar.fromYmd(y, m, d).getLunar().getEightChar().getDay();

let fail = 0;
console.log('== 锚点 7 例 ==');
const anchors: [number, number, number, string][] = [
  [1900, 1, 31, '甲辰'], [1949, 10, 1, '甲子'], [2000, 1, 1, '戊午'],
  [1990, 5, 15, '庚辰'], [2024, 2, 10, '甲辰'], [2026, 11, 13, '辛卯'],
  [2026, 11, 14, '壬辰'],
];
for (const [y, m, d, exp] of anchors) {
  const p = calculatePillars(y, m, d, 10).day;
  const got = p.stem + p.branch;
  const ok = got === exp && got === lz(y, m, d);
  if (!ok) fail++;
  console.log(`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')} 期望=${exp} 引擎=${got} lunar=${lz(y,m,d)} ${ok ? 'PASS' : 'FAIL'}`);
}

console.log('== 1000 天随机扫描 (1900-2100) ==');
let seed = 20261114;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
let scanFail = 0;
for (let i = 0; i < 1000; i++) {
  const y = 1900 + Math.floor(rnd() * 201);
  const m = 1 + Math.floor(rnd() * 12);
  const d = 1 + Math.floor(rnd() * 28);
  const p = calculatePillars(y, m, d, 10).day;
  const got = p.stem + p.branch;
  const exp = lz(y, m, d);
  if (got !== exp) { scanFail++; if (scanFail <= 5) console.log(`  MISMATCH ${y}-${m}-${d} got=${got} exp=${exp}`); }
}
console.log(`1000 天对比：不符 ${scanFail} 例 ${scanFail === 0 ? 'PASS' : 'FAIL'}`);
fail += scanFail;

console.log('== 全盘用例 ==');
for (const [y, m, d, h, exp] of [
  [1990, 5, 15, 10, '庚午 辛巳 庚辰 辛巳'],
  [2026, 11, 13, 10, '丙午 己亥 辛卯 癸巳'],
] as [number, number, number, number, string][]) {
  const r = calculateBazi({ gender: 'male', birthYear: y, birthMonth: m, birthDay: d, birthHour: h });
  const b = r.bazi;
  const got = [b.year, b.month, b.day, b.hour].map((p: any) => p.stem + p.branch).join(' ');
  const ok = got === exp;
  if (!ok) fail++;
  console.log(`${y}-${m}-${d} ${h}时 期望=${exp} 引擎=${got} 日主=${b.dayMaster} ${ok ? 'PASS' : 'FAIL'}`);
}

console.log(fail === 0 ? 'DAYPILLAR: ALL PASS' : `DAYPILLAR: FAIL (${fail})`);
