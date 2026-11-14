import { getDayInfo } from '../src/lib/engines/zeri/engine';
import { getDayInfo as backDayInfo } from '../../backend/src/modules/zeri/core/engine';

type Case = { y: number; m: number; d: number; yi: string[]; ji: string[]; zu: [string, string]; ts: [string, string] };
const cases: Case[] = [
  {
    y: 2026, m: 11, d: 13,
    yi: ['嫁娶','祭祀','祈福','求嗣','开光','出火','出行','拆卸','开市','交易','立券','挂匾','伐木','入宅','移徙','安床','安葬'],
    ji: ['栽种','掘井','置产'],
    zu: ['辛不合酱主人不尝', '卯不穿井水泉不香'],
    ts: ['玄武', '黑道'],
  },
  {
    y: 2026, m: 11, d: 14,
    yi: ['祭祀','理发','针灸','解除','进人口','整手足甲'],
    ji: ['嫁娶','动土','造船','开池','掘井','出行','修造','入宅','上梁','移徙','安葬','破土','作灶','开市'],
    zu: ['壬不泱水更难提防', '辰不哭泣必主重丧'],
    ts: ['司命', '黄道'],
  },
  {
    y: 2027, m: 1, d: 1,
    yi: ['嫁娶','冠笄','祭祀','祈福','求嗣','雕刻','开光','安香','出行','入学','修造','动土','竖柱','上梁','盖屋','起基','安门','出火','移徙','入宅','掘井','造畜稠','安葬','破土','除服','成服'],
    ji: ['开市','纳采','订盟','作灶','造庙','造船','经络'],
    zu: ['庚不经络织机虚张', '辰不哭泣必主重丧'],
    ts: ['天牢', '黑道'],
  },
];

let fail = 0;
const eq = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);
const hasAll = (a: string[], b: string[]) => b.every((x) => a.includes(x));

console.log('== 三天基准日逐项对照 ==');
for (const c of cases) {
  const r = getDayInfo(c.y, c.m, c.d);
  const inter = r.yi.filter((x) => r.ji.includes(x));
  const yiOk = eq(r.yi, c.yi);
  const jiOk = eq(r.ji, c.ji);
  const zuOk = r.pengzuGan === c.zu[0] && r.pengzuZhi === c.zu[1];
  const tsOk = r.tianShen === c.ts[0] && r.tianShenType === c.ts[1];
  const disjoint = inter.length === 0;
  const back = backDayInfo(c.y, c.m, c.d);
  const beOk = eq(back.yi, r.yi) && eq(back.ji, r.ji);
  if (!(yiOk && jiOk && zuOk && tsOk && disjoint && beOk)) fail++;
  console.log(`${c.y}-${c.m}-${c.d} 日干支=${r.dayStem}${r.dayBranch} 建除=${r.jianchu}`);
  console.log(`  宜(${r.yi.length}) ${yiOk ? 'PASS' : 'FAIL'} | 忌(${r.ji.length}) ${jiOk ? 'PASS' : 'FAIL'} | 宜∩忌=∅ ${disjoint ? 'PASS' : 'FAIL'}`);
  console.log(`  彭祖 ${r.pengzuGan} / ${r.pengzuZhi} ${zuOk ? 'PASS' : 'FAIL'}`);
  console.log(`  天神 ${r.tianShen}(${r.tianShenType}) ${tsOk ? 'PASS' : 'FAIL'} | 前后端一致 ${beOk ? 'PASS' : 'FAIL'}`);
}

console.log('== 随机 10 天：宜条数分布 ==');
let seed = 20261114;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
let ge6 = 0;
const dist: number[] = [];
for (let i = 0; i < 10; i++) {
  const y = 2025 + Math.floor(rnd() * 3);
  const m = 1 + Math.floor(rnd() * 12);
  const d = 1 + Math.floor(rnd() * 28);
  const r = getDayInfo(y, m, d);
  dist.push(r.yi.length);
  if (r.yi.length >= 6) ge6++;
  console.log(`  ${y}-${m}-${d} 宜${r.yi.length} 忌${r.ji.length} 宜∩忌=${r.yi.filter((x) => r.ji.includes(x)).length}`);
}
console.log(`宜条数=${dist.join(',')} | ≥6 的天数=${ge6}/10 ${ge6 >= 6 ? 'PASS' : 'FAIL'}`);

console.log(fail === 0 ? 'ZERI LUNAR: ALL PASS' : `ZERI LUNAR: FAIL(${fail})`);
