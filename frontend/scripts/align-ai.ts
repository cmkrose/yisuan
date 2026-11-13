import { diff, fetchJson } from './diff';
import { aiEngine } from '../src/lib/engines/ai-consultant/engine';
import { calculateBazi } from '../src/lib/engines/bazi/calculate';
import { divMeihuaName } from '../src/lib/engines/divination/calculate';

const BASE = 'https://yisuan.onrender.com';

const baziData = calculateBazi({ gender: 'male', birthYear: 1990, birthMonth: 5, birthDay: 15, birthHour: 10 });
const divData = divMeihuaName('易');

const cases: any[] = [
  { question: '今年事业运势如何', categories: ['bazi'], baziData },
  { question: '我的财运怎么样', categories: ['divination'], divinationData: divData },
];

(async () => {
  let fail = 0;
  for (let i = 0; i < cases.length; i++) {
    const req = cases[i];
    const local = aiEngine.analyzeLocal(req);
    let remote: any;
    try { remote = await fetchJson(BASE + '/api/ai-consultant/analyze', req); }
    catch (e: any) { console.log(`Case ${i + 1} -> REMOTE FAILED: ${e.message}`); fail++; continue; }
    const out: string[] = [];
    diff(local, remote, '$', out);
    if (out.length === 0) console.log(`Case ${i + 1} (${req.categories.join(',')}) -> PASS (fallback identical)`);
    else { console.log(`Case ${i + 1} -> DIFF (${out.length}) - remote may be using LLM, not fallback`); out.slice(0, 6).forEach((d) => console.log('   ' + d)); fail++; }
  }
  console.log(fail === 0 ? '\nAI FALLBACK ALIGNMENT: ALL PASS' : '\nAI FALLBACK: some diffs (see above)');
})();
