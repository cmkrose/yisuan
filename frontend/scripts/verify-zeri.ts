import { getDayInfo, getMonthCalendar, selectDates } from '../src/lib/engines/zeri/index';

const dates: [number, number, number][] = [
  [2026, 11, 13],
  [2026, 11, 14],
  [2027, 1, 1],
];

function check(d: any, tag: string) {
  const inter = d.yi.filter((x: string) => d.ji.includes(x));
  const ok = d.yi.length > 0 && d.ji.length >= 0 && inter.length === 0;
  console.log(`${tag} ${d.date} 建除=${d.jianchu} 宜=[${d.yi.join(',')}] 忌=[${d.ji.join(',')}] 交集=[${inter.join(',')}] ${ok ? 'PASS' : 'FAIL'}`);
  return ok;
}

(async () => {
  let all = true;
  for (const [y, m, dd] of dates) {
    const day = getDayInfo(y, m, dd);
    all = check(day, 'getDayInfo') && all;
    const cal = getMonthCalendar(y, m).find((x) => x.date === day.date);
    const same = cal && JSON.stringify(cal.yi) === JSON.stringify(day.yi) && JSON.stringify(cal.ji) === JSON.stringify(day.ji);
    console.log(`   日历同日一致: ${same ? 'PASS' : 'FAIL'}`);
    all = !!same && all;
  }
  console.log('\n--- selectDates 宜忌无交集检查 ---');
  for (const purpose of ['wedding', 'business', 'moving', 'construction'] as const) {
    const list = selectDates(2026, 11, purpose);
    let bad = 0;
    for (const d of list) {
      const inter = d.yi.filter((x) => d.ji.includes(x));
      if (inter.length || d.yi.length === 0) bad++;
    }
    console.log(`purpose=${purpose} days=${list.length} 违规=${bad}`);
    if (bad) all = false;
  }
  console.log(all ? '\nZERI YIJI: ALL PASS' : '\nZERI YIJI: FAIL');
  process.exit(all ? 0 : 1);
})();
