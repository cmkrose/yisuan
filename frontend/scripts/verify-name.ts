import { getKangxiStroke, getHanziWuxing } from '../src/lib/engines/name-analysis/stroke-data';
import { analyzeName, strokeAuspicious } from '../src/lib/engines/name-analysis/analyzer';
import { getKangxiStroke as backStroke } from '../../backend/src/modules/name-analysis/core/stroke-data';

let fail = 0;
const check = (label: string, got: any, exp: any) => {
  const ok = got === exp;
  if (!ok) fail++;
  console.log(`  ${label}: ${got} 期望=${exp} ${ok ? 'PASS' : 'FAIL'}`);
};

console.log('== 四字康熙笔画 ==');
check('伟', getKangxiStroke('伟'), 11);
check('娜', getKangxiStroke('娜'), 10);
check('敏', getKangxiStroke('敏'), 11);
check('静', getKangxiStroke('静'), 16);
check('前后端 伟', backStroke('伟'), 11);

console.log('== 未收录字返回 null 并标注 ==');
check('龘 笔画', getKangxiStroke('龘'), null);
const r = analyzeName({ surname: '李', givenName: '龘', gender: 'male' });
check('未收录清单含龘', r.unrecorded.includes('龘'), true);
const kx = r.analysis.kangxiStrokes.find((k: any) => k.char === '龘');
check('康熙条目 unrecorded', kx?.unrecorded, true);

console.log('== 五行个位数口径 ==');
check('11画', getHanziWuxing(11), '木');
check('16画', getHanziWuxing(16), '土');
check('10画', getHanziWuxing(10), '水');
check('24画', getHanziWuxing(24), '火');
check('8画', getHanziWuxing(8), '金');

console.log('== 81 数理：57/61 吉、缺失已补齐（1..81 无“未收录数理”）==');
check('57 吉', strokeAuspicious(57).isAuspicious, true);
check('61 吉', strokeAuspicious(61).isAuspicious, true);
check('59 凶', strokeAuspicious(59).isAuspicious, false);
check('43 凶', strokeAuspicious(43).isAuspicious, false);
let missing = 0;
for (let n = 1; n <= 81; n++) {
  if (strokeAuspicious(n).meaning === '未收录数理') missing++;
}
check('未收录数理计数', missing, 0);

console.log('== 三才复算两例（个位数五行）==');
const r1 = analyzeName({ surname: '李', givenName: '伟', gender: 'male' });
console.log(`  李伟 三才=${r1.analysis.sancai.config} 天/人/地=${r1.analysis.wuge.tianGe.strokes}/${r1.analysis.wuge.renGe.strokes}/${r1.analysis.wuge.diGe.strokes}`);
check('天格五行', r1.analysis.sancai.heaven, getHanziWuxing(r1.analysis.wuge.tianGe.strokes));
check('人格五行', r1.analysis.sancai.person, getHanziWuxing(r1.analysis.wuge.renGe.strokes));
const r2 = analyzeName({ surname: '王', givenName: '静', gender: 'female' });
check('地格五行', r2.analysis.sancai.earth, getHanziWuxing(r2.analysis.wuge.diGe.strokes));

console.log(fail === 0 ? 'NAME: ALL PASS' : `NAME: FAIL(${fail})`);
