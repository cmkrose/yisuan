import { Solar } from 'lunar-javascript';
import { calculateZiwei, EARTHLY_BRANCHES } from '../src/lib/engines/ziwei/calculator';

const dates: [number, number, number][] = [
  [2024, 2, 10], [2025, 8, 1], [2000, 1, 1], [1990, 5, 15], [2026, 11, 13],
];
let fail = 0;
console.log('== 紫微历表审计：公历→农历（含闰月年） ==');
for (const [y, m, d] of dates) {
  const lu = Solar.fromYmd(y, m, d).getLunar();
  const lm = Math.abs(lu.getMonth());
  const ld = lu.getDay();
  const leap = lu.getMonth() < 0;
  const r = calculateZiwei(y, m, d, 0, 'male');
  const expectedLife = EARTHLY_BRANCHES[((2 + lm - 1) % 12 + 12) % 12];
  const gotLife = r.palaces[0].branch;
  const ok = gotLife === expectedLife;
  if (!ok) fail++;
  console.log(`公历 ${y}-${m}-${d} → 农历 ${lu.getYear()}年${leap?'闰':''}${lm}月${ld}日 | 命宫期望=${expectedLife} 引擎=${gotLife} ${ok?'PASS':'FAIL'}`);
}
console.log(fail === 0 ? 'ZIWEI CALENDAR: ALL PASS' : `ZIWEI CALENDAR: FAIL(${fail})`);
