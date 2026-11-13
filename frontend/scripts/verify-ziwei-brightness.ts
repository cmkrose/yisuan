import { calculateZiweiLocal } from '../src/lib/engines/ziwei/calculate';

const cases = [
  { birthYear: 1990, birthMonth: 1, birthDay: 1, birthHour: 8, gender: 'male' as const },
  { birthYear: 2000, birthMonth: 6, birthDay: 15, birthHour: 14, gender: 'female' as const },
];
for (const c of cases) {
  const r = calculateZiweiLocal(c);
  const set = new Set<string>();
  for (const p of r.palaces) for (const s of p.majorStars) set.add(s.brightness);
  console.log(`${JSON.stringify(c)} -> 主星亮度取值: [${[...set].join(',')}] 种类=${set.size}`);
}
