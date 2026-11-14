import { Solar } from 'lunar-javascript';
import { calculateZiwei, EARTHLY_BRANCHES } from '../src/lib/engines/ziwei/calculator';
import { calculateZiwei as backZiwei } from '../../backend/src/modules/ziwei/core/calculator';

const starBranch = (r: any, star: string) =>
  r.palaces.find((p: any) => p.majorStars.some((s: any) => s.name === star))?.branch;
const branchIdx = (b: string) => EARTHLY_BRANCHES.indexOf(b as any);

let fail = 0;
console.log('== 同一公历生日、不同时辰：五行局相同则紫微须相同（局随命宫时辰而变，属标准口径） ==');
for (const [y, m, d] of [[1990, 5, 15], [2026, 11, 13], [2024, 2, 10]] as [number, number, number][]) {
  const a = calculateZiwei(y, m, d, 0, 'male');
  const b = calculateZiwei(y, m, d, 10, 'male');
  const sameBureau = a.fiveElementBureau === b.fiveElementBureau;
  const ok = !sameBureau || starBranch(a, '紫微') === starBranch(b, '紫微');
  if (!ok) fail++;
  console.log(`  ${y}-${m}-${d} 0时=${a.fiveElementBureau}/紫微${starBranch(a, '紫微')} 10时=${b.fiveElementBureau}/紫微${starBranch(b, '紫微')} ${sameBureau ? '同局' : '异局(标准允许不同)'} ${ok ? 'PASS' : 'FAIL'}`);
}

console.log('== 紫微定位公式 / 天府镜像 / 宫位逆排 / 前后端一致 ==');
let seed = 4242;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const expectedZiwei = (lunarDay: number, bureauNum: number) => {
  const q = Math.ceil(lunarDay / bureauNum);
  const r = q * bureauNum - lunarDay;
  const base = 2 + (q - 1);
  return ((base + (r % 2 === 0 ? r : -r)) % 12 + 12) % 12;
};
for (let i = 0; i < 12; i++) {
  const y = 1970 + Math.floor(rnd() * 60);
  const m = 1 + Math.floor(rnd() * 12);
  const d = 1 + Math.floor(rnd() * 28);
  const h = Math.floor(rnd() * 23);
  const r = calculateZiwei(y, m, d, h, i % 2 ? 'female' : 'male');
  const lu = Solar.fromYmd(y, m, d).getLunar();
  const lunarDay = lu.getDay();
  const BUREAU_NUM: Record<string, number> = { 水二局: 2, 木三局: 3, 金四局: 4, 土五局: 5, 火六局: 6 };
  const bureauNum = BUREAU_NUM[r.fiveElementBureau as string] || 2;
  const expZ = EARTHLY_BRANCHES[expectedZiwei(lunarDay, bureauNum)];
  const zw = starBranch(r, '紫微');
  const tf = starBranch(r, '天府');
  const expTf = EARTHLY_BRANCHES[((4 - branchIdx(zw) + 12) % 12)];
  const lifeIdx = branchIdx(r.palaces[0].branch);
  const dirOk = r.palaces.every((p: any, idx: number) => branchIdx(p.branch) === ((lifeIdx - idx) % 12 + 12) % 12);
  const back = backZiwei(y, m, d, h, i % 2 ? 'female' : 'male');
  const beOk = r.palaces.every((p: any, idx: number) => {
    const bp = (back as any).palaces[idx];
    const a = p.majorStars.map((s: any) => s.name).sort().join(',');
    const b = bp.majorStars.map((s: any) => s.name).sort().join(',');
    return p.branch === bp.branch && a === b;
  });
  const ok = zw === expZ && tf === expTf && dirOk && beOk;
  if (!ok) fail++;
  console.log(`  ${y}-${m}-${d} ${h}时 局=${r.fiveElementBureau} 紫微=${zw}${zw === expZ ? '' : '(期望' + expZ + ')'} 天府=${tf}${tf === expTf ? '' : '(期望' + expTf + ')'} 逆排=${dirOk} 前后端=${beOk} ${ok ? 'PASS' : 'FAIL'}`);
}

console.log('== 亮度单格：太阳在戌≠庙；太阴在酉=庙 ==');
let sunXu = 0, moonYou = 0, check = 0;
for (let i = 0; i < 60; i++) {
  const y = 1980 + Math.floor(rnd() * 40);
  const m = 1 + Math.floor(rnd() * 12);
  const d = 1 + Math.floor(rnd() * 28);
  const r = calculateZiwei(y, m, d, 10, 'male');
  for (const p of r.palaces) {
    const sun = p.majorStars.find((s: any) => s.name === '太阳');
    const moon = p.majorStars.find((s: any) => s.name === '太阴');
    if (sun && p.branch === '戌') { check++; if (sun.brightness !== '庙') sunXu++; }
    if (moon && p.branch === '酉') { check++; if (moon.brightness === '庙') moonYou++; }
  }
}
console.log(`  太阳戌出现且非庙=${sunXu}；太阴酉出现且为庙=${moonYou}（共检 ${check} 例）`);

console.log(fail === 0 ? 'ZIWEI STRUCTURE: ALL PASS' : `ZIWEI STRUCTURE: FAIL(${fail})`);
