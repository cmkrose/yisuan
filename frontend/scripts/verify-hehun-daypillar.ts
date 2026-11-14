import { calculateHehun } from '../src/lib/engines/hehun';

const a = { gender: 'male' as const, birthYear: 1990, birthMonth: 5, birthDay: 15, birthHour: 10 };
const b = { gender: 'female' as const, birthYear: 2026, birthMonth: 11, birthDay: 13, birthHour: 10 };
const r = calculateHehun(a, b);
console.log('甲方四柱:', r.a.pillars, '| 日主:', r.a.dayMaster);
console.log('乙方四柱:', r.b.pillars, '| 日主:', r.b.dayMaster);
console.log('夫妻宫维度:', r.dimensions.find(d => d.key === 'spouse')?.detail);
const okA = r.a.pillars.includes('庚辰');
const okB = r.b.pillars.includes('辛卯');
const okMaster = r.a.dayMaster === '庚' && r.b.dayMaster === '辛';
console.log(`合婚日支随修正日柱：甲含庚辰=${okA} 乙含辛卯=${okB} 日主=${r.a.dayMaster}/${r.b.dayMaster} ${okA && okB && okMaster ? 'PASS' : 'FAIL'}`);
