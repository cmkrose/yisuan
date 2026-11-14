import { Solar } from 'lunar-javascript';
import { timeDivination, numberDivination } from '../src/lib/engines/divination/meihua/engine';
import { numberDivination as backNumber, timeDivination as backTime } from '../../backend/src/modules/divination/meihua/engine';
import { xiaoLiuRenDivine } from '../src/lib/engines/divination/xiaoliuren/engine';
import { xiaoLiuRenDivine as backXlr } from '../../backend/src/modules/divination/xiaoliuren/engine';

let fail = 0;
const BAGUA = ['乾','兑','离','震','巽','坎','艮','坤'];
const check = (label: string, got: any, exp: any) => {
  const ok = got === exp;
  if (!ok) fail++;
  console.log(`  ${label}: ${got} 期望=${exp} ${ok ? 'PASS' : 'FAIL'}`);
};

console.log('== 梅花体用（动爻在下卦→用，上卦→体）==');
const m1 = numberDivination([1, 2, 1]); // 动爻1（下卦）→ 体=上卦乾，用=下卦兑
check('动爻1 体', m1.bodyGua, '乾');
check('动爻1 用', m1.yongGua, '兑');
const m2 = numberDivination([1, 2, 4]); // 动爻4（上卦）→ 体=下卦兑，用=上卦乾
check('动爻4 体', m2.bodyGua, '兑');
check('动爻4 用', m2.yongGua, '乾');

console.log('== 梅花五行关系：土对木=受克 ==');
const m3 = numberDivination([7, 4, 1]); // 上艮土(体) 下震木(用) 动爻1 → 木克土
check('体土用木', m3.bodyYongRelation, '受克');

console.log('== 梅花时间起卦（农历 + 年支/时支）==');
const date = new Date(2026, 10, 13, 10, 0, 0);
const lunar = Solar.fromDate(date).getLunar();
const yz = '子丑寅卯辰巳午未申酉戌亥'.indexOf(lunar.getYearInGanZhi()[1]) + 1;
const lm = Math.abs(lunar.getMonth());
const ld = lunar.getDay();
const hz = (Math.floor((date.getHours() + 1) / 2) % 12) + 1;
const upperNum = (yz + lm + ld) % 8 || 8;
const total = yz + lm + ld + hz;
const lowerNum = total % 8 || 8;
const moving = total % 6 || 6;
const mt = timeDivination(date);
console.log(`  农历 ${lunar.getYearInGanZhi()}年${lm}月${ld}日 ${date.getHours()}时 → 年支序${yz} 时支序${hz} 上${upperNum} 下${lowerNum} 动${moving}`);
check('时间起卦 上卦', mt.upperGua.name, BAGUA[(upperNum - 1) % 8]);
check('时间起卦 下卦', mt.lowerGua.name, BAGUA[(lowerNum - 1) % 8]);
check('时间起卦 动爻', mt.movingYao, moving);
const bt = backTime(date);
check('时间起卦 前后端一致', `${bt.upperGua.name}${bt.lowerGua.name}${bt.movingYao}`, `${mt.upperGua.name}${mt.lowerGua.name}${mt.movingYao}`);
const bn = backNumber([7, 4, 1]);
check('数字起卦 前后端一致', bn.bodyYongRelation, m3.bodyYongRelation);

console.log('== 小六壬：农历月日 + 子时 23-1 标准时支 ==');
check('1月1日 23时 子→大安', xiaoLiuRenDivine(1, 1, 23).name, '大安');
check('1月1日 0时 子→大安', xiaoLiuRenDivine(1, 1, 0).name, '大安');
check('1月1日 1时 丑→留连', xiaoLiuRenDivine(1, 1, 1).name, '留连');
check('1月1日 3时 寅→速喜', xiaoLiuRenDivine(1, 1, 3).name, '速喜');
const lian = xiaoLiuRenDivine(1, 1, 1);
check('留连方位', lian.direction, '北方');
const xiaoji = xiaoLiuRenDivine(1, 1, 7);
check('小吉方位', xiaoji.direction, '北方');
check('小吉属水', xiaoji.meaning.includes('五行属水'), true);
const kong = xiaoLiuRenDivine(1, 1, 9);
check('空亡方位', kong.direction, '中央');
check('空亡属土', kong.meaning.includes('五行属土'), true);
check('小六壬前后端一致', backXlr(1, 1, 7).direction, xiaoji.direction);

console.log(fail === 0 ? 'DIVINATION2: ALL PASS' : `DIVINATION2: FAIL(${fail})`);
