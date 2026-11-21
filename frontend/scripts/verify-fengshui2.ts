import { calculateEightMansion, calculateHouseMansion, getSittingGua, calculateFlyingStars } from '../src/lib/engines/fengshui/engine';
import { STAR_NAMES } from '../src/lib/constants/fengshui';
import { BAZHAI_STARS, FEIXING_STARS, YANGZHAI_HOUSES, YINZHAI_TOPICS } from '../src/lib/data/meanings/fengshui-meanings';

let fail = 0;
const check = (label: string, cond: boolean, extra = '') => { if (!cond) fail++; console.log(`  ${label}: ${cond ? 'PASS' : 'FAIL'}${extra ? ' ' + extra : ''}`); };

console.log('== 坐向对宫 → 宅卦 ==');
check('子山（向子）→ 离宅', getSittingGua('子') === '离', getSittingGua('子'));
check('午山（向午）→ 坎宅', getSittingGua('午') === '坎', getSittingGua('午'));
check('巽山（向巽）→ 乾宅', getSittingGua('巽') === '乾', getSittingGua('巽'));
check('卯山（向卯）→ 兑宅', getSittingGua('卯') === '兑', getSittingGua('卯'));

console.log('== 宅卦八方与命卦同口径 ==');
const house = calculateHouseMansion('坎');
const person = calculateEightMansion(1980, 'male');
const sig = (r: any) => [...r.favorableDirections, ...r.unfavorableDirections].map((d: any) => `${d.direction}:${d.rating}`).join('|');
check('坎宅 vs 1980男坎命', sig(house) === sig(person));
check('坎宅 8 方', house.favorableDirections.length + house.unfavorableDirections.length === 8);

console.log('== 数据覆盖 ==');
check('八宅游星 8', Object.keys(BAZHAI_STARS).length === 8, String(Object.keys(BAZHAI_STARS).length));
check('飞星 9', Object.keys(FEIXING_STARS).length === 9, String(Object.keys(FEIXING_STARS).length));
check('宅型 8', Object.keys(YANGZHAI_HOUSES).length === 8);
check('阴宅 7', Object.keys(YINZHAI_TOPICS).length === 7);
const allRatings = new Set([...house.favorableDirections, ...house.unfavorableDirections].map((d: any) => String(d.rating).replace(/\(.*\)$/, '')));
check('八宅 rating 均可命中', [...allRatings].every((k) => !!BAZHAI_STARS[k]), [...allRatings].join(','));
const starKeys = Object.entries(STAR_NAMES).map(([, v]: any) => v.name.slice(0, 2));
check('九星名均可命中', starKeys.every((k) => !!FEIXING_STARS[k]), starKeys.join(','));
const fs2024 = calculateFlyingStars(2024);
check('2024 中宫3/坎8/乾4', fs2024.grid.find((g: any) => g.palace === 5)?.star === 3 && fs2024.grid.find((g: any) => g.palace === 1)?.star === 8 && fs2024.grid.find((g: any) => g.palace === 6)?.star === 4);
check('乾宅数据存在', !!YANGZHAI_HOUSES['乾']);
check('坎宅数据存在', !!YANGZHAI_HOUSES['坎']);

console.log(fail === 0 ? 'FENGSHUI2: ALL PASS' : `FENGSHUI2: FAIL(${fail})`);
