import { lunarToSolar, solarToLunar } from '../src/lib/utils/lunar';
import { calculateBazi } from '../src/lib/engines/bazi/calculate';

const conv = lunarToSolar(2024, 1, 1, false);
console.log('农历2024正月初一 -> 公历', conv);

const direct = calculateBazi({ gender: 'male', birthYear: 2024, birthMonth: 2, birthDay: 10, birthHour: 10 });
const viaLunar = calculateBazi({ gender: 'male', birthYear: conv.year, birthMonth: conv.month, birthDay: conv.day, birthHour: 10 });
const same = JSON.stringify(direct) === JSON.stringify(viaLunar);
console.log('公历直接 2024-02-10 与 农历换算后 排盘一致:', same ? 'PASS' : 'FAIL');

const leap = lunarToSolar(2025, 6, 1, true);
const normal = lunarToSolar(2025, 6, 1, false);
console.log('2025 六月非闰 ->', normal, ' | 2025 闰六月 ->', leap);
console.log('闰月不串月(闰六月应在公历7月):', leap.month === 7 ? 'PASS' : 'FAIL(' + leap.month + ')');

const back = solarToLunar(2024, 2, 10);
console.log('公历2024-02-10 -> 农历', back, back.month === 1 && back.day === 1 && !back.isLeap ? 'PASS' : 'FAIL');
