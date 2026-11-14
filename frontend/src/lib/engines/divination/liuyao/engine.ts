import { Solar } from 'lunar-javascript';
import {
  HEXAGRAMS, LIUSHEN, TRIGRAM_ELEMENT, getGuaGong, getShiPosition, getNajiaBranches,
} from './hexagram-data';

export interface LiuyaoLine {
  position: number;
  value: number;
  moving: boolean;
  liuqin: string;
  najia: string;
  element: string;
  liushen: string;
  isShi: boolean;
  isYing: boolean;
}

export interface LiuyaoResult {
  hexagramId: number;
  hexagramName: string;
  symbol: string;
  lines: LiuyaoLine[];
  shiyao: number;
  yingyao: number;
  liushen: string[];
  dayGan: string;
  gong: string;
  changedHexagram?: { id: number; name: string; symbol: string };
  interpretation: string;
  meaning: string;
}

const BRANCH_ELEMENT: Record<string, string> = {
  子:'水', 丑:'土', 寅:'木', 卯:'木', 辰:'土', 巳:'火', 午:'火', 未:'土', 申:'金', 酉:'金', 戌:'土', 亥:'水',
};
const SHENG: Record<string, string> = { 木:'火', 火:'土', 土:'金', 金:'水', 水:'木' };
const KE: Record<string, string> = { 木:'土', 土:'水', 水:'火', 火:'金', 金:'木' };

// 六亲：以卦宫五行为「我」，逐爻地支五行生克推导。
function liuqinOf(gongEl: string, yaoEl: string): string {
  if (gongEl === yaoEl) return '兄弟';
  if (SHENG[yaoEl] === gongEl) return '父母'; // 生我
  if (SHENG[gongEl] === yaoEl) return '子孙'; // 我生
  if (KE[yaoEl] === gongEl) return '官鬼'; // 克我
  if (KE[gongEl] === yaoEl) return '妻财'; // 我克
  return '兄弟';
}

// 六神起例（按占问日干）：甲乙青龙、丙丁朱雀、戊勾陈、己螣蛇、庚辛白虎、壬癸玄武。
const LIUSHEN_START: Record<string, number> = { 甲:0, 乙:0, 丙:1, 丁:1, 戊:2, 己:3, 庚:4, 辛:4, 壬:5, 癸:5 };

function todayDayGan(): string {
  return Solar.fromDate(new Date()).getLunar().getDayInGanZhi()[0];
}

function coinFlip(): number { return Math.floor(Math.random() * 2); }

export function castCoins(): { lines: number[]; movingLines: number[] } {
  const lines: number[] = [];
  const movingLines: number[] = [];
  for (let i = 0; i < 6; i++) {
    const toss = coinFlip() + coinFlip() + coinFlip();
    const isMoving = toss === 3 || toss === 0;
    const isYang = toss >= 2;
    lines.push(isYang ? 1 : 0);
    if (isMoving) movingLines.push(i);
  }
  return { lines, movingLines };
}

// dayGan 可指定占问日干（用于校验）；forcedLines 用于固定卦象校验。
export function analyzeLiuyao(dayGan?: string, forcedLines?: number[]): LiuyaoResult {
  const { lines, movingLines } = forcedLines
    ? { lines: forcedLines, movingLines: [] as number[] }
    : castCoins();

  let hexId = 0;
  for (const h of Object.values(HEXAGRAMS)) {
    if (JSON.stringify(h.lines) === JSON.stringify(lines)) {
      hexId = Number(Object.keys(HEXAGRAMS).find(k => HEXAGRAMS[Number(k)] === h));
      break;
    }
  }
  if (!hexId) {
    let bestMatch = 0, bestDist = 999;
    for (let i = 1; i <= 64; i++) {
      const h = HEXAGRAMS[i];
      let dist = 0;
      for (let j = 0; j < 6; j++) if (h.lines[j] !== lines[j]) dist++;
      if (dist < bestDist) { bestDist = dist; bestMatch = i; }
    }
    hexId = bestMatch || 1;
  }

  const hexagram = HEXAGRAMS[hexId];
  const gong = getGuaGong(hexagram.name);
  const gongEl = TRIGRAM_ELEMENT[gong] || '金';
  const shi = getShiPosition(hexagram.name);
  const ying = (shi + 3) % 6;
  const najia = getNajiaBranches(hexagram.upper, hexagram.lower);
  const gan = dayGan || todayDayGan();
  const start = LIUSHEN_START[gan] ?? 0;

  const lineDetails: LiuyaoLine[] = lines.map((v, i) => {
    const branch = najia[i];
    const el = BRANCH_ELEMENT[branch] || '土';
    return {
      position: i + 1,
      value: v,
      moving: movingLines.includes(i),
      liuqin: liuqinOf(gongEl, el),
      najia: branch,
      element: el,
      liushen: LIUSHEN[(start + i) % 6],
      isShi: i === shi,
      isYing: i === ying,
    };
  });

  // 变卦
  let changedHexagram: LiuyaoResult['changedHexagram'] | undefined;
  if (movingLines.length > 0) {
    const changedLines = [...lines];
    for (const ml of movingLines) changedLines[ml] = changedLines[ml] === 1 ? 0 : 1;
    for (let i = 1; i <= 64; i++) {
      if (JSON.stringify(HEXAGRAMS[i].lines) === JSON.stringify(changedLines)) {
        changedHexagram = { id: i, name: HEXAGRAMS[i].name, symbol: HEXAGRAMS[i].symbol };
        break;
      }
    }
  }

  return {
    hexagramId: hexId,
    hexagramName: hexagram.name,
    symbol: hexagram.symbol,
    lines: lineDetails,
    shiyao: shi + 1,
    yingyao: ying + 1,
    liushen: lineDetails.map(l => l.liushen),
    dayGan: gan,
    gong,
    changedHexagram,
    interpretation: hexagram.interpretation,
    meaning: `动爻${movingLines.length > 0 ? movingLines.map(m => m + 1).join('、') + '爻动' : '静卦'} · ${hexagram.meaning}`,
  };
}
