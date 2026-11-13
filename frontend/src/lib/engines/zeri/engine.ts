import {
  HEAVENLY_STEMS, EARTHLY_BRANCHES, JIANCHU, ER_SHI_BA_XIU,
  SHENG_XIAO, YI_JI_TEMPLATES, DayResult,
} from './constants';

const HUANGDAO_JIANCHU = new Set([1,2,5,6,9,10]);

export function getDayInfo(year: number, month: number, day: number): DayResult {
  const ysi = (year - 4) % 10; const ybi = (year - 4) % 12;
  const ys = HEAVENLY_STEMS[(ysi + 10) % 10];
  const yb = EARTHLY_BRANCHES[(ybi + 12) % 12];

  const msi = (ysi * 2 + month - 1) % 10;
  const mbi = (month + 1) % 12;
  const ms = HEAVENLY_STEMS[msi % 10];
  const mb = EARTHLY_BRANCHES[mbi % 12];

  // Day stem-branch using periodic calculation
  const refDay = referenceDays(year, month, day);
  const dsi = Math.abs((refDay + 10) % 10);
  const dbi = Math.abs((refDay + 10 + 2) % 12);
  const ds = HEAVENLY_STEMS[Math.abs(dsi % 10)];
  const db = EARTHLY_BRANCHES[Math.abs(dbi % 12)];

  // 建除十二神
  const monthBranchIdx = EARTHLY_BRANCHES.indexOf(mb as any);
  const dayBranchIdx = EARTHLY_BRANCHES.indexOf(db as any);
  const jcIdx = ((dayBranchIdx - monthBranchIdx - 1 + 12) % 12);
  const jianchu = JIANCHU[jcIdx];

  // 黄道/黑道
  const isHuangdao = HUANGDAO_JIANCHU.has(jcIdx + 1);
  const dayType = isHuangdao ? '黄道吉日' : '黑道日';

  // 二十八宿
  const xiuIdx = Math.abs((refDay + 5) % 28);
  const xiu = ER_SHI_BA_XIU[xiuIdx];

  // 冲煞: 冲与日支相冲的生肖
  const conflictBranchIdx = (dayBranchIdx + 6) % 12;
  const shaDirections = ['南','南','西','西','北','北','东','东','南','南','西','西','北'];
  const chongAnimal = SHENG_XIAO[conflictBranchIdx];
  const sha = `煞${shaDirections[conflictBranchIdx]}`;

  return {
    date: `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`,
    yearStem: ys, yearBranch: yb, monthStem: ms, monthBranch: mb,
    dayStem: ds, dayBranch: db,
    jianchu: jianchu,
    jianchuIndex: jcIdx,
    isHuangdao,
    dayType,
    ershiba: xiu.name,
    xiuFortune: xiu.fortune,
    chongAnimal,
    sha,
    yi: isHuangdao ? ['嫁娶','出行','开业','交易','入宅','迁移'] : [],
    ji: isHuangdao ? [] : ['嫁娶','开业','入宅','动土','出行'],
  };
}

export function selectDates(
  year: number, month: number, purpose: 'wedding'|'business'|'moving'|'construction',
): DayResult[] {
  const results: DayResult[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const tmpl = YI_JI_TEMPLATES[purpose];

  for (let d = 1; d <= daysInMonth; d++) {
    const dayInfo = getDayInfo(year, month, d);
    if (dayInfo.isHuangdao && dayInfo.xiuFortune === '吉') {
      dayInfo.yi = [...tmpl.yi, ...dayInfo.yi.slice(0, 3)];
      dayInfo.ji = tmpl.ji;
      results.push(dayInfo);
    }
  }
  return results;
}

export function getMonthCalendar(year: number, month: number): DayResult[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const results: DayResult[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    results.push(getDayInfo(year, month, d));
  }
  return results;
}

function referenceDays(year: number, month: number, day: number): number {
  if (month <= 2) { month += 12; year--; }
  const c = Math.floor(year / 100);
  const y = year % 100;
  const m = month;
  return (y + Math.floor(y / 4) + Math.floor(c / 4) - 2 * c + Math.floor(26 * (m + 1) / 10) + day - 1);
}
