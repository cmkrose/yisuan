import { diff, fetchJson } from './diff';
import { divLiuyao, divMeihuaTime, divMeihuaNumber, divMeihuaName, divXiaoLiuRen, divXiaoLiuRenRandom } from '../src/lib/engines/divination/calculate';

const BASE = 'https://yisuan.onrender.com';

function shape(x: any): any {
  if (Array.isArray(x)) return { __array: x.length ? shape(x[0]) : 'empty' };
  if (x && typeof x === 'object') {
    const o: any = {};
    for (const k of Object.keys(x).sort()) o[k] = shape(x[k]);
    return o;
  }
  return typeof x;
}

(async () => {
  let pass = 0; let fail = 0;

  async function exact(label: string, local: () => any, api: string, body: any) {
    const l = local();
    const r = await fetchJson(BASE + api, body);
    const out: string[] = []; diff(l, r, '$', out);
    if (out.length === 0) { console.log(`${label} [exact] -> PASS`); pass++; }
    else { console.log(`${label} [exact] -> FAIL (${out.length})`); out.slice(0, 8).forEach((d) => console.log('   ' + d)); fail++; }
  }

  async function structural(label: string, local: () => any, api: string, body: any) {
    const l = local();
    const r = await fetchJson(BASE + api, body);
    const out: string[] = []; diff(shape(l), shape(r), '$', out);
    if (out.length === 0) { console.log(`${label} [structural] -> PASS`); pass++; }
    else { console.log(`${label} [structural] -> FAIL (${out.length})`); out.slice(0, 8).forEach((d) => console.log('   ' + d)); fail++; }
  }

  await exact('meihua/number', () => divMeihuaNumber([1, 2, 3]), '/api/divination/meihua/number', { numbers: [1, 2, 3] });
  await exact('meihua/name', () => divMeihuaName('易'), '/api/divination/meihua/name', { name: '易' });
  await exact('xiaoliuren/time(fixed)', () => divXiaoLiuRen(1, 1, 8), '/api/divination/xiaoliuren', { month: 1, day: 1, hour: 8 });

  await structural('liuyao(random)', () => divLiuyao(), '/api/divination/liuyao', {});
  await structural('meihua/time(now)', () => divMeihuaTime(), '/api/divination/meihua/time', {});
  await structural('xiaoliuren/random', () => divXiaoLiuRenRandom(), '/api/divination/xiaoliuren/random', {});

  console.log(`\nDIVINATION: ${pass} pass, ${fail} fail`);
  process.exit(fail === 0 ? 0 : 1);
})();
