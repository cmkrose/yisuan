import {
  HEAVENLY_STEMS, EARTHLY_BRANCHES, TianGan, DiZhi,
  getStemElement, getStemYinYang, getBranchElement, getBranchYinYang,
  getBranchCangGan, getShiShen, getNayin, Pillar, BaziResult,
} from './constants';
import { Solar } from 'lunar-javascript';

const DAY_STEM_START: Record<TianGan, number> = {
  甲:0, 己:0, 乙:2, 庚:2, 丙:4, 辛:4, 丁:6, 壬:6, 戊:8, 癸:8,
};

export function calculatePillars(year: number, month: number, day: number, hour: number): BaziResult {
  // 年/月/日柱统一取自 lunar-javascript 的干支历（以节气定年、月，避免手写公式在节气边界错位）。
  const ec = Solar.fromYmd(year, month, day).getLunar().getEightChar();
  const yearPillar = pillarFromGanZhi(ec.getYear());
  const monthPillar = pillarFromGanZhi(ec.getMonth());
  const dayPillar = pillarFromGanZhi(ec.getDay());
  // 时柱按日干五鼠遁推得（日柱已修正，自动跟随）。
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

function pillarFromGanZhi(gz: string): Pillar {
  const stem = gz[0] as TianGan;
  const branch = gz[1] as DiZhi;
  return makePillar(HEAVENLY_STEMS.indexOf(stem), EARTHLY_BRANCHES.indexOf(branch));
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
