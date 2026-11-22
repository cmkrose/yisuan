import { aiEngine } from '../src/lib/engines/ai-consultant/engine';
import { calculateBazi } from '../src/lib/engines/bazi/calculate';

const chart = calculateBazi({ gender: 'male', birthYear: 1990, birthMonth: 5, birthDay: 15, birthHour: 10 });
const ask = (q: string) => aiEngine.analyzeLocal({ question: q, categories: ['bazi'], baziData: chart } as any);

const quick = [
  ['我最近的事业运势如何？', ['事业']],
  ['今年的财运怎么样？', ['财']],
  ['婚姻感情什么时候有转机？', ['感情']],
  ['帮我做一次综合命理分析', ['综合', '日主']],
  ['最近适合投资吗？', ['投资', '财']],
  ['身体健康方面有什么要注意？', ['健康', '作息']],
] as [string, string[]][];

let fail = 0;
const check = (label: string, cond: boolean, extra = '') => { if (!cond) fail++; console.log(`  ${label}: ${cond ? 'PASS' : 'FAIL'}${extra ? ' ' + extra : ''}`); };
const seen = new Set<string>();
for (const [q, keys] of quick) {
  const r = ask(q);
  const text = r.overview || '';
  const ok = keys.some((k) => text.includes(k)) && text.includes('日主') && !text.includes('格局层次较高');
  check(q, ok, `len=${text.length}`);
  seen.add(text);
}
check('快捷问题答案互不相同', seen.size === quick.length, `${seen.size}/${quick.length}`);

const unknown = ask('我家的猫应该叫什么名字？').overview || '';
check('未知问题明示超范围', unknown.startsWith('这个问题超出模板解读范围'), unknown.slice(0, 30));
check('未知问题仍给最接近解读', unknown.includes('日主'));

const invest = ask('最近适合投资吗？').overview || '';
check('投资题含流年/大运依据', invest.includes('流年') && (invest.includes('大运') || invest.includes('当前大运')));
console.log('\n投资题示例：\n' + invest);

console.log(fail === 0 ? '\nAI ROUTING: ALL PASS' : `\nAI ROUTING: FAIL(${fail})`);
