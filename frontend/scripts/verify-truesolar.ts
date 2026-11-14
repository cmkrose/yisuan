import { computeTrueSolar, hourBranchName } from '../src/lib/utils/truesolar';
import { calculateBazi } from '../src/lib/engines/bazi/calculate';

const base = { gender: 'male' as const, birthYear: 2024, birthMonth: 5, birthDay: 15, birthHour: 12 };

function run(place: string, longitude: number) {
  const t = computeTrueSolar(base.birthYear, base.birthMonth, base.birthDay, base.birthHour, longitude);
  const r = calculateBazi({ ...base, birthYear: t.year, birthMonth: t.month, birthDay: t.day, birthHour: t.hour });
  return { place, longitude, t, before: hourBranchName(base.birthHour), after: hourBranchName(t.hour), pillar: `${r.bazi.hour.stem}${r.bazi.hour.branch}` };
}

const off = calculateBazi(base);
console.log('关闭校正(原逻辑): 时柱 =', `${off.bazi.hour.stem}${off.bazi.hour.branch}`, '时辰 =', hourBranchName(base.birthHour));

const bj = run('北京', 116.41);
const wlmq = run('乌鲁木齐', 87.62);
for (const x of [bj, wlmq]) {
  console.log(`${x.place}(经度${x.longitude}): 偏移${x.t.offsetMinutes}分钟, 校正前${x.before} -> 校正后${x.after}, 时柱=${x.pillar}`);
}
console.log('\n北京 vs 乌鲁木齐 时柱不同:', bj.pillar !== wlmq.pillar ? 'PASS' : 'FAIL');
console.log('关闭时与现行一致:', off.bazi.hour.branch === calculateBazi(base).bazi.hour.branch ? 'PASS' : 'FAIL');
