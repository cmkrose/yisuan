import { calculateYunFlyingStars, calculateFlyingStars, calculateHouseMansion, getSittingGua } from '../src/lib/engines/fengshui/engine';
import { BAZHAI_STARS, FEIXING_STARS, FEIXING_COMBOS, FEIXING_COMBO_LEVEL, YANGZHAI_HOUSES, YINZHAI_TOPICS } from '../src/lib/data/meanings/fengshui-meanings';

let fail = 0;
const check = (label: string, cond: boolean, extra = '') => { if (!cond) fail++; console.log(`  ${label}: ${cond ? 'PASS' : 'FAIL'}${extra ? ' ' + extra : ''}`); };
const centerOf = (r: any) => r.grid.find((g: any) => g.palace === 5)?.star;

console.log('== 运盘 ==');
check('八运中宫=8', centerOf(calculateYunFlyingStars(8)) === 8);
check('九运中宫=9', centerOf(calculateYunFlyingStars(9)) === 9);
check('2024 年盘中宫=3（不回归）', centerOf(calculateFlyingStars(2024)) === 3);
const yunOf = (y: number) => ((Math.floor((y - 1864) / 20) % 9) + 9) % 9 + 1;
check('元运 1864=1', yunOf(1864) === 1);
check('元运 2004=8', yunOf(2004) === 8);
check('元运 2024=9', yunOf(2024) === 9);
check('元运 2044=1', yunOf(2044) === 1);

console.log('== 数据覆盖 ==');
check('八宅游星 8', Object.keys(BAZHAI_STARS).length === 8);
check('飞星九星 9', Object.keys(FEIXING_STARS).length === 9);
check('双星组合 20', Object.keys(FEIXING_COMBOS).length === 20);
check('双星分级 20', Object.keys(FEIXING_COMBO_LEVEL).length === 20);
check('组合均有分级', Object.keys(FEIXING_COMBOS).every((k) => !!FEIXING_COMBO_LEVEL[k]));
check('宅型 8', Object.keys(YANGZHAI_HOUSES).length === 8);
check('阴宅 7', Object.keys(YINZHAI_TOPICS).length === 7);

console.log('== 坐卦/八方/三要可用 ==');
for (const gua of ['坎','坤','震','巽','乾','兑','艮','离']) {
  const h = calculateHouseMansion(gua);
  const all = [...h.favorableDirections, ...h.unfavorableDirections];
  check(`${gua}宅八方齐全`, all.length === 8 && all.every((d: any) => !!BAZHAI_STARS[String(d.rating).replace(/\(.*\)$/, '')]));
}
check('向子→离宅', getSittingGua('子') === '离');
check('向午→坎宅', getSittingGua('午') === '坎');
check('向巽→乾宅', getSittingGua('巽') === '乾');

console.log(fail === 0 ? 'FENGSHUI3: ALL PASS' : `FENGSHUI3: FAIL(${fail})`);
