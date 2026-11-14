import { analyzeLiuyao } from '../src/lib/engines/divination/liuyao/engine';
import { analyzeLiuyao as backLiuyao } from '../../backend/src/modules/divination/liuyao/engine';

let fail = 0;
const linesOf = (r: any) => r.lines.map((l: any) => l.liuqin).join('、');

console.log('== 乾为天 六亲（自初爻向上） ==');
const qian = analyzeLiuyao('甲', [1,1,1,1,1,1]);
const qianOk = linesOf(qian) === '子孙、妻财、父母、官鬼、兄弟、父母';
if (!qianOk) fail++;
console.log(`  卦名=${qian.hexagramName} 宫=${qian.gong} 六亲=${linesOf(qian)} ${qianOk ? 'PASS' : 'FAIL'}`);

console.log('== 世爻四例（世序=0起） ==');
const cases: [string, number[], number, number][] = [
  ['乾为天', [1,1,1,1,1,1], 5, 6],
  ['坤为地', [0,0,0,0,0,0], 5, 6],
  ['水地比', [0,0,0,0,1,0], 2, 3],
  ['地风升', [0,1,1,0,0,0], 3, 4],
];
for (const [name, lines, shiXu, shiYao] of cases) {
  const r = analyzeLiuyao('甲', lines);
  const ok = r.hexagramName === name && (r.shiyao - 1) === shiXu && r.shiyao === shiYao;
  if (!ok) fail++;
  console.log(`  ${name}: 卦名=${r.hexagramName} 世序=${r.shiyao - 1} 世爻=第${r.shiyao}爻 应爻=第${r.yingyao}爻 ${ok ? 'PASS' : 'FAIL'}`);
}

console.log('== 六神起例（甲日，初爻青龙，向上顺排） ==');
const ls = analyzeLiuyao('甲', [1,1,1,1,1,1]).liushen.join('→');
const lsOk = ls === '青龙→朱雀→勾陈→螣蛇→白虎→玄武';
if (!lsOk) fail++;
console.log(`  ${ls} ${lsOk ? 'PASS' : 'FAIL'}`);
for (const gan of ['丙','戊','己','庚','壬']) {
  const arr = analyzeLiuyao(gan, [1,1,1,1,1,1]).liushen;
  console.log(`  ${gan}日 初爻=${arr[0]}`);
}

console.log('== 抽取乾宫八卦：宫/世/六亲（前后端一致） ==');
const qianGong: [string, number[]][] = [
  ['乾为天',[1,1,1,1,1,1]], ['天风姤',[0,1,1,1,1,1]], ['天山遁',[0,0,1,1,1,1]],
  ['天地否',[0,0,0,1,1,1]], ['风地观',[0,0,0,0,1,1]], ['山地剥',[0,0,0,0,0,1]],
  ['火地晋',[0,0,0,1,0,1]], ['火天大有',[1,1,1,1,0,1]],
];
for (const [name, lines] of qianGong) {
  const r = analyzeLiuyao('甲', lines);
  const b = backLiuyao('甲', lines);
  const ok = r.hexagramName === name && r.gong === '乾' && linesOf(r) === linesOf(b) && r.shiyao === b.shiyao;
  if (!ok) fail++;
  console.log(`  ${name} 世=第${r.shiyao}爻 六亲=${linesOf(r)} 前后端=${linesOf(r) === linesOf(b) ? '一致' : '不一致'} ${ok ? 'PASS' : 'FAIL'}`);
}

console.log(fail === 0 ? 'LIUYAO: ALL PASS' : `LIUYAO: FAIL(${fail})`);
