import {
  getSurnameStroke, getKangxiStroke, getHanziWuxing,
  ELEMENT_ROTATION,
} from './stroke-data';

export interface NameInput {
  surname: string;
  givenName: string;
  gender: 'male' | 'female';
  birthDate?: string;
}

export interface WugeResult {
  name: string;
  strokes: number;
  wuxing: string;
  isAuspicious: boolean;
  meaning: string;
}

export interface SancaiResult {
  heaven: string;
  person: string;
  earth: string;
  config: string;
  isAuspicious: boolean;
  meaning: string;
}

export interface NameAnalysisResult {
  fullName: string;
  surnameStrokes: number;
  givenNameStrokes: number;
  totalStrokes: number;
  wuge: {
    tianGe: WugeResult;
    renGe: WugeResult;
    diGe: WugeResult;
    waiGe: WugeResult;
    zongGe: WugeResult;
  };
  sancai: SancaiResult;
  wuxingAnalysis: {
    balance: string;
    score: number;
    details: { grid: string; element: string; count: number }[];
  };
  overallScore: number;
  rating: string;
  suggestions: string[];
  lucky: {
    numbers: number[];
    colors: string[];
  };
}

const AUSPICIOUS_STROKES: Record<number, string> = {
  1: '太极之数', 3: '三才之数', 5: '五行之数', 6: '六爻之数',
  7: '七政之数', 8: '八卦之数', 11: '万物更新', 13: '智略之数',
  15: '福寿之数', 16: '厚重之数', 17: '刚强之数', 18: '成功之数',
  21: '首领之数', 23: '旭日之数', 24: '余庆之数', 25: '英俊之数',
  29: '智谋之数', 31: '和顺之数', 32: '幸运之数', 33: '升天之数',
  35: '平安之数', 37: '权威之数', 39: '富贵之数', 41: '有德之数',
  45: '顺风之数', 47: '进言之数', 48: '德智之数', 52: '先见之数',
  63: '荣华之数', 65: '寿福之数', 67: '通达之数', 68: '贤能之数',
  81: '还原之数',
};

const UNLUCKY_STROKES: Record<number, string> = {
  2: '二仪之数', 4: '四象之数', 9: '大成之数', 10: '零暗之数',
  12: '薄弱之数', 14: '缘兆之数', 19: '多难之数', 20: '屋下藏金',
  22: '秋草之数', 26: '变怪之数', 27: '增长之数', 28: '离别之数',
  34: '破家之数', 36: '波澜之数', 40: '退安之数', 42: '数十之数',
  44: '烦闷之数', 46: '载宝之数', 49: '吉凶之数', 50: '小舟之数',
  53: '难成之数', 54: '石上栽花', 55: '善恶之数', 56: '晚景之数',
  62: '寒雪之数', 64: '变乱之数', 66: '后悔之数', 69: '非业之数',
};

function normalizeStroke(n: number): number {
  if (n > 81) return ((n - 1) % 81) + 1;
  return n;
}

function strokeAuspicious(n: number): { isAuspicious: boolean; meaning: string } {
  const ns = normalizeStroke(n);
  if (AUSPICIOUS_STROKES[ns]) return { isAuspicious: true, meaning: AUSPICIOUS_STROKES[ns] };
  if (UNLUCKY_STROKES[ns]) return { isAuspicious: false, meaning: UNLUCKY_STROKES[ns] };
  return { isAuspicious: ns % 2 === 1, meaning: ns % 2 === 1 ? '阳数吉' : '阴数平' };
}

export function analyzeName(input: NameInput): NameAnalysisResult {
  const { surname, givenName, gender } = input;
  const surLen = surname.length;
  const givLen = givenName.length;

  const surStrokes = surname.split('').map((c) => getSurnameStroke(c));
  const givStrokes = givenName.split('').map((c) => getKangxiStroke(c));

  // 五格计算
  const tianStrokes = surLen === 1 ? surStrokes[0] + 1 : surStrokes.reduce((a, b) => a + b, 0);
  const renStrokes = surStrokes[surLen - 1] + givStrokes[0];
  const diStrokes = givLen === 1 ? givStrokes[0] + 1 : givStrokes.reduce((a, b) => a + b, 0);
  const zongStrokes = surStrokes.reduce((a, b) => a + b, 0) + givStrokes.reduce((a, b) => a + b, 0);
  const waiStrokes = zongStrokes - renStrokes + 1;

  const tianWuxing = getHanziWuxing(tianStrokes);
  const renWuxing = getHanziWuxing(renStrokes);
  const diWuxing = getHanziWuxing(diStrokes);
  const waiWuxing = getHanziWuxing(waiStrokes);
  const zongWuxing = getHanziWuxing(zongStrokes);

  const tianAusp = strokeAuspicious(tianStrokes);
  const renAusp = strokeAuspicious(renStrokes);
  const diAusp = strokeAuspicious(diStrokes);
  const waiAusp = strokeAuspicious(waiStrokes);
  const zongAusp = strokeAuspicious(zongStrokes);

  // 三才配置分析
  const sancai = analyzeSancai(tianStrokes, renStrokes, diStrokes);

  // 五行分析
  const wuxingCounts: Record<string, number> = {};
  [tianWuxing, renWuxing, diWuxing, waiWuxing, zongWuxing].forEach((e) => {
    wuxingCounts[e] = (wuxingCounts[e] || 0) + 1;
  });

  const wuxingDetails = [
    { grid: '天格', element: tianWuxing, count: 1 },
    { grid: '人格', element: renWuxing, count: 2 },
    { grid: '地格', element: diWuxing, count: 3 },
    { grid: '外格', element: waiWuxing, count: 2 },
    { grid: '总格', element: zongWuxing, count: 3 },
  ];

  const elementKeys = ['木','火','土','金','水'];
  const hasAll = elementKeys.every((e) => wuxingCounts[e] >= 1);
  const balanceScore = hasAll ? 90 : Math.max(40, Object.keys(wuxingCounts).length * 20);
  const balance = hasAll ? '五行俱全，气运流通' : `五行${Object.keys(wuxingCounts).length}种，${5 - Object.keys(wuxingCounts).length}种缺失`;

  // 综合评分
  let score = 0;
  score += tianAusp.isAuspicious ? 10 : 4;
  score += renAusp.isAuspicious ? 25 : 10;
  score += diAusp.isAuspicious ? 20 : 8;
  score += waiAusp.isAuspicious ? 15 : 6;
  score += zongAusp.isAuspicious ? 15 : 6;
  score += sancai.isAuspicious ? 10 : 3;
  score += Math.round(balanceScore / 15);

  let rating = '';
  if (score >= 85) rating = '大吉';
  else if (score >= 70) rating = '吉';
  else if (score >= 55) rating = '中吉';
  else if (score >= 40) rating = '平';
  else rating = '凶';

  // 建议
  const suggestions: string[] = [];
  if (!tianAusp.isAuspicious) suggestions.push('天格数理不利，建议配合人格地格补益');
  if (!renAusp.isAuspicious) suggestions.push('人格数理欠佳，此为姓名核心，建议优先改名');
  if (!diAusp.isAuspicious) suggestions.push('地格数理不吉，建议名字笔画数进行调整');
  if (!sancai.isAuspicious) suggestions.push(`三才配置${sancai.config}不利，建议调整姓名字数`);
  if (suggestions.length === 0) suggestions.push('姓名配置优良，无需修改');

  // 幸运数字颜色
  const luckyNums = [1,6].includes(zongStrokes % 10) ? [1,6] :
    [2,7].includes(zongStrokes % 10) ? [2,7] :
    [3,8].includes(zongStrokes % 10) ? [3,8] :
    [4,9].includes(zongStrokes % 10) ? [4,9] : [5,0];

  const elementColors: Record<string, string[]> = {
    木: ['绿色','青色'], 火: ['红色','紫色'], 土: ['黄色','棕色'],
    金: ['白色','金色'], 水: ['黑色','蓝色'],
  };
  const luckyColors = elementColors[renWuxing] || ['红色','金色'];

  return {
    fullName: surname + givenName,
    surnameStrokes: surStrokes.reduce((a, b) => a + b, 0),
    givenNameStrokes: givStrokes.reduce((a, b) => a + b, 0),
    totalStrokes: zongStrokes,
    wuge: {
      tianGe: { name: '天格', strokes: tianStrokes, wuxing: tianWuxing, ...tianAusp },
      renGe: { name: '人格', strokes: renStrokes, wuxing: renWuxing, ...renAusp },
      diGe: { name: '地格', strokes: diStrokes, wuxing: diWuxing, ...diAusp },
      waiGe: { name: '外格', strokes: waiStrokes, wuxing: waiWuxing, ...waiAusp },
      zongGe: { name: '总格', strokes: zongStrokes, wuxing: zongWuxing, ...zongAusp },
    },
    sancai,
    wuxingAnalysis: {
      balance,
      score: balanceScore,
      details: wuxingDetails,
    },
    overallScore: score,
    rating,
    suggestions,
    lucky: { numbers: luckyNums, colors: luckyColors },
  };
}

function analyzeSancai(tian: number, ren: number, di: number): SancaiResult {
  const tE = getHanziWuxing(tian);
  const rE = getHanziWuxing(ren);
  const dE = getHanziWuxing(di);

  const config = `${tE}${rE}${dE}`;
  const sancaiIndex = ELEMENT_ROTATION.findIndex(
    (e) => e[0] === tE && e[1] === rE && e[2] === dE
  );

  const sancaiRatings = [
    '大吉','吉','吉','凶','凶','吉','吉','凶','吉','吉',
    '凶','凶','吉','凶','凶','吉','凶','凶','吉','吉',
    '凶','吉','凶','吉','吉','吉','吉','大吉','大吉','大吉',
    '大吉','大吉','大吉','大吉','吉','吉','吉','吉','吉','大吉',
    '大吉','大吉','大吉','吉','吉','大吉','大吉','大吉','大吉','大吉',
    '大吉','大吉','大吉','大吉','大吉','大吉','大吉','大吉','大吉','大吉',
    '吉','吉','吉','吉','吉','吉','吉','吉','吉','吉',
    '吉','吉','吉','吉','吉','吉','吉','吉','吉','吉',
    '吉','凶','吉','吉','吉','大吉','大吉','大吉','大吉','大吉',
    '大吉','大吉','大吉','大吉','大吉','大吉','大吉','大吉','大吉','大吉',
    '大吉','大吉','大吉','大吉','大吉','大吉','大吉','大吉','大吉','大吉',
    '大吉','大吉','大吉','大吉','大吉','大吉','大吉','大吉','大吉','大吉',
    '凶','吉','大吉','大吉','大吉',
  ];

  const rating = sancaiRatings[sancaiIndex] || '平';
  return {
    heaven: tE,
    person: rE,
    earth: dE,
    config,
    isAuspicious: ['大吉','吉'].includes(rating),
    meaning: rating === '大吉' ? '三才配置极佳，运势亨通' : rating === '吉' ? '三才配置良好' : '三才配置欠佳，需注意调整',
  };
}

export function suggestNames(surname: string, gender: 'male' | 'female', count: number): { name: string; score: number }[] {
  const surStrokes = surname.split('').reduce((s, c) => s + getSurnameStroke(c), 0);
  const surLast = surname.split('').reduce((s, c) => s + getKangxiStroke(c), 0) % getNameCharCount(surname);

  const maleChars = ['伟','宇','轩','博','杰','浩','明','睿','毅','豪','志','鹏','涛','峰','俊','文','泽','翰','宸','铭'];
  const femaleChars = ['婷','雅','琳','雯','芳','娟','静','悦','萱','颖','慧','莉','萍','蓉','婷','琪','瑶','怡','晴','岚'];
  const pool = gender === 'male' ? maleChars : femaleChars;

  interface Candidate { name: string; score: number }
  const candidates: Candidate[] = [];

  for (const c1 of pool) {
    for (const c2 of pool) {
      if (c1 === c2) continue;
      const fullName = surname + c1 + c2;
      const result = analyzeName({ surname, givenName: c1 + c2, gender });
      candidates.push({ name: fullName, score: result.overallScore });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, count);
}

function getNameCharCount(fullName: string): number {
  return fullName.length;
}
