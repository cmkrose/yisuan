import { getNayin } from '../src/lib/engines/bazi/constants';

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const EXPECT30 = [
  '海中金', '炉中火', '大林木', '路旁土', '剑锋金', '山头火',
  '涧下水', '城头土', '白蜡金', '杨柳木', '泉中水', '屋上土',
  '霹雳火', '松柏木', '长流水', '沙中金', '山下火', '平地木',
  '壁上土', '金箔金', '覆灯火', '天河水', '大驿土', '钗钏金',
  '桑柘木', '大溪水', '沙中土', '天上火', '石榴木', '大海水',
];

let bad = 0;
for (let i = 0; i < 60; i++) {
  const s = i % 10, b = i % 12;
  const got = getNayin(s, b);
  const exp = EXPECT30[Math.floor(i / 2)];
  if (got !== exp) { bad++; console.log(`MISMATCH #${i} ${STEMS[s]}${BRANCHES[b]} got=${got} exp=${exp}`); }
}
console.log(`全量60甲子：${60 - bad}/60 正确，${bad} 不符`);

const points: [string, string, string][] = [
  ['甲', '子', '海中金'], ['乙', '丑', '海中金'], ['丙', '寅', '炉中火'],
  ['庚', '午', '路旁土'], ['辛', '巳', '白蜡金'], ['辛', '亥', '钗钏金'],
  ['癸', '巳', '长流水'], ['甲', '寅', '大溪水'], ['壬', '申', '剑锋金'], ['癸', '酉', '剑锋金'],
];
let pbad = 0;
for (const [st, br, exp] of points) {
  const got = getNayin(STEMS.indexOf(st), BRANCHES.indexOf(br));
  const ok = got === exp;
  if (!ok) pbad++;
  console.log(`${st}${br}: ${got} ${ok ? 'OK' : 'FAIL(exp ' + exp + ')'}`);
}
console.log(pbad === 0 && bad === 0 ? '\nNAYIN: ALL PASS' : `\nNAYIN: FAIL (jiazi bad=${bad}, point bad=${pbad})`);
process.exit(bad === 0 && pbad === 0 ? 0 : 1);
