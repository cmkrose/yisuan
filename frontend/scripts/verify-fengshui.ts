import { calculateFlyingStars, calculateEightMansion } from '../src/lib/engines/fengshui/engine';
import { calculateFlyingStars as backFly, calculateEightMansion as backMing } from '../../backend/src/modules/fengshui/core/engine';

let fail = 0;
const starOf = (r: any, palace: number) => r.grid.find((g: any) => g.palace === palace)?.star;

console.log('== 2024 九宫飞星（三碧入中）==');
const fs = calculateFlyingStars(2024);
const back = backFly(2024);
const checks: [string, number, number][] = [['中宫', 5, 3], ['坎宫', 1, 8], ['乾宫', 6, 4]];
for (const [name, palace, exp] of checks) {
  const got = starOf(fs, palace);
  const ok = got === exp;
  if (!ok) fail++;
  console.log(`  ${name}=${got} 期望=${exp} ${ok ? 'PASS' : 'FAIL'}`);
}
const wealthOk = fs.wealthPosition === '北';
if (!wealthOk) fail++;
console.log(`  财位(八白)=${fs.wealthPosition} 期望=北 ${wealthOk ? 'PASS' : 'FAIL'}`);
const beOk = JSON.stringify(fs.grid.map((g: any) => [g.palace, g.star])) === JSON.stringify(back.grid.map((g: any) => [g.palace, g.star]));
if (!beOk) fail++;
console.log(`  前后端一致 ${beOk ? 'PASS' : 'FAIL'}（${fs.grid.map((g: any) => `${g.palace}:${g.star}`).join(' ')}）`);

console.log('== 命卦三例 ==');
const ming: [number, 'male' | 'female', string][] = [
  [1990, 'male', '离'], [1985, 'male', '坤'], [1990, 'female', '乾'],
];
for (const [y, g, exp] of ming) {
  const r = calculateEightMansion(y, g);
  const ok = r.birthGua === exp;
  if (!ok) fail++;
  console.log(`  ${y} ${g === 'male' ? '男' : '女'} = ${r.birthGua}命（${r.birthElement}）期望=${exp} ${ok ? 'PASS' : 'FAIL'}`);
}

console.log('== 1900-2100 男女不得返回空卦 ==');
let empty = 0;
for (let y = 1900; y <= 2100; y++) {
  for (const g of ['male', 'female'] as const) {
    if (!calculateEightMansion(y, g).birthGua) empty++;
  }
}
if (empty > 0) fail++;
console.log(`  空卦数=${empty} ${empty === 0 ? 'PASS' : 'FAIL'}`);

console.log(fail === 0 ? 'FENGSHUI: ALL PASS' : `FENGSHUI: FAIL(${fail})`);
