import { diff, fetchJson } from './diff';
import { calculateZiweiLocal } from '../src/lib/engines/ziwei/calculate';

const cases = [
  { birthYear: 1990, birthMonth: 1, birthDay: 1, birthHour: 8, gender: 'male' as const },
  { birthYear: 2000, birthMonth: 6, birthDay: 15, birthHour: 14, gender: 'female' as const },
];

const API = 'https://yisuan.onrender.com/api/ziwei/calculate';

(async () => {
  let allPass = true;
  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    const local = calculateZiweiLocal(c as any);
    let remote: any;
    try { remote = await fetchJson(API, c); }
    catch (e: any) { console.log(`Case ${i + 1} -> REMOTE FETCH FAILED: ${e.message}`); allPass = false; continue; }
    const out: string[] = [];
    diff(local, remote, '$', out);
    if (out.length === 0) console.log(`Case ${i + 1} ${JSON.stringify(c)} -> PASS`);
    else { allPass = false; console.log(`Case ${i + 1} -> FAIL (${out.length})`); out.slice(0, 12).forEach((d) => console.log('   ' + d)); }
  }
  console.log(allPass ? '\nZIWEI ALIGNMENT: ALL PASS' : '\nZIWEI ALIGNMENT: FAILED');
  process.exit(allPass ? 0 : 1);
})();
