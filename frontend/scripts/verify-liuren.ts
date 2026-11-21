import { calculateLiuren } from '../src/lib/engines/sanshi/liuren/engine';
import { calculateLiuren as backLiuren } from '../../backend/src/modules/sanshi/liuren/engine';

let fail = 0;
const check = (label: string, cond: boolean, extra = '') => {
  if (!cond) fail++;
  console.log(`  ${label}: ${cond ? 'PASS' : 'FAIL'}${extra ? ' ' + extra : ''}`);
};
const DIZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

function dump(label: string, y: number, m: number, d: number, h: number) {
  const r = calculateLiuren(y, m, d, h);
  console.log(`\n===== ${label} =====`);
  console.log(`输入 ${y}-${m}-${d} ${h}时 | 日干支 ${r.dayGanZhi} | 月将 ${r.monthGeneral.name}(${r.monthGeneral.branch}) 乘 ${r.monthGeneral.sitsOn} | 贵人 ${r.generalStart.gui}(${r.generalStart.dayNight}) ${r.generalStart.forward ? '顺' : '逆'}布 | 旬空 ${r.xunKong.xun} ${r.xunKong.branches.join('')}`);
  console.log(`四课: ${r.lessons.map((l) => `${l.label} ${l.lower}→${l.upper}`).join(' | ')}`);
  console.log(`三传: ${r.chuan.map((c) => `${c.sequence}${c.branch}(${c.liuqin}·${c.general})`).join(' → ')}`);
  console.log(`课体: ${r.pattern} / ${r.method}`);
  console.log(`天地盘: ${r.plate.map((p) => `${p.earth}→${p.heaven}(${p.general})`).join(' ')}`);
  return r;
}

const r1 = dump('例1 2026-11-16 10时', 2026, 11, 16, 10);
const r2 = dump('例2 1990-05-15 10时', 1990, 5, 15, 10);

console.log('\n== 结构不变量 ==');
for (const r of [r1, r2]) {
  check('三传三条', r.chuan.length === 3);
  check('天将十二种齐全', new Set(r.plate.map((p) => p.general)).size === 12);
  check('四课四点', r.lessons.length === 4 && r.lessons.every((l) => l.upper && l.lower));
  check('六亲合法', r.chuan.every((c) => ['父母','兄弟','妻孙','子孙','妻财','官鬼'].includes(c.liuqin)));
  check('旬空两支', r.xunKong.branches.length === 2);
}

const fu = calculateLiuren(2026, 11, 16, 5);
check('伏吟：天地盘重叠', fu.plate.every((p) => p.earth === p.heaven), `(${fu.pattern})`);
const fan = calculateLiuren(2026, 11, 16, 17);
check('返吟：天地盘对冲', fan.plate.every((p) => DIZHI.indexOf(p.heaven) === (DIZHI.indexOf(p.earth) + 6) % 12), `(${fan.pattern})`);

console.log('\n== 前后端一致 ==');
for (const [y, m, d, h] of [[2026, 11, 16, 10], [1990, 5, 15, 10], [2026, 11, 16, 5], [2026, 11, 16, 17]]) {
  const a = calculateLiuren(y, m, d, h);
  const b = backLiuren(y, m, d, h);
  const ok = JSON.stringify(a) === JSON.stringify(b);
  check(`${y}-${m}-${d} ${h}时`, ok);
}

console.log(fail === 0 ? '\nLIUREN: ALL PASS' : `\nLIUREN: FAIL(${fail})`);
