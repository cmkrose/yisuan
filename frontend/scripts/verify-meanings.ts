import { SHENSHA_MEANINGS } from '../src/lib/data/meanings/shensha-meanings';
import { NAYIN_MEANINGS } from '../src/lib/data/meanings/nayin-meanings';
import { SHISHEN_MEANINGS } from '../src/lib/data/meanings/shishen-meanings';
import { ZIWEI_STAR_MEANINGS, SIHUA_MEANINGS } from '../src/lib/data/meanings/ziwei-stars';
import { calculateBazi } from '../src/lib/engines/bazi/calculate';
import { calculateZiwei } from '../src/lib/engines/ziwei/calculator';

let fail = 0;
const check = (label: string, got: any, exp: any) => {
  const ok = got === exp;
  if (!ok) fail++;
  console.log(`  ${label}: ${got} 期望=${exp} ${ok ? 'PASS' : 'FAIL'}`);
};

console.log('== 数据包条数 ==');
check('神煞', Object.keys(SHENSHA_MEANINGS).length, 12);
check('纳音', Object.keys(NAYIN_MEANINGS).length, 30);
check('十神', Object.keys(SHISHEN_MEANINGS).length, 10);
check('紫微主星', Object.keys(ZIWEI_STAR_MEANINGS).length, 14);
check('四化', Object.keys(SIHUA_MEANINGS).length, 4);

const b = calculateBazi({ gender: 'male', birthYear: 1990, birthMonth: 5, birthDay: 15, birthHour: 10 });
console.log('== 样例命盘按名命中（1990-05-15 10时）==');
for (const s of b.analysis.extras.shensha) {
  check(`神煞「${s.name}」`, !!SHENSHA_MEANINGS[s.name], true);
}
for (const p of [b.bazi.year, b.bazi.month, b.bazi.day, b.bazi.hour]) {
  check(`纳音「${p.nayin}」`, !!NAYIN_MEANINGS[p.nayin], true);
  check(`十神「${p.shishen}」`, !!SHISHEN_MEANINGS[p.shishen], true);
}

const z = calculateZiwei(1990, 5, 15, 10, 'male');
const starNames = new Set<string>();
for (const p of z.palaces) for (const s of p.majorStars) starNames.add(s.name);
for (const name of starNames) {
  check(`紫微主星「${name}」`, !!ZIWEI_STAR_MEANINGS[name], true);
}

console.log(fail === 0 ? 'MEANINGS: ALL PASS' : `MEANINGS: FAIL(${fail})`);
