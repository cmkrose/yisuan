import fs from 'fs';
import { calculateLiuren } from '../src/lib/engines/sanshi/liuren/engine';

const GEN: Record<string, string> = { 貴:'贵人', 蛇:'螣蛇', 雀:'朱雀', 合:'六合', 勾:'勾陈', 龍:'青龙', 空:'天空', 虎:'白虎', 常:'太常', 玄:'玄武', 陰:'太阴', 后:'天后' };
const QIN: Record<string, string> = { 父:'父母', 兄:'兄弟', 財:'妻财', 官:'官鬼', 子:'子孙' };
const PAT: Record<string, string> = { '賊尅':'贼克', '元首':'元首', '重審':'重审', '知一':'知一', '涉害':'涉害', '遙尅':'遥克', '遙克':'遥克', '昴星':'昴星', '別責':'别责', '八專':'八专', '伏吟':'伏吟', '返吟':'返吟' };

const data = JSON.parse(fs.readFileSync(__dirname + '/kinliuren-20.json', 'utf8'));
let pass = 0;
for (const c of data) {
  if (!c.kin) { console.log(`#${c.idx} KIN-ERROR`, c.kin_error); continue; }
  const r = calculateLiuren(c.y, c.m, c.d, c.h);
  const kin = c.kin;
  const diffs: string[] = [];
  const hourBranch = r.input.hourBranch;
  const kinMG = kin['地轉天盤'][hourBranch];
  if (r.monthGeneral.branch !== kinMG) diffs.push(`月将 ${r.monthGeneral.branch}≠${kinMG}`);
  const kinLessons = [kin['四課']['一課'], kin['四課']['二課'], kin['四課']['三課'], kin['四課']['四課']];
  for (let i = 0; i < 4; i++) {
    const ku = kinLessons[i][0][0];
    const kl = kinLessons[i][0].slice(1);
    const ou = r.lessons[i].upper;
    const ol = i === 0 ? r.dayStem : r.lessons[i].lower;
    if (ou !== ku || ol !== kl) diffs.push(`课${i + 1} ${ol}${ou}≠${kl}${ku}`);
  }
  const seq = ['初傳', '中傳', '末傳'];
  for (let i = 0; i < 3; i++) {
    const kt = kin['三傳'][seq[i]];
    const ot = r.chuan[i];
    const kg = GEN[kt[1]] || kt[1];
    const kq = QIN[kt[2]] || kt[2];
    if (ot.branch !== kt[0] || ot.general !== kg || ot.liuqin !== kq) diffs.push(`${seq[i]} ${ot.branch}${ot.liuqin}/${ot.general}≠${kt[0]}${kq}/${kg}`);
  }
  const kinGen = kin['地轉天將'];
  for (const [earth, abbr] of Object.entries(kinGen)) {
    const og = r.plate.find((p) => p.earth === earth)?.general;
    const kg = GEN[abbr as string] || abbr;
    if (og !== kg) { diffs.push(`将@${earth} ${og}≠${kg}`); break; }
  }
  const km = kin['格局'][0];
  const ks = kin['格局'][1] || '';
  let kinPat: string;
  if (km === '賊尅') kinPat = ks.startsWith('重審') ? '重审' : ks.startsWith('元首') ? '元首' : ks;
  else if (km === '比用') kinPat = '比用';
  else kinPat = PAT[km] || km;
  const ourPat = r.pattern.replace('课', '');
  if (ourPat !== kinPat) diffs.push(`课体 ${ourPat}≠${kinPat}(${kin['格局'].join('/')})`);
  const kinGuiEarth = Object.entries(kinGen).find(([, g]) => g === '貴')?.[0];
  if (r.generalStart.sitsOn !== kinGuiEarth) diffs.push(`贵人地 ${r.generalStart.sitsOn}≠${kinGuiEarth}`);
  if (diffs.length === 0) { pass++; console.log(`#${c.idx} PASS ${c.y}-${c.m}-${c.d} ${c.h}h`); }
  else console.log(`#${c.idx} FAIL ${c.y}-${c.m}-${c.d} ${c.h}h :: ${diffs.slice(0, 6).join(' | ')}`);
}
console.log(`\nPASS ${pass}/${data.length}`);
