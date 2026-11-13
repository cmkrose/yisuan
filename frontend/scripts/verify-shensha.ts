import { calculateBazi } from '../src/lib/engines/bazi/calculate';

const cases = [
  { tag: '1990-05-15 10时 男', input: { gender: 'male' as const, birthYear: 1990, birthMonth: 5, birthDay: 15, birthHour: 10 } },
  { tag: '2000-01-01 0时 女', input: { gender: 'female' as const, birthYear: 2000, birthMonth: 1, birthDay: 1, birthHour: 0 } },
];

for (const { tag, input } of cases) {
  const r = calculateBazi(input);
  const b = r.bazi;
  console.log(`\n===== ${tag} =====`);
  console.log(`四柱: ${b.year.stem}${b.year.branch} ${b.month.stem}${b.month.branch} ${b.day.stem}${b.day.branch} ${b.hour.stem}${b.hour.branch}  日主=${b.dayMaster}`);
  const ex = r.analysis.extras;
  console.log('神煞:');
  for (const s of ex.shensha) {
    console.log(`  ${s.name}(${s.basis}, 目标${s.targets.join('/')}) -> ${s.hits.length ? s.hits.join('、') : '无'}`);
  }
  console.log(`旬空: ${ex.kongwang.xun} 空${ex.kongwang.emptyBranches.join('')} -> 命中${ex.kongwang.hitPillars.length ? ex.kongwang.hitPillars.join('、') : '无'}`);
  console.log(`胎元: ${ex.taiyuan.stem}${ex.taiyuan.branch}  命宫: ${ex.minggong.stem}${ex.minggong.branch}  身宫: ${ex.shengong.stem}${ex.shengong.branch}`);
}
