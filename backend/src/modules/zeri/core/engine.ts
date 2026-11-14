import { Solar } from 'lunar-javascript';
import { JIANCHU, ER_SHI_BA_XIU, YI_JI_TEMPLATES, DayResult, DayTime } from './constants';

const TIME_NAMES = ['子时','丑时','寅时','卯时','辰时','巳时','午时','未时','申时','酉时','戌时','亥时'];
const BRANCHES = '子丑寅卯辰巳午未申酉戌亥';

// 黄历数据统一取自 lunar-javascript 的 Lunar 对象（同一实例），保证宜忌/建除/星宿/天神/彭祖/神煞同源。
export function getDayInfo(year: number, month: number, day: number): DayResult {
  const lunar = Solar.fromYmd(year, month, day).getLunar();
  const yearGz = lunar.getYearInGanZhi();
  const monthGz = lunar.getMonthInGanZhi();
  const dayGz = lunar.getDayInGanZhi();

  const jianchu = lunar.getZhiXing();
  const jcIdx = Math.max(0, (JIANCHU as readonly string[]).indexOf(jianchu));

  const tianShenType = lunar.getDayTianShenType();
  const isHuangdao = tianShenType === '黄道';

  const xiuShort = lunar.getXiu();
  const xiuFull = (ER_SHI_BA_XIU as readonly { name: string }[]).find((x) => x.name.startsWith(xiuShort))?.name || xiuShort;

  const chongDesc = lunar.getDayChongDesc();
  const chongAnimal = (chongDesc.match(/[鼠牛虎兔龙蛇马羊猴鸡狗猪]$/) || [''])[0];

  const yi = [...lunar.getDayYi()];
  const ji = lunar.getDayJi().filter((x: string) => !yi.includes(x));

  return {
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    yearStem: yearGz[0], yearBranch: yearGz[1],
    monthStem: monthGz[0], monthBranch: monthGz[1],
    dayStem: dayGz[0], dayBranch: dayGz[1],
    jianchu,
    jianchuIndex: jcIdx,
    isHuangdao,
    dayType: isHuangdao ? '黄道吉日' : '黑道日',
    tianShen: lunar.getDayTianShen(),
    tianShenType,
    tianShenLuck: lunar.getDayTianShenLuck(),
    ershiba: xiuFull,
    xiuFortune: lunar.getXiuLuck(),
    chongAnimal,
    chongDesc,
    sha: `煞${lunar.getDaySha()}`,
    pengzuGan: lunar.getPengZuGan(),
    pengzuZhi: lunar.getPengZuZhi(),
    jiShen: [...lunar.getDayJiShen()],
    xiongSha: [...lunar.getDayXiongSha()],
    yi,
    ji,
  };
}

// 可选：逐时辰吉凶（数据同样来自 lunar-javascript）。
export function getDayTimes(year: number, month: number, day: number): DayTime[] {
  const lunar = Solar.fromYmd(year, month, day).getLunar();
  return lunar.getTimes().map((t: any) => {
    const gz = t.getGanZhi();
    const bi = BRANCHES.indexOf(gz[1]);
    return {
      name: TIME_NAMES[bi] || gz[1],
      ganZhi: gz,
      tianShen: t.getTianShen(),
      luck: t.getTianShenLuck(),
      yi: [...t.getYi()],
      ji: [...t.getJi()],
    };
  });
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
      const yiMerged = Array.from(new Set([...tmpl.yi, ...dayInfo.yi.slice(0, 3)]))
        .filter((x) => !tmpl.ji.includes(x) && !dayInfo.ji.includes(x));
      const jiMerged = Array.from(new Set([...tmpl.ji, ...dayInfo.ji]))
        .filter((x) => !yiMerged.includes(x));
      dayInfo.yi = yiMerged;
      dayInfo.ji = jiMerged;
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
