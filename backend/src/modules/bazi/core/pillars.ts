import {
  HEAVENLY_STEMS, EARTHLY_BRANCHES, TianGan, DiZhi,
  getStemElement, getStemYinYang, getBranchElement, getBranchYinYang,
  getBranchCangGan, getShiShen, getNayin, Pillar, BaziResult,
} from './constants';

const MONTH_STEM_START: Record<TianGan, number> = {
  甲:2, 己:2, 乙:4, 庚:4, 丙:6, 辛:6, 丁:8, 壬:8, 戊:0, 癸:0,
};

const DAY_STEM_START: Record<TianGan, number> = {
  甲:0, 己:0, 乙:2, 庚:2, 丙:4, 辛:4, 丁:6, 壬:6, 戊:8, 癸:8,
};

export function calculatePillars(year: number, month: number, day: number, hour: number): BaziResult {
  const yearPillar = calcYearPillar(year);
  const monthPillar = calcMonthPillar(yearPillar.stem, month, day);
  const dayPillar = calcDayPillar(year, month, day);
  const hourPillar = calcHourPillar(dayPillar.stem, hour);
  const dayMaster = dayPillar.stem;

  const setShiShen = (p: Pillar) => { p.shishen = getShiShen(dayMaster, p.stem); };
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(setShiShen);

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    dayMaster,
    dayMasterElement: getStemElement(dayMaster),
  };
}

function calcYearPillar(year: number): Pillar {
  const si = (year - 4) % 10;
  const bi = (year - 4) % 12;
  return makePillar(si, bi);
}

function calcMonthPillar(yearStem: TianGan, month: number, day: number): Pillar {
  const jie = getJieIndex(month, day);
  const baseSi = MONTH_STEM_START[yearStem];
  const si = (baseSi + jie) % 10;
  const bi = (jie + 2) % 12;
  return makePillar(si, bi);
}

function calcDayPillar(year: number, month: number, day: number): Pillar {
  const days = daysFromReference(year, month, day);
  const si = (days + 10) % 10;
  const bi = (days + 10 + 2) % 12;
  return makePillar(si, bi);
}

function calcHourPillar(dayStem: TianGan, hour: number): Pillar {
  const base = DAY_STEM_START[dayStem];
  const bi = Math.floor((hour + 1) / 2) % 12;
  const si = (base + bi) % 10;
  return makePillar(si, bi);
}

function makePillar(si: number, bi: number): Pillar {
  const stem = HEAVENLY_STEMS[((si % 10) + 10) % 10];
  const branch = EARTHLY_BRANCHES[((bi % 12) + 12) % 12];
  return {
    stem,
    branch,
    stemElement: getStemElement(stem),
    branchElement: getBranchElement(branch),
    stemYinYang: getStemYinYang(stem),
    branchYinYang: getBranchYinYang(branch),
    cangGan: getBranchCangGan(branch).map((s) => ({ stem: s, element: getStemElement(s) })),
    shishen: null,
    nayin: getNayin(si, bi),
  };
}

function getJieIndex(month: number, day: number): number {
  const jieDates = [
    { m: 2, d: 4 }, { m: 3, d: 6 }, { m: 4, d: 5 }, { m: 5, d: 6 },
    { m: 6, d: 6 }, { m: 7, d: 7 }, { m: 8, d: 8 }, { m: 9, d: 8 },
    { m: 10, d: 8 }, { m: 11, d: 7 }, { m: 12, d: 7 }, { m: 1, d: 6 },
  ];
  for (let i = 0; i < jieDates.length; i++) {
    const j = jieDates[i];
    if ((month === j.m && day >= j.d) || (month > j.m && month < jieDates[(i + 1) % 12].m)) {
      return i;
    }
    if (month === 1 && month < jieDates[11].m) return 11;
  }
  return month >= 2 ? month - 2 : 10 + month;
}

function daysFromReference(year: number, month: number, day: number): number {
  if (month <= 2) { month += 12; year--; }
  const c = Math.floor(year / 100);
  const y = year % 100;
  const m = month;
  const d = day;
  const ref = (y + Math.floor(y / 4) + Math.floor(c / 4) - 2 * c + Math.floor(26 * (m + 1) / 10) + d - 1);
  return ((ref % 60) + 60) % 60;
}
