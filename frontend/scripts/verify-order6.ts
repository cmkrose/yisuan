import { calculateShanXiang } from '../src/lib/engines/fengshui/engine';
import { calculateBazi } from '../src/lib/engines/bazi/calculate';
import { numberDivination } from '../src/lib/engines/divination/meihua/engine';
import { XIAOLIUREN_POSITIONS } from '../src/lib/engines/divination/xiaoliuren/engine';
import { calculateLiuren } from '../src/lib/engines/sanshi/liuren/engine';

let fail = 0;
const check = (label: string, cond: boolean, extra = '') => { if (!cond) fail++; console.log(`  ${label}: ${cond ? 'PASS' : 'FAIL'}${extra ? ' ' + extra : ''}`); };

console.log('== P0-补 九运 子山午向 ==');
const sx = calculateShanXiang('子', '午', 9);
check('山星入中=5', sx.shanCenter === 5, String(sx.shanCenter));
check('向星入中=4', sx.xiangCenter === 4, String(sx.xiangCenter));
check('子山逆飞', sx.shanForward === false);
check('午向逆飞', sx.xiangForward === false);
check('坎宫山星=9', sx.shanByPalace[1] === 9, String(sx.shanByPalace[1]));
check('离宫山星=1', sx.shanByPalace[9] === 1, String(sx.shanByPalace[9]));
check('坎宫向星=8', sx.xiangByPalace[1] === 8, String(sx.xiangByPalace[1]));
check('离宫向星=9', sx.xiangByPalace[9] === 9, String(sx.xiangByPalace[9]));
console.log('  山盘:', Object.entries(sx.shanByPalace).map(([p, s]) => `${p}:${s}`).join(' '));
console.log('  向盘:', Object.entries(sx.xiangByPalace).map(([p, s]) => `${p}:${s}`).join(' '));

console.log('== P1 大运/流年十神 ==');
const chart = calculateBazi({ gender: 'male', birthYear: 1990, birthMonth: 5, birthDay: 15, birthHour: 10 });
const d0 = chart.analysis.dayun[0][0];
check('大运首步有十神', typeof d0.shishen === 'string' && d0.shishen.length > 0, `${d0.stem}${d0.branch} ${d0.shishen}`);
const ln = chart.analysis.liunian[0];
check('流年有十神', typeof ln.shishen === 'string' && ln.shishen.length > 0, `${ln.year} ${ln.stem}${ln.branch} ${ln.shishen}`);

console.log('== P2 梅花互卦/变卦 ==');
const mh = numberDivination([1, 2, 1]);
check('互卦存在', !!mh.mutualHexagram?.name, mh.mutualHexagram?.name || '');
check('变卦存在', !!mh.changedHexagram?.name, mh.changedHexagram?.name || '');
check('互卦与原卦不同', mh.mutualHexagram?.name !== mh.hexagramName);

console.log('== P2 小六壬六宫 ==');
check('六宫数据 6 条', XIAOLIUREN_POSITIONS.length === 6, String(XIAOLIUREN_POSITIONS.length));
check('六宫均有 meaning/suggestion', XIAOLIUREN_POSITIONS.every((p) => p.meaning && p.suggestion));

console.log('== P2 六壬四课关系 ==');
const lr = calculateLiuren(2026, 11, 16, 10);
check('四课均有关系字段', lr.lessons.every((l) => ['上克下', '下贼上', '无克'].includes(l.relation || '')), lr.lessons.map((l) => `${l.label}:${l.relation}`).join(' '));

console.log(fail === 0 ? 'ORDER6: ALL PASS' : `ORDER6: FAIL(${fail})`);
