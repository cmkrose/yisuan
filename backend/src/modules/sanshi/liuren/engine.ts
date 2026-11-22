import { Solar } from 'lunar-javascript';

const DIZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const BRANCH_ELE: Record<string, string> = {
  子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水',
};
const STEM_ELE: Record<string, string> = {
  甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水',
};
const SHENG: Record<string, string> = { 木:'火', 火:'土', 土:'金', 金:'水', 水:'木' };
const KE: Record<string, string> = { 木:'土', 土:'水', 水:'火', 火:'金', 金:'木' };

// 日干寄宫（子=0）
const JIGONG: Record<string, number> = { 甲:2, 乙:4, 丙:5, 丁:7, 戊:5, 己:7, 庚:8, 辛:10, 壬:11, 癸:1 };
const HOUR_STEM_START: Record<string, number> = { 甲:0, 己:0, 乙:2, 庚:2, 丙:4, 辛:4, 丁:6, 壬:6, 戊:8, 癸:8 };
const STEM_HE: Record<string, string> = { 甲:'己', 己:'甲', 乙:'庚', 庚:'乙', 丙:'辛', 辛:'丙', 丁:'壬', 壬:'丁', 戊:'癸', 癸:'戊' };

// 与 kinliuren 一致：以当前节气名定月将（中气起，含其后之节）。
const TERM_TO_GENERAL: Record<string, { name: string; branch: string }> = {
  雨水: { name:'登明', branch:'亥' }, 惊蛰: { name:'登明', branch:'亥' },
  春分: { name:'河魁', branch:'戌' }, 清明: { name:'河魁', branch:'戌' },
  谷雨: { name:'从魁', branch:'酉' }, 立夏: { name:'从魁', branch:'酉' },
  小满: { name:'传送', branch:'申' }, 芒种: { name:'传送', branch:'申' },
  夏至: { name:'小吉', branch:'未' }, 小暑: { name:'小吉', branch:'未' },
  大暑: { name:'胜光', branch:'午' }, 立秋: { name:'胜光', branch:'午' },
  处暑: { name:'太乙', branch:'巳' }, 白露: { name:'太乙', branch:'巳' },
  秋分: { name:'天罡', branch:'辰' }, 寒露: { name:'天罡', branch:'辰' },
  霜降: { name:'太冲', branch:'卯' }, 立冬: { name:'太冲', branch:'卯' },
  小雪: { name:'功曹', branch:'寅' }, 大雪: { name:'功曹', branch:'寅' },
  冬至: { name:'大吉', branch:'丑' }, 小寒: { name:'大吉', branch:'丑' },
  大寒: { name:'神后', branch:'子' }, 立春: { name:'神后', branch:'子' },
};
const SANHE_GROUPS = [['申','子','辰'],['亥','卯','未'],['寅','午','戌'],['巳','酉','丑']];
const YIMA: Record<string, string> = {};
for (const g of SANHE_GROUPS) {
  const ma = g[0] === '申' ? '寅' : g[0] === '亥' ? '巳' : g[0] === '寅' ? '申' : '亥';
  for (const b of g) YIMA[b] = ma;
}
const MENG = ['寅','申','巳','亥'];
const ZHONG = ['子','午','卯','酉'];
const XING: Record<string, string> = {
  子:'卯', 卯:'子', 寅:'巳', 巳:'申', 申:'寅', 丑:'戌', 戌:'未', 未:'丑',
  辰:'辰', 午:'午', 酉:'酉', 亥:'亥',
};
const GENERALS = ['贵人','螣蛇','朱雀','六合','勾陈','青龙','天空','白虎','太常','玄武','太阴','天后'];
const GUI_RULE: Record<string, [string, string]> = {
  甲:['丑','未'], 戊:['丑','未'], 庚:['丑','未'],
  乙:['子','申'], 己:['子','申'],
  丙:['亥','酉'], 丁:['亥','酉'],
  辛:['午','寅'],
  壬:['巳','卯'], 癸:['巳','卯'],
};

const bi = (i: number) => DIZHI[((i % 12) + 12) % 12];
const idx = (b: string) => DIZHI.indexOf(b);
const keEl = (a: string, b: string) => KE[a] === b;

function liuqin(dayEl: string, yaoEl: string): string {
  if (dayEl === yaoEl) return '兄弟';
  if (SHENG[yaoEl] === dayEl) return '父母';
  if (SHENG[dayEl] === yaoEl) return '子孙';
  if (KE[yaoEl] === dayEl) return '官鬼';
  if (KE[dayEl] === yaoEl) return '妻财';
  return '兄弟';
}

function sanhePrev(b: string): string {
  for (const g of SANHE_GROUPS) {
    const i = g.indexOf(b);
    if (i >= 0) return g[(i + 2) % 3];
  }
  return b;
}

export interface LiurenLesson { label: string; lower: string; upper: string; }
export interface LiurenChuan { sequence: string; branch: string; general: string; liuqin: string; }
export interface LiurenPlateCell { earth: string; heaven: string; general: string; }

export interface LiurenResult {
  input: { year: number; month: number; day: number; hour: number; dayGanZhi: string; hourBranch: string };
  dayStem: string;
  dayBranch: string;
  dayGanZhi: string;
  xunKong: { xun: string; branches: string[] };
  monthGeneral: { name: string; branch: string; qi: string; sitsOn: string };
  dayLodge: string;
  plate: LiurenPlateCell[];
  lessons: LiurenLesson[];
  chuan: LiurenChuan[];
  pattern: string;
  method: string;
  generalStart: { gui: string; dayNight: string; forward: boolean; sitsOn: string };
  interpretation: string;
}

function getMonthGeneral(year: number, month: number, day: number, hour: number) {
  const lunar = Solar.fromYmdHms(year, month, day, hour, 0, 0).getLunar();
  const term = lunar.getPrevJieQi(false).getName();
  const g = TERM_TO_GENERAL[term] || TERM_TO_GENERAL['冬至'];
  return { name: g.name, branch: g.branch, qi: term };
}

export function calculateLiuren(year: number, month: number, day: number, hour: number): LiurenResult {
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const lunar = solar.getLunar();
  const dayGz = lunar.getDayInGanZhi();
  const dayStem = dayGz[0];
  const dayBranch = dayGz[1];
  const hIdx = Math.floor((hour + 1) / 2) % 12;
  const hourBranch = DIZHI[hIdx];
  const dayLodge = DIZHI[JIGONG[dayStem]];

  const mg = getMonthGeneral(year, month, day, hour);
  const mgIdx = idx(mg.branch);
  const tian = (di: number) => bi(mgIdx - hIdx + di);
  const inverseTian = (tb: string) => bi(idx(tb) + hIdx - mgIdx);
  const diOfTian = (tb: string) => ((idx(tb) + hIdx - mgIdx) % 12 + 12) % 12;

  const ganYang = tian(JIGONG[dayStem]);
  const ganYin = tian(idx(ganYang));
  const zhiYang = tian(idx(dayBranch));
  const zhiYin = tian(idx(zhiYang));
  const lessons: LiurenLesson[] = [
    { label: '一课', lower: dayLodge, upper: ganYang },
    { label: '二课', lower: ganYang, upper: ganYin },
    { label: '三课', lower: dayBranch, upper: zhiYang },
    { label: '四课', lower: zhiYang, upper: zhiYin },
  ];
  const distinct = new Set(lessons.map((l) => `${l.lower}-${l.upper}`)).size;
  const isYangStem = GAN.indexOf(dayStem) % 2 === 0;
  const isYangBranch = (b: string) => idx(b) % 2 === 0;
  const hourStem = GAN[(HOUR_STEM_START[dayStem] + hIdx) % 10];
  const hourEl = STEM_ELE[hourStem];
  const hourBranchEl = BRANCH_ELE[hourBranch];
  const dayEl = STEM_ELE[dayStem];
  const dayBranchEl = BRANCH_ELE[dayBranch];
  const hourStemYang = GAN.indexOf(hourStem) % 2 === 0;
  const hourBranchYang = hIdx % 2 === 0;
  const relationToDay = (upper: string) => {
    const u = BRANCH_ELE[upper];
    if (u === dayEl) return '比和';
    if (KE[u] === dayEl) return '克';
    if (KE[dayEl] === u) return '被克';
    if (SHENG[dayEl] === u) return '被生';
    if (SHENG[u] === dayEl) return '生';
    return '比和';
  };
  const shangkeList = lessons.map((l) => relationToDay(l.upper));
  const kinOrder = [lessons[3], lessons[2], lessons[1], lessons[0]];
  const charEls: string[] = [];
  kinOrder.forEach((l, i) => {
    charEls.push(BRANCH_ELE[l.upper]);
    charEls.push(i === 3 ? STEM_ELE[dayStem] : BRANCH_ELE[l.lower]);
  });
  const elemCounts: Record<string, number> = {};
  for (const e of charEls) elemCounts[e] = (elemCounts[e] || 0) + 1;
  const firstElemByCount = (min: number) => charEls.find((e) => (elemCounts[e] || 0) >= min) || '';

  const keRecords = lessons.map((l, i) => {
    const upperEl = BRANCH_ELE[l.upper];
    const lowerEl = i === 0 ? STEM_ELE[dayStem] : BRANCH_ELE[l.lower];
    if (keEl(upperEl, lowerEl)) return { ...l, kind: '上克下' as const };
    if (keEl(lowerEl, upperEl)) return { ...l, kind: '下贼上' as const };
    return null;
  }).filter(Boolean) as (LiurenLesson & { kind: '上克下' | '下贼上' })[];

  const isFu = mgIdx === hIdx;
  const isFan = ((mgIdx - hIdx) % 12 + 12) % 12 === 6;

  const chainFrom = (init: string, n = 2) => {
    const out = [init];
    for (let i = 0; i < n; i++) out.push(tian(idx(out[out.length - 1])));
    return out;
  };
  const pickByYinYang = (pool: (LiurenLesson & { kind: string })[]) => {
    const hit = pool.find((r) => isYangBranch(r.upper) === isYangStem);
    return hit || pool[0];
  };
  const shehaiScore = (r: LiurenLesson) => {
    const shen = r.upper;
    let b = idx(r.lower);
    const target = idx(shen);
    let score = 0;
    for (let step = 0; step < 12; step++) {
      if (b === target) break;
      b = (b + 1) % 12;
      const br = DIZHI[b];
      if (keEl(BRANCH_ELE[br], BRANCH_ELE[shen])) score += 2;
      score += MENG.includes(br) ? 2 : ZHONG.includes(br) ? 1 : 0;
    }
    return score;
  };

  let chuanBranches: string[] = [];
  let pattern = '';
  let method = '';

  const pickByKe = (pool: (LiurenLesson & { kind: '上克下' | '下贼上' })[]) => {
    if (pool.length === 1) {
      const r = pool[0];
      return {
        init: r.upper,
        pattern: r.kind === '下贼上' ? '重审课' : '元首课',
        method: r.kind === '下贼上' ? '贼克法（一下贼上）' : '贼克法（一上克下）',
      };
    }
    const same = pool.filter((r) => isYangBranch(r.upper) === isYangStem);
    if (same.length === 1) return { init: same[0].upper, pattern: '知一课', method: '比用法' };
    const cand = same.length > 1 ? same : pool;
    const ranked = cand.map((r) => ({ r, score: shehaiScore(r) })).sort((a, b) => b.score - a.score);
    const topScore = ranked[0].score;
    const top = ranked.filter((x) => x.score === topScore).map((x) => x.r);
    const chosen = pickByYinYang(top);
    return { init: chosen.upper, pattern: '涉害课', method: '涉害法' };
  };

  if (isFu) {
    pattern = '伏吟课';
    const init = keRecords.length ? pickByKe(keRecords as any).init : (isYangStem ? ganYang : zhiYang);
    method = '伏吟法（自任）';
    const mid = XING[init] || init;
    const last = XING[mid] || mid;
    chuanBranches = [init, mid, last];
  } else if (isFan) {
    pattern = '返吟课';
    const zei = keRecords.filter((r) => r.kind === '下贼上');
    const up = keRecords.filter((r) => r.kind === '上克下');
    const pool = zei.length ? zei : up;
    const specialD = isYangStem && zei.length === 2 && !hourStemYang && dayBranchEl !== hourBranchEl && hourStemYang === hourBranchYang;
    const specialE = up.length === 1 && zei.length === 1 && dayEl !== hourEl && firstElemByCount(4) === dayBranchEl && dayBranchEl !== hourEl;
    if (specialD) {
      const init = lessons[2].lower;
      chuanBranches = [init, tian(idx(init)), tian(idx(tian(idx(init))))];
      method = '返吟法（元胎赘婿）';
    } else if (specialE) {
      const init = lessons[0].upper;
      chuanBranches = [init, tian(idx(init)), tian(idx(tian(idx(init))))];
      method = '返吟法（无依）';
    } else if (pool.length) {
      const init = pickByKe(pool as any).init;
      chuanBranches = [init, tian(idx(init)), tian(idx(tian(idx(init))))];
      method = '返吟法';
    } else {
      chuanBranches = [YIMA[dayBranch], zhiYang, ganYang];
      method = '返吟法（井栏）';
    }
  } else {
    const zei = keRecords.filter((r) => r.kind === '下贼上');
    const up = keRecords.filter((r) => r.kind === '上克下');
    const pool = zei.length ? zei : up;
    const upCount = up.length;
    const zeiCount = zei.length;
    let special: { init: string; pattern: string; method: string } | null = null;
    if (upCount === 2 && zeiCount === 0 && shangkeList.filter((x) => x === '被克').length > 1 && shangkeList.filter((x) => x === '克').length === 0) {
      special = { init: lessons[1].upper, pattern: '涉害课', method: '涉害法（间传）' };
    } else if (zeiCount === 3 && dayStem === hourStem && dayEl === hourEl && hourEl === hourBranchEl) {
      special = { init: lessons[1].upper, pattern: '涉害课', method: '涉害法（从革）' };
    } else if (zeiCount === 2 && dayEl === hourEl && dayEl !== hourBranchEl) {
      special = { init: lessons[2].upper, pattern: '涉害课', method: '涉害法（间传）' };
    } else if (zeiCount === 2 && isYangStem && hourStemYang && hourBranchYang && firstElemByCount(2) !== hourEl) {
      special = { init: lessons[3].upper, pattern: '比用课', method: '退茹法' };
    }
    if (special) {
      chuanBranches = chainFrom(special.init);
      pattern = special.pattern;
      method = special.method;
    } else if (pool.length) {
      const res = pickByKe(pool as any);
      chuanBranches = chainFrom(res.init);
      pattern = res.pattern;
      method = res.method;
    } else if (distinct === 2) {
      pattern = '八专课';
      method = '八专法';
      const init = isYangStem ? bi(idx(ganYang) + 3) : bi(idx(zhiYin) - 3);
      chuanBranches = chainFrom(init);
    } else {
      const yao = lessons.filter((l) => keEl(BRANCH_ELE[l.upper], dayEl));
      const she = lessons.filter((l) => keEl(dayEl, BRANCH_ELE[l.upper]));
      const ypool = yao.length ? yao : she;
      if (ypool.length) {
        const chosen = pickByYinYang(ypool as any);
        chuanBranches = chainFrom(chosen.upper);
        pattern = '遥克课';
        method = '遥克法';
      } else if (distinct === 3) {
        pattern = '别责课';
        method = '别责法';
        let init: string;
        if (isYangStem) {
          const he = STEM_HE[dayStem];
          init = tian(JIGONG[he]);
        } else {
          init = tian(idx(sanhePrev(dayBranch)));
        }
        chuanBranches = [init, ganYang, ganYang];
      } else {
        pattern = '昴星课';
        method = '昴星法';
        if (isYangStem) {
          chuanBranches = [tian(idx('酉')), ganYang, zhiYang];
        } else {
          chuanBranches = [inverseTian('酉'), zhiYang, ganYang];
        }
      }
    }
  }

  // 十二天将（贵人昼夜 + 顺逆）
  const night = !(hIdx >= 3 && hIdx <= 8);
  const rule = GUI_RULE[dayStem];
  const gui = night ? rule[1] : rule[0];
  const guiDi = DIZHI[diOfTian(gui)];
  const forward = ['亥','子','丑','寅','卯','辰'].includes(guiDi);
  const generalByTian: Record<string, string> = {};
  for (let k = 0; k < 12; k++) {
    const t = bi(idx(gui) + (forward ? k : -k));
    generalByTian[t] = GENERALS[k];
  }
  const plate: LiurenPlateCell[] = DIZHI.map((earth, di) => {
    const heaven = tian(di);
    return { earth, heaven, general: generalByTian[heaven] || '' };
  });

  // 旬空
  let dayIdx60 = 0;
  for (let i = 0; i < 60; i++) {
    if (GAN[i % 10] === dayStem && DIZHI[i % 12] === dayBranch) { dayIdx60 = i; break; }
  }
  const xunStart = Math.floor(dayIdx60 / 10) * 10;
  const xun = `${GAN[xunStart % 10]}${DIZHI[xunStart % 12]}旬`;
  const empties = [bi(xunStart + 10), bi(xunStart + 11)];

  const chuan: LiurenChuan[] = chuanBranches.map((b, i) => ({
    sequence: ['初传', '中传', '末传'][i],
    branch: b,
    general: generalByTian[b] || '',
    liuqin: liuqin(dayEl, BRANCH_ELE[b]),
  }));

  const interpretation = `${dayGz}日${hourBranch}时，月将${mg.name}（${mg.branch}）加时；${pattern}，三传${chuan.map((c) => c.branch).join('→')}；贵人${gui}（${night ? '夜' : '昼'}）${forward ? '顺' : '逆'}布。本盘为算法排盘，解说仅作参考。`;

  return {
    input: { year, month, day, hour, dayGanZhi: dayGz, hourBranch },
    dayStem, dayBranch, dayGanZhi: dayGz,
    xunKong: { xun, branches: empties },
    monthGeneral: { ...mg, sitsOn: hourBranch },
    dayLodge,
    plate,
    lessons,
    chuan,
    pattern,
    method,
    generalStart: { gui, dayNight: night ? '夜' : '昼', forward, sitsOn: guiDi },
    interpretation,
  };
}

export function analyzeLiuren(result: LiurenResult): string {
  const lines: string[] = [];
  lines.push(`【课体】${result.pattern}（${result.method}）`);
  lines.push(`日干支 ${result.dayGanZhi}，旬空 ${result.xunKong.branches.join('、')}；月将 ${result.monthGeneral.name}（${result.monthGeneral.branch}）加 ${result.monthGeneral.sitsOn} 时。`);
  lines.push(`四课：${result.lessons.map((l) => `${l.label}${l.lower}→${l.upper}`).join('；')}`);
  lines.push(`三传：${result.chuan.map((c) => `${c.sequence}${c.branch}（${c.liuqin}·${c.general}）`).join(' → ')}`);
  lines.push(`贵人起于 ${result.generalStart.gui}（${result.generalStart.dayNight}贵），${result.generalStart.forward ? '顺布' : '逆布'}。`);
  lines.push('以上为模板化解读，仅供参考。');
  return lines.join('\n');
}
