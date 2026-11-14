import { Solar } from 'lunar-javascript';
import { calculateBazi } from '../src/lib/engines/bazi/calculate';
import { calculatePillars as frontPillars } from '../src/lib/engines/bazi/pillars';
import { calculatePillars as backPillars } from '../../backend/src/modules/bazi/core/pillars';

function ecOf(y: number, m: number, d: number, h: number) {
  return Solar.fromYmdHms(y, m, d, h, 0, 0).getLunar().getEightChar();
}

let seed = 777;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

console.log('== 30 组随机盘：年/月/日/时柱·日主·十神(年月时) 对 lunar EightChar ==');
let fail = 0, beFail = 0;
for (let i = 0; i < 30; i++) {
  const y = 1950 + Math.floor(rnd() * 80);
  const m = 3 + Math.floor(rnd() * 10);
  const d = 1 + Math.floor(rnd() * 28);
  const h = Math.floor(rnd() * 23);
  const r = calculateBazi({ gender: 'male', birthYear: y, birthMonth: m, birthDay: d, birthHour: h });
  const b = r.bazi;
  const ec = ecOf(y, m, d, h);
  const pillarsOf = (x: any) => [x.year, x.month, x.day, x.hour].map((p: any) => p.stem + p.branch).join(' ');
  const ours = {
    pillars: pillarsOf(b),
    dm: b.dayMaster,
    ss: [b.year.shishen, b.month.shishen, b.hour.shishen].join(','),
  };
  const ref = {
    pillars: [ec.getYear(), ec.getMonth(), ec.getDay(), ec.getTime()].join(' '),
    dm: ec.getDayGan(),
    ss: [ec.getYearShiShenGan(), ec.getMonthShiShenGan(), ec.getTimeShiShenGan()].join(','),
  };
  const ok = ours.pillars === ref.pillars && ours.dm === ref.dm && ours.ss === ref.ss;
  if (!ok) { fail++; console.log(`  FAIL ${y}-${m}-${d} ${h}时 ours=${JSON.stringify(ours)} ref=${JSON.stringify(ref)}`); }
  // 前后端一致性（同一输入，两份引擎）
  const fp = frontPillars(y, m, d, h);
  const bp = backPillars(y, m, d, h);
  if (pillarsOf(fp) !== pillarsOf(bp)) { beFail++; console.log(`  BE-FAIL ${y}-${m}-${d} ${h}时 front=${pillarsOf(fp)} back=${pillarsOf(bp)}`); }
}
console.log(`30 组对 lunar：不符 ${fail} 例 ${fail === 0 ? 'PASS' : 'FAIL'}`);
console.log(`30 组前后端一致：不符 ${beFail} 例 ${beFail === 0 ? 'PASS' : 'FAIL'}`);

console.log('== 两组全盘十神对照（day 十神为自身，引擎记「比肩」、lunar 记「日主」，属标注约定）==');
for (const [y, m, d, h] of [[1990, 5, 15, 10], [2026, 11, 13, 10]] as [number, number, number, number][]) {
  const r = calculateBazi({ gender: 'male', birthYear: y, birthMonth: m, birthDay: d, birthHour: h });
  const b = r.bazi;
  const ec = ecOf(y, m, d, h);
  console.log(`${y}-${m}-${d} ${h}时 四柱=${b.year.stem}${b.year.branch} ${b.month.stem}${b.month.branch} ${b.day.stem}${b.day.branch} ${b.hour.stem}${b.hour.branch}`);
  console.log(`  十神 引擎=${[b.year.shishen, b.month.shishen, b.day.shishen, b.hour.shishen].join(',')}`);
  console.log(`  十神 lunar=${[ec.getYearShiShenGan(), ec.getMonthShiShenGan(), ec.getDayShiShenGan(), ec.getTimeShiShenGan()].join(',')}`);
}
