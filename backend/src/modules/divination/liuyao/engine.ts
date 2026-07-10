import {
  HEXAGRAMS, LIUQIN_BY_YAO, LIUSHEN, SHIYAO,
} from './hexagram-data';

export interface LiuyaoResult {
  hexagramId: number;
  hexagramName: string;
  symbol: string;
  lines: { position: number; value: number; moving: boolean; liuqin: string }[];
  shiyao: number;
  yingyao: number;
  liushen: string[];
  changedHexagram?: { id: number; name: string; symbol: string };
  interpretation: string;
  meaning: string;
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

export function analyzeLiuyao(): LiuyaoResult {
  const { lines, movingLines } = castCoins();

  let hexId = 0;
  for (const h of Object.values(HEXAGRAMS)) {
    if (JSON.stringify(h.lines) === JSON.stringify(lines)) {
      hexId = Object.keys(HEXAGRAMS).find(k => HEXAGRAMS[Number(k)] === h) as any;
      break;
    }
  }
  if (!hexId) {
    // Find closest match by bit pattern
    let bestMatch = 0, bestDist = 999;
    for (let i = 1; i <= 64; i++) {
      const h = HEXAGRAMS[i];
      let dist = 0;
      for (let j = 0; j < 6; j++) {
        if (h.lines[j] !== lines[j]) dist++;
      }
      if (dist < bestDist) { bestDist = dist; bestMatch = i; }
    }
    hexId = bestMatch || 1;
  }

  const hexagram = HEXAGRAMS[hexId];
  const shi = SHIYAO[hexId] || 1;
  const ying = (shi + 3) % 6;

  const lineDetails = lines.map((v, i) => ({
    position: i + 1,
    value: v,
    moving: movingLines.includes(i),
    liuqin: '',
  }));

  const liuShenAssign = LIUSHEN.slice();
  if (movingLines.length > 0) liuShenAssign.reverse();

  const guaName = hexagram.upper;
  const liuqins = LIUQIN_BY_YAO[guaName] || LIUQIN_BY_YAO['乾'];
  lineDetails.forEach((l, i) => l.liuqin = liuqins[i] || '父母');

  // Changed hexagram
  let changedHexagram: LiuyaoResult['changedHexagram'] | undefined;
  if (movingLines.length > 0) {
    const changedLines = [...lines];
    for (const ml of movingLines) {
      changedLines[ml] = changedLines[ml] === 1 ? 0 : 1;
    }
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
    liushen: liuShenAssign,
    changedHexagram,
    interpretation: hexagram.interpretation,
    meaning: `动爻${movingLines.length > 0 ? movingLines.map(m => m+1).join('、') + '爻动' : '静卦'} · ${hexagram.meaning}`,
  };
}
