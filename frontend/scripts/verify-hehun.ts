import { calculatePillars } from '../src/lib/engines/bazi/pillars';
import { calculateHehun } from '../src/lib/engines/hehun';

function findDayBranch(target: string): { y: number; m: number; d: number } {
  for (let y = 1990; y <= 1993; y++) {
    for (let m = 1; m <= 12; m++) {
      for (let d = 1; d <= 28; d++) {
        if (calculatePillars(y, m, d, 0).day.branch === target) return { y, m, d };
      }
    }
  }
  throw new Error('not found ' + target);
}

const zi = findDayBranch('子');
const chou = findDayBranch('丑');
const wu = findDayBranch('午');
console.log('日支子:', zi, '日支丑:', chou, '日支午:', wu);

const A = { gender: 'male' as const, name: '男', birthYear: zi.y, birthMonth: zi.m, birthDay: zi.d, birthHour: 10 };
const B_lh = { gender: 'female' as const, name: '女合', birthYear: chou.y, birthMonth: chou.m, birthDay: chou.d, birthHour: 8 };
const B_ch = { gender: 'female' as const, name: '女冲', birthYear: wu.y, birthMonth: wu.m, birthDay: wu.d, birthHour: 8 };

for (const [tag, B] of [['六合用例', B_lh], ['六冲用例', B_ch]] as const) {
  const r = calculateHehun(A, B as any);
  const spouse = r.dimensions.find((x) => x.key === 'spouse')!;
  console.log(`\n== ${tag} == 日支 ${r.a.pillars.split(' ')[2].slice(-1)} / ${r.b.pillars.split(' ')[2].slice(-1)}`);
  console.log(`  夫妻宫关系=${spouse.relation} 分=${spouse.score}`);
  r.dimensions.forEach((d) => console.log(`  - ${d.name}: ${d.relation} ${d.score}分(权重${d.weight})`));
  console.log(`  综合=${r.totalScore} ${r.verdict}`);
}

const lh = calculateHehun(A, B_lh as any).dimensions.find((x) => x.key === 'spouse')!.relation;
const ch = calculateHehun(A, B_ch as any).dimensions.find((x) => x.key === 'spouse')!.relation;
console.log('\n验收: 六合用例判定=六合:', lh === '六合' ? 'PASS' : 'FAIL(' + lh + ')', '| 六冲用例判定=相冲:', ch === '相冲' ? 'PASS' : 'FAIL(' + ch + ')');
