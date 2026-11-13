import { diff, fetchJson } from './diff';
import { sanshiQimen, sanshiLiuren } from '../src/lib/engines/sanshi/calculate';
import { zeriCalendar, zeriSelect } from '../src/lib/engines/zeri/calculate';
import { nameAnalyze, nameSuggest } from '../src/lib/engines/name-analysis/calculate';

const BASE = 'https://yisuan.onrender.com';

type Test = { label: string; local: () => any; api: string; body: any };

const tests: Test[] = [
  { label: 'sanshi/qimen A', local: () => sanshiQimen({ year: 2024, month: 2, day: 10, hour: 14, birthYear: 1990, birthMonth: 1, birthDay: 1, birthHour: 12, gender: 'male', location: '', purpose: 'general' }), api: '/api/sanshi/qimen', body: { year: 2024, month: 2, day: 10, hour: 14, birthYear: 1990, birthMonth: 1, birthDay: 1, birthHour: 12, gender: 'male', location: '', purpose: 'general' } },
  { label: 'sanshi/qimen B', local: () => sanshiQimen({ year: 2025, month: 6, day: 15, hour: 9, birthYear: 2000, birthMonth: 6, birthDay: 15, birthHour: 14, gender: 'female', location: '北京', purpose: 'career' }), api: '/api/sanshi/qimen', body: { year: 2025, month: 6, day: 15, hour: 9, birthYear: 2000, birthMonth: 6, birthDay: 15, birthHour: 14, gender: 'female', location: '北京', purpose: 'career' } },
  { label: 'sanshi/liuren A', local: () => sanshiLiuren({ month: 1, hour: 8 }), api: '/api/sanshi/liuren', body: { month: 1, hour: 8 } },
  { label: 'sanshi/liuren B', local: () => sanshiLiuren({ month: 5, hour: 14 }), api: '/api/sanshi/liuren', body: { month: 5, hour: 14 } },
  { label: 'zeri/calendar A', local: () => zeriCalendar(2026, 1), api: '/api/zeri/calendar', body: { year: 2026, month: 1 } },
  { label: 'zeri/calendar B', local: () => zeriCalendar(2025, 12), api: '/api/zeri/calendar', body: { year: 2025, month: 12 } },
  { label: 'zeri/select A', local: () => zeriSelect(2026, 5, 'wedding'), api: '/api/zeri/select', body: { year: 2026, month: 5, purpose: 'wedding' } },
  { label: 'zeri/select B', local: () => zeriSelect(2025, 10, 'business'), api: '/api/zeri/select', body: { year: 2025, month: 10, purpose: 'business' } },
  { label: 'name/analyze A', local: () => nameAnalyze({ surname: '张', givenName: '伟', gender: 'male' }), api: '/api/name-analysis/analyze', body: { surname: '张', givenName: '伟', gender: 'male' } },
  { label: 'name/analyze B', local: () => nameAnalyze({ surname: '李', givenName: '娜', gender: 'female' }), api: '/api/name-analysis/analyze', body: { surname: '李', givenName: '娜', gender: 'female' } },
  { label: 'name/suggest A', local: () => nameSuggest({ surname: '王', gender: 'male' }), api: '/api/name-analysis/suggest', body: { surname: '王', gender: 'male' } },
  { label: 'name/suggest B', local: () => nameSuggest({ surname: '张', gender: 'female' }), api: '/api/name-analysis/suggest', body: { surname: '张', gender: 'female' } },
];

(async () => {
  let pass = 0; let fail = 0;
  for (const t of tests) {
    let local: any;
    try { local = t.local(); } catch (e: any) { console.log(`${t.label} -> LOCAL THROW: ${e.message}`); fail++; continue; }
    let remote: any;
    try { remote = await fetchJson(BASE + t.api, t.body); }
    catch (e: any) { console.log(`${t.label} -> REMOTE FETCH FAILED: ${e.message}`); fail++; continue; }
    const out: string[] = [];
    diff(local, remote, '$', out);
    if (out.length === 0) { console.log(`${t.label} -> PASS`); pass++; }
    else { console.log(`${t.label} -> FAIL (${out.length})`); out.slice(0, 8).forEach((d) => console.log('   ' + d)); fail++; }
  }
  console.log(`\nPHASE2 ALIGNMENT: ${pass} pass, ${fail} fail`);
  process.exit(fail === 0 ? 0 : 1);
})();
