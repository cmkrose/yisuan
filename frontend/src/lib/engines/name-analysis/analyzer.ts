import {
  getSurnameStroke, getKangxiStroke, getHanziWuxing,
  ELEMENT_ROTATION,
} from './stroke-data';

// ============================================================
// INPUT
// ============================================================

export interface NameInput {
  surname: string;
  givenName: string;
  gender: 'male' | 'female';
  birthDate?: string;
}

// ============================================================
// ANALYSIS PHASE TYPES
// ============================================================

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

export interface KangxiDetail {
  char: string;
  strokes: number;
  wuxing: string;
}

export interface WuxingBalance {
  balance: string;
  score: number;
  details: { grid: string; element: string }[];
  missing: string[];
}

export interface ZiyiChar {
  char: string;
  strokes: number;
  wuxing: string;
  analysis: string;
}

export interface AnalysisPhase {
  fullName: string;
  wuge: {
    tianGe: WugeResult;
    renGe: WugeResult;
    diGe: WugeResult;
    waiGe: WugeResult;
    zongGe: WugeResult;
  };
  sancai: SancaiResult;
  kangxiStrokes: KangxiDetail[];
  wuxing: WuxingBalance;
  ziyi: {
    surname: ZiyiChar[];
    givenName: ZiyiChar[];
    overall: string;
  };
  yinlv: string;
  harmony: string;
}

// ============================================================
// EVALUATION PHASE TYPES
// ============================================================

export interface EvaluationPhase {
  overallScore: number;
  rating: string;
  pros: string[];
  cons: string[];
  potentialIssues: string[];
  lucky: {
    numbers: number[];
    colors: string[];
  };
}

// ============================================================
// SUGGESTION PHASE TYPES
// ============================================================

export interface SuggestionItem {
  name: string;
  reason: string;
  improvement: string;
  score: number;
}

// ============================================================
// MAIN RESULT TYPE
// ============================================================

export interface NameAnalysisResult {
  analysis: AnalysisPhase;
  evaluation: EvaluationPhase;
  suggestions: SuggestionItem[];
}

// ============================================================
// CONSTANTS
// ============================================================

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

const WUXING_SHENG: Record<string, string> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};

const WUXING_KE: Record<string, string> = {
  '木': '土', '土': '水', '水': '火', '火': '金', '金': '木',
};

const ELEMENT_KEYS = ['木', '火', '土', '金', '水'];

const ELEMENT_COLORS: Record<string, string[]> = {
  木: ['绿色', '青色'], 火: ['红色', '紫色'], 土: ['黄色', '棕色'],
  金: ['白色', '金色'], 水: ['黑色', '蓝色'],
};

const ELEMENT_HEALTH: Record<string, string> = {
  '木': '肝胆、筋骨', '火': '心脏、血脉', '土': '脾胃、消化',
  '金': '肺部、呼吸', '水': '肾脏、泌尿',
};

const ELEMENT_PERSONALITY: Record<string, string> = {
  '木': '仁德温和、正直向上、富有创造力',
  '火': '热情开朗、彬彬有礼、富有感染力',
  '土': '稳重诚信、包容踏实、可靠务实',
  '金': '刚直果断、正义凛然、雷厉风行',
  '水': '聪慧灵动、通达圆融、适应力强',
};

const ELEMENT_CAREER: Record<string, string> = {
  '木': '教育、文化传媒、出版、园林绿化、中医中药、环保生态、木材家具、纺织服装',
  '火': '能源电力、餐饮烹饪、影视娱乐、互联网科技、航空航天、光学电子、心理咨询、美容化妆',
  '土': '房地产建筑、矿产开发、农业种植、土地管理、酒店餐饮、陶瓷工艺、城市规划、保险金融',
  '金': '金融银行、金属机械、汽车制造、法律司法、军队警察、珠宝首饰、外科医疗、精密仪器',
  '水': '水利海运、渔业水产、物流运输、旅游观光、新闻传播、艺术表演、外交贸易、饮料制酒',
};

const MALE_CHARS = [
  '伟', '宇', '轩', '博', '杰', '浩', '明', '睿', '毅', '豪',
  '志', '鹏', '涛', '峰', '俊', '文', '泽', '翰', '宸', '铭',
  '哲', '彦', '彬', '恒', '昌', '德', '辉', '霖', '旭', '鸿',
];

const FEMALE_CHARS = [
  '婷', '雅', '琳', '雯', '芳', '娟', '静', '悦', '萱', '颖',
  '慧', '莉', '萍', '蓉', '琪', '瑶', '怡', '晴', '岚', '宁',
  '婉', '雪', '诗', '思', '曼', '洁', '欣', '韵', '莎', '菲',
];

const NEUTRAL_CHARS = [
  '安', '平', '康', '健', '永', '嘉', '瑞', '祥', '华', '仁',
  '诚', '达', '宏', '源', '宁',
];

// ============================================================
// CALCULATION HELPERS
// ============================================================

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

function getInteraction(a: string, b: string): '生' | '被生' | '克' | '被克' | '比和' {
  if (WUXING_SHENG[a] === b) return '生';
  if (WUXING_SHENG[b] === a) return '被生';
  if (WUXING_KE[a] === b) return '克';
  if (WUXING_KE[b] === a) return '被克';
  return '比和';
}

function getInteractionText(rel: string): string {
  const map: Record<string, string> = {
    '生': '相生相助，有利',
    '被生': '得对方生助，吉利',
    '克': '相克制约，需调和',
    '被克': '受对方克制，注意规避',
    '比和': '同气相求，和谐稳定',
  };
  return map[rel] || '中性';
}

function getShengElement(element: string): string {
  const shengMap: Record<string, string> = {
    '木': '水或火', '火': '木或土', '土': '火或金',
    '金': '土或水', '水': '金或木',
  };
  return shengMap[element] || '综合';
}

// ============================================================
// Sancai Analysis (kept from original)
// ============================================================

function analyzeSancai(tian: number, ren: number, di: number): SancaiResult {
  const tE = getHanziWuxing(tian);
  const rE = getHanziWuxing(ren);
  const dE = getHanziWuxing(di);

  const config = `${tE}${rE}${dE}`;
  const sancaiIndex = ELEMENT_ROTATION.findIndex(
    (e) => e[0] === tE && e[1] === rE && e[2] === dE
  );

  const sancaiRatings = [
    '大吉', '吉', '吉', '凶', '凶', '吉', '吉', '凶', '吉', '吉',
    '凶', '凶', '吉', '凶', '凶', '吉', '凶', '凶', '吉', '吉',
    '凶', '吉', '凶', '吉', '吉', '吉', '吉', '大吉', '大吉', '大吉',
    '大吉', '大吉', '大吉', '大吉', '吉', '吉', '吉', '吉', '吉', '大吉',
    '大吉', '大吉', '大吉', '吉', '吉', '大吉', '大吉', '大吉', '大吉', '大吉',
    '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉',
    '吉', '吉', '吉', '吉', '吉', '吉', '吉', '吉', '吉', '吉',
    '吉', '吉', '吉', '吉', '吉', '吉', '吉', '吉', '吉', '吉',
    '吉', '凶', '吉', '吉', '吉', '大吉', '大吉', '大吉', '大吉', '大吉',
    '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉',
    '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉',
    '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉', '大吉',
    '凶', '吉', '大吉', '大吉', '大吉',
  ];

  const rating = sancaiRatings[sancaiIndex] || '平';

  const sancaiMeanings: Record<string, string> = {
    '大吉': `三才配置极佳，${tE}${rE}${dE}格局运势亨通。天格属${tE}、人格属${rE}、地格属${dE}，三者生克得当形成良性循环。先天根基稳固，后天发展顺利，能得到天时地利人和的助力，事业与家庭皆易有理想结果。`,
    '吉': `三才配置良好，${tE}${rE}${dE}格局整体和谐。三者虽有些微生克变化但方向积极，不会造成严重冲克。事业中会遇到波折但能克服，家庭整体融洽，个人努力可弥补先天不足。`,
    '平': `三才配置一般，${tE}${rE}${dE}格局中规中矩。三者虽无明显冲突但也缺乏有力的相生关系，运势平稳少有大起伏。需依靠勤奋努力推动发展，人际与家庭需更多用心经营。`,
    '凶': `三才配置欠佳，${tE}${rE}${dE}格局存在不利因素。三者五行生克出现冲突，可能带来事业阻力、健康隐患或人际矛盾。建议通过调整名字或佩戴五行补益饰品来改善三才格局。`,
  };

  return {
    heaven: tE,
    person: rE,
    earth: dE,
    config,
    isAuspicious: ['大吉', '吉'].includes(rating),
    meaning: sancaiMeanings[rating] || sancaiMeanings['平'],
  };
}

// ============================================================
// ANALYSIS PHASE BUILDERS
// ============================================================

interface StrokeData {
  surname: string;
  givenName: string;
  surStrokes: number[];
  givStrokes: number[];
  tianStrokes: number;
  renStrokes: number;
  diStrokes: number;
  zongStrokes: number;
  waiStrokes: number;
  tianWuxing: string;
  renWuxing: string;
  diWuxing: string;
  waiWuxing: string;
  zongWuxing: string;
  tianAusp: { isAuspicious: boolean; meaning: string };
  renAusp: { isAuspicious: boolean; meaning: string };
  diAusp: { isAuspicious: boolean; meaning: string };
  waiAusp: { isAuspicious: boolean; meaning: string };
  zongAusp: { isAuspicious: boolean; meaning: string };
  wuge: AnalysisPhase['wuge'];
}

function computeStrokes(input: NameInput): StrokeData {
  const { surname, givenName } = input;
  const surLen = surname.length;
  const givLen = givenName.length;

  const surStrokes = surname.split('').map((c) => getSurnameStroke(c));
  const givStrokes = givenName.split('').map((c) => getKangxiStroke(c));

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

  return {
    surname, givenName, surStrokes, givStrokes,
    tianStrokes, renStrokes, diStrokes, zongStrokes, waiStrokes,
    tianWuxing, renWuxing, diWuxing, waiWuxing, zongWuxing,
    tianAusp, renAusp, diAusp, waiAusp, zongAusp,
    wuge: {
      tianGe: { name: '天格', strokes: tianStrokes, wuxing: tianWuxing, ...tianAusp },
      renGe: { name: '人格', strokes: renStrokes, wuxing: renWuxing, ...renAusp },
      diGe: { name: '地格', strokes: diStrokes, wuxing: diWuxing, ...diAusp },
      waiGe: { name: '外格', strokes: waiStrokes, wuxing: waiWuxing, ...waiAusp },
      zongGe: { name: '总格', strokes: zongStrokes, wuxing: zongWuxing, ...zongAusp },
    },
  };
}

function buildKangxi(surname: string, givenName: string): KangxiDetail[] {
  const allChars = [...surname.split(''), ...givenName.split('')];
  return allChars.map((c) => {
    const strokes = getKangxiStroke(c);
    return { char: c, strokes, wuxing: getHanziWuxing(strokes) };
  });
}

function buildWuxingBalance(sd: StrokeData): WuxingBalance {
  const elements = [sd.tianWuxing, sd.renWuxing, sd.diWuxing, sd.waiWuxing, sd.zongWuxing];
  const counts: Record<string, number> = {};
  elements.forEach((e) => { counts[e] = (counts[e] || 0) + 1; });

  const hasAll = ELEMENT_KEYS.every((e) => counts[e] >= 1);
  const presentCount = Object.keys(counts).length;
  const balanceScore = hasAll ? 90 : Math.max(40, presentCount * 20);
  const missing = ELEMENT_KEYS.filter((e) => !counts[e]);
  const missingText = missing.length > 0
    ? `缺${missing.join('、')}，需在生活中补益`
    : '五行俱全，无需额外补益';

  const balance = hasAll
    ? `五行俱全（${ELEMENT_KEYS.map((e) => `${e}${counts[e] || 0}`).join('·')}），气运流通，五德兼备`
    : `五行涵盖${presentCount}种（${Object.keys(counts).map((e) => `${e}${counts[e]}`).join('·')}），${missingText}`;

  return {
    balance,
    score: balanceScore,
    details: [
      { grid: '天格', element: sd.tianWuxing },
      { grid: '人格', element: sd.renWuxing },
      { grid: '地格', element: sd.diWuxing },
      { grid: '外格', element: sd.waiWuxing },
      { grid: '总格', element: sd.zongWuxing },
    ],
    missing,
  };
}

function buildZiyi(surname: string, givenName: string): AnalysisPhase['ziyi'] {
  const surChars = surname.split('');
  const givChars = givenName.split('');

  const buildChar = (c: string, position: string): ZiyiChar => {
    const strokes = getKangxiStroke(c);
    const wuxing = getHanziWuxing(strokes);
    const wuxingDesc = ELEMENT_PERSONALITY[wuxing] || '五行平和中正';
    let role = '';
    if (position === 'surname') {
      role = `作为姓氏承载家族渊源，笔画${strokes}画决定天格数理，影响先天运势与祖上福荫`;
    } else if (position === 'first') {
      role = `作为名字首字，笔画${strokes}画主导人格能量走向，五行属${wuxing}，${wuxingDesc}`;
    } else {
      role = `作为名字尾字，笔画${strokes}画收束地格之气，五行属${wuxing}影响晚年运程，${wuxingDesc}`;
    }
    return {
      char: c,
      strokes,
      wuxing,
      analysis: `"${c}"——康熙字典${strokes}画，五行属${wuxing}。${role}。`,
    };
  };

  const surnameAnalysis = surChars.map((c) => buildChar(c, 'surname'));
  const givenAnalysis = givChars.map((c, i) => buildChar(c, i === 0 ? 'first' : 'last'));

  const overall = `名字"${givenName}"由${givChars.join('、')}组成，五行分别为${givenAnalysis.map((g) => g.wuxing).join('、')}。笔画节奏为${givenAnalysis.map((g) => g.strokes).join('-')}画，整体字义积极，寓意美好。`;

  return { surname: surnameAnalysis, givenName: givenAnalysis, overall };
}

function buildYinlv(surname: string, givenName: string): string {
  const fullName = surname + givenName;
  const chars = fullName.split('');
  const charCount = chars.length;

  const strokeDesc = chars.map((c, i) => {
    const s = getKangxiStroke(c);
    return `"${c}"(${s}画)`;
  }).join(' → ');

  return `姓"${surname}"与名"${givenName}"组成"${fullName}"，共${charCount}个汉字。
叠音结构为：${strokeDesc}。
在中国传统音韵学中，姓名的读音和谐直接影响其传播力与第一印象。${charCount}字姓名形成${charCount === 2 ? '双' : charCount === 3 ? '三' : '多'}音节节奏，各字笔画疏密变化带来视觉韵律，而平仄声调的起伏则增强听觉美感。该名字读起来整体协调，具有较好的辨识度和传诵力。`;
}

function buildHarmony(sd: StrokeData, sancai: SancaiResult, wuxing: WuxingBalance): string {
  const tianRen = getInteraction(sd.tianWuxing, sd.renWuxing);
  const renDi = getInteraction(sd.renWuxing, sd.diWuxing);
  const tianDi = getInteraction(sd.tianWuxing, sd.diWuxing);

  const gridAuspiciousCount = [sd.tianAusp, sd.renAusp, sd.diAusp, sd.waiAusp, sd.zongAusp]
    .filter((a) => a.isAuspicious).length;

  let harmonyLevel = '';
  if (gridAuspiciousCount >= 4 && sancai.isAuspicious && wuxing.score >= 80) {
    harmonyLevel = '高度协调';
  } else if (gridAuspiciousCount >= 3 && sancai.isAuspicious) {
    harmonyLevel = '总体协调';
  } else if (gridAuspiciousCount >= 2) {
    harmonyLevel = '部分协调，存在改进空间';
  } else {
    harmonyLevel = '多处不协调，建议调整';
  }

  return `整体协调性分析（${harmonyLevel}）：

一、天格(${sd.tianWuxing})与人格(${sd.renWuxing})关系：${getInteractionText(tianRen)}
天格代表先天运势与祖辈环境，人格代表个人主体运势。${tianRen === '生' ? `天格生人格，祖上福荫直接助益个人发展，先天条件优越。` : tianRen === '被生' ? `人格生天格，个人发展能反哺家族运势，祖孙关系融洽。` : tianRen === '克' ? `天格克人格，祖辈环境可能对个人形成压制，需以自身努力突破先天限制。` : tianRen === '被克' ? `人格克天格，个人发展可能与家族期望有冲突，需妥善平衡。` : `天格与人格比和，先天条件与个人发展步调一致，关系稳定。`}

二、人格(${sd.renWuxing})与地格(${sd.diWuxing})关系：${getInteractionText(renDi)}
人格主管中年运势，地格影响青少年成长和晚年家庭。${renDi === '生' ? `人格生地格，个人努力能够为子女后代创造良好条件，晚年运势有保障。` : renDi === '被生' ? `地格生人格，家庭环境和子女缘份对个人发展有积极助益。` : renDi === '克' ? `人格克地格，事业发展可能影响家庭生活质量，需注意工作与家庭的平衡。` : renDi === '被克' ? `地格克人格，家庭事务可能拖累个人发展，需协调家庭与事业的关系。` : `人格与地格比和，事业与家庭步调一致，生活平衡。`}

三、三才配置(${sancai.config})：${sancai.isAuspicious ? '天、人、地三格互动正向，形成良性循环' : '三格之间存在不和谐因素，需关注对应方面'}

四、五行平衡：五格覆盖${5 - wuxing.missing.length}种元素，${wuxing.missing.length > 0 ? `缺失${wuxing.missing.join('、')}，需通过字义、颜色或饰品补益` : '元素齐全，能量流通顺畅'}

五、总体评价：${gridAuspiciousCount}/5格为吉，三才${sancai.isAuspicious ? '和谐' : '不和谐'}，五行${wuxing.score >= 80 ? '均衡' : wuxing.score >= 60 ? '较均衡' : '需补益'}。${harmonyLevel === '高度协调' ? '姓名整体结构优良，各方面配合紧密，运势发展顺畅。' : harmonyLevel === '总体协调' ? '姓名整体尚可，大部分配置得当，局部微调可进一步提升。' : harmonyLevel === '部分协调，存在改进空间' ? '姓名存在一定不协调因素，建议针对性地调整相关配置。' : '姓名多处配置不理想，建议综合考虑改名方案。'}`;
}

// ============================================================
// EVALUATION PHASE BUILDER
// ============================================================

function buildEvaluation(sd: StrokeData, sancai: SancaiResult, wuxing: WuxingBalance): EvaluationPhase {
  let score = 0;
  score += sd.tianAusp.isAuspicious ? 10 : 4;
  score += sd.renAusp.isAuspicious ? 25 : 10;
  score += sd.diAusp.isAuspicious ? 20 : 8;
  score += sd.waiAusp.isAuspicious ? 15 : 6;
  score += sd.zongAusp.isAuspicious ? 15 : 6;
  score += sancai.isAuspicious ? 10 : 3;
  score += Math.round(wuxing.score / 15);

  let rating = '';
  if (score >= 85) rating = '大吉';
  else if (score >= 70) rating = '吉';
  else if (score >= 55) rating = '中吉';
  else if (score >= 40) rating = '平';
  else rating = '凶';

  const zongStrokes = sd.zongStrokes;
  const luckyNums = [1, 6].includes(zongStrokes % 10) ? [1, 6] :
    [2, 7].includes(zongStrokes % 10) ? [2, 7] :
    [3, 8].includes(zongStrokes % 10) ? [3, 8] :
    [4, 9].includes(zongStrokes % 10) ? [4, 9] : [5, 0];

  const luckyColors = ELEMENT_COLORS[sd.renWuxing] || ['红色', '金色'];

  const pros: string[] = [];
  const cons: string[] = [];
  const potentialIssues: string[] = [];

  // --- Pros / Cons ---
  if (sd.tianAusp.isAuspicious) {
    pros.push(`天格${sd.tianStrokes}画·${sd.tianWuxing}·${sd.tianAusp.meaning}（吉）：先天运势优良，祖上福荫深厚，易得长辈提携。`);
  } else {
    cons.push(`天格${sd.tianStrokes}画·${sd.tianWuxing}·${sd.tianAusp.meaning}（不吉）：先天运势偏弱，家族支持可能不足。`);
  }

  if (sd.renAusp.isAuspicious) {
    pros.push(`人格${sd.renStrokes}画·${sd.renWuxing}·${sd.renAusp.meaning}（吉）：此为姓名核心，代表优秀的性格特质和个人能力，中年运势强劲。`);
  } else {
    cons.push(`人格${sd.renStrokes}画·${sd.renWuxing}·${sd.renAusp.meaning}（不吉）：姓名核心不吉，可能导致性格偏执、事业波折、人际关系紧张，是优先需要修正的问题。`);
  }

  if (sd.diAusp.isAuspicious) {
    pros.push(`地格${sd.diStrokes}画·${sd.diWuxing}·${sd.diAusp.meaning}（吉）：青少年运势顺利，家庭关系和子女缘分良好。`);
  } else {
    cons.push(`地格${sd.diStrokes}画·${sd.diWuxing}·${sd.diAusp.meaning}（不吉）：青少年时期可能波折较多，家庭关系和子女缘份需用心经营。`);
  }

  if (sd.waiAusp.isAuspicious) {
    pros.push(`外格${sd.waiStrokes}画·${sd.waiWuxing}·${sd.waiAusp.meaning}（吉）：社交能力强，外部环境有利，易得贵人相助。`);
  } else {
    cons.push(`外格${sd.waiStrokes}画·${sd.waiWuxing}·${sd.waiAusp.meaning}（不吉）：社交圈较窄，缺少贵人提携，需更多依靠自身实力。`);
  }

  if (sd.zongAusp.isAuspicious) {
    pros.push(`总格${sd.zongStrokes}画·${sd.zongWuxing}·${sd.zongAusp.meaning}（吉）：中晚年运势良好，人生终得圆满。`);
  } else {
    cons.push(`总格${sd.zongStrokes}画·${sd.zongWuxing}·${sd.zongAusp.meaning}（不吉）：中晚年可能面临挑战，需提前规划准备。`);
  }

  if (sancai.isAuspicious) {
    pros.push(`三才${sancai.config}（吉）：天、人、地三格五行和谐，人生各阶段获得天时地利人和的助力。`);
  } else {
    cons.push(`三才${sancai.config}（不吉）：天、人、地三格五行冲突，可能导致健康问题或事业阻碍。`);
  }

  if (wuxing.score >= 80) {
    pros.push(`五行${wuxing.balance}（优）：元素齐全分布均衡，运势加成全面，性格多面均衡。`);
  } else if (wuxing.score >= 60) {
    pros.push(`五行${wuxing.balance}（良）：大部分元素覆盖，不会出现严重相克冲突。`);
  } else {
    cons.push(`五行方面：${wuxing.balance}（需要补益），元素不均衡影响运势和性格发展。`);
  }

  if (pros.length === 0) {
    pros.push('姓名整体结构尚可，虽各方面有改进空间但并非毫无可取之处。');
  }
  if (cons.length === 0) {
    cons.push('当前姓名整体优良，暂未发现明显缺陷，建议继续保持。');
  }

  // --- Potential Issues ---
  if (sd.tianAusp.isAuspicious) {
    if (sd.tianWuxing === sd.renWuxing) {
      potentialIssues.push(`天格与人格五行同属${sd.tianWuxing}，虽然比和稳定，但缺乏活力激发，可能导致性格偏于保守、进取心不足。`);
    }
  } else {
    potentialIssues.push(`天格不吉（${sd.tianAusp.meaning}），虽先天运势偏弱但并非不可改变。通过人格的强大和后天努力，完全可以弥补天格的不足。需注意早期教育的重要性，培养良好的学习和生活习惯。`);
  }

  if (!sd.renAusp.isAuspicious) {
    potentialIssues.push(`人格不吉（${sd.renAusp.meaning}）是优先需要关注的问题。人格代表一生主运，其不吉可能导致：性格上出现固执或急躁倾向；事业上起伏不定难得安定；人际关系中容易产生摩擦。${sd.renWuxing}在人格中起主导作用，${ELEMENT_PERSONALITY[sd.renWuxing] || ''}，建议通过改名优先修正人格数理。`);
  }

  if (!sd.diAusp.isAuspicious) {
    potentialIssues.push(`地格不吉（${sd.diAusp.meaning}）影响青少年时期成长和晚年家庭生活。青少年阶段需特别注意家庭教育和心理健康，培养坚韧的品格。将来与子女相处时，教育方式上需要更多耐心和沟通，避免因期望过高或管教过严引发代际矛盾。`);
  }

  if (!sd.zongAusp.isAuspicious) {
    potentialIssues.push(`总格不吉（${sd.zongAusp.meaning}），建议在青壮年时期提前规划：建立稳健的财务体系、购买适当的保险保障、培养多元化收入来源，以应对晚年可能出现的变数。`);
  }

  if (!sancai.isAuspicious) {
    const tiRenRel = getInteraction(sd.tianWuxing, sd.renWuxing);
    const renDiRel = getInteraction(sd.renWuxing, sd.diWuxing);
    if (tiRenRel === '克' || tiRenRel === '被克') {
      potentialIssues.push(`天格(${sd.tianWuxing})与人格(${sd.renWuxing})${tiRenRel === '克' ? '天克人' : '人克天'}：可能表现为与长辈或上级关系紧张，职业发展中来自上层的支持不足。建议在职场中特别注意与上级的沟通方式，同时增强自身独立性。`);
    }
    if (renDiRel === '克' || renDiRel === '被克') {
      potentialIssues.push(`人格(${sd.renWuxing})与地格(${sd.diWuxing})${renDiRel === '克' ? '人克地' : '地克人'}：事业发展和家庭生活可能难以两全。人到中年需特别注意工作与家庭的平衡，避免因事业忽视家庭或家庭事务干扰事业发展。`);
    }
  }

  if (wuxing.missing.length > 0) {
    const healthNotes = wuxing.missing.map((e) => `${e}(${ELEMENT_HEALTH[e] || ''})`).join('、');
    potentialIssues.push(`五行缺失：缺少${wuxing.missing.join('、')}元素。从健康角度看，对应器官系统（${healthNotes}）可能较为薄弱，需定期体检并注意日常养护。可在着装、饰品、家居中使用${wuxing.missing.map((e) => ELEMENT_COLORS[e]?.[0] || '').filter(Boolean).join('、')}色系来补益所缺元素。`);
  } else {
    potentialIssues.push(`五行齐全值得肯定，但需注意各元素间的平衡而非单纯的"全"。如果某种元素在名字中过于集中，可能导致该方面性格特征过度表现。建议观察自己在实际生活中是否存在某方面过于突出或不足的情况，以进行针对性的微调。`);
  }

  return { overallScore: score, rating, pros, cons, potentialIssues, lucky: { numbers: luckyNums, colors: luckyColors } };
}

// ============================================================
// SUGGESTION PHASE BUILDER
// ============================================================

function buildSuggestions(input: NameInput, evaluation: EvaluationPhase): SuggestionItem[] {
  const { surname, gender } = input;
  const pool = [...(gender === 'male' ? MALE_CHARS : FEMALE_CHARS), ...NEUTRAL_CHARS];

  interface Candidate {
    givenName: string;
    score: number;
    eval: EvaluationPhase;
    sd: StrokeData;
  }

  const candidates: Candidate[] = [];
  const originalScore = evaluation.overallScore;

  for (let i = 0; i < pool.length; i++) {
    for (let j = 0; j < pool.length; j++) {
      if (i === j) continue;
      const givenName = pool[i] + pool[j];
      const sd = computeStrokes({ surname, givenName, gender });
      const sancai = analyzeSancai(sd.tianStrokes, sd.renStrokes, sd.diStrokes);
      const wuxing = buildWuxingBalance(sd);
      const evalPhase = buildEvaluation(sd, sancai, wuxing);
      if (evalPhase.overallScore > originalScore) {
        candidates.push({ givenName, score: evalPhase.overallScore, eval: evalPhase, sd });
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const selected: Candidate[] = [];
  for (const c of candidates) {
    if (seen.has(c.givenName)) continue;
    seen.add(c.givenName);
    selected.push(c);
    if (selected.length >= 5) break;
  }

  return selected.map((c) => {
    const reasons: string[] = [];
    const improvements: string[] = [];

    if (!evaluation.pros.some((p) => p.includes('天格')) && c.eval.pros.some((p) => p.includes('天格'))) {
      reasons.push('原名字天格不吉');
      improvements.push(`天格转为${c.sd.tianAusp.meaning}（${c.sd.tianStrokes}画/吉），先天运势得到改善`);
    }
    if (!evaluation.pros.some((p) => p.includes('人格')) && c.eval.pros.some((p) => p.includes('人格'))) {
      reasons.push('原名字人格不吉（姓名核心缺陷）');
      improvements.push(`人格转为${c.sd.renAusp.meaning}（${c.sd.renStrokes}画/吉），主运得到根本改善`);
    }
    if (!evaluation.pros.some((p) => p.includes('地格')) && c.eval.pros.some((p) => p.includes('地格'))) {
      reasons.push('原名字地格不吉');
      improvements.push(`地格转为${c.sd.diAusp.meaning}（${c.sd.diStrokes}画/吉），青少年运和家庭运得到改善`);
    }
    if (!evaluation.pros.some((p) => p.includes('外格')) && c.eval.pros.some((p) => p.includes('外格'))) {
      reasons.push('原名字外格不吉');
      improvements.push(`外格转为${c.sd.waiAusp.meaning}（${c.sd.waiStrokes}画/吉），社交运和贵人运得到改善`);
    }
    if (!evaluation.pros.some((p) => p.includes('总格')) && c.eval.pros.some((p) => p.includes('总格'))) {
      reasons.push('原名字总格不吉');
      improvements.push(`总格转为${c.sd.zongAusp.meaning}（${c.sd.zongStrokes}画/吉），晚年运势得到改善`);
    }
    if (!evaluation.pros.some((p) => p.includes('三才')) && c.eval.pros.some((p) => p.includes('三才'))) {
      reasons.push('原名字三才配置不和谐');
      improvements.push(`三才配置转为${c.eval.pros.find((p) => p.includes('三才'))?.match(/三才(\S+)/)?.[1] || '吉'}，天地人格局得到改善`);
    }
    if (reasons.length === 0) {
      reasons.push('原名字整体评分偏低');
    }
    if (improvements.length === 0) {
      improvements.push(`整体评分从${originalScore}分提升至${c.score}分，评级${c.eval.rating}`);
    }

    const scoreDiff = c.score - originalScore;
    if (scoreDiff > 0 && improvements.length > 0) {
      improvements.push(`综合评分从${originalScore}分提升至${c.score}分（+${scoreDiff}），评级达${c.eval.rating}`);
    }

    return {
      name: surname + c.givenName,
      reason: reasons.join('；'),
      improvement: improvements.join('；'),
      score: c.score,
    };
  });
}

// ============================================================
// CORE COMPUTE (internal, no suggestion generation)
// ============================================================

function computeCore(input: NameInput): { analysis: AnalysisPhase; evaluation: EvaluationPhase } {
  const { surname, givenName } = input;

  const sd = computeStrokes(input);
  const sancai = analyzeSancai(sd.tianStrokes, sd.renStrokes, sd.diStrokes);
  const wuxing = buildWuxingBalance(sd);
  const kangxiStrokes = buildKangxi(surname, givenName);
  const ziyi = buildZiyi(surname, givenName);
  const yinlv = buildYinlv(surname, givenName);
  const harmony = buildHarmony(sd, sancai, wuxing);
  const evaluation = buildEvaluation(sd, sancai, wuxing);

  const analysis: AnalysisPhase = {
    fullName: surname + givenName,
    wuge: sd.wuge,
    sancai,
    kangxiStrokes,
    wuxing,
    ziyi,
    yinlv,
    harmony,
  };

  return { analysis, evaluation };
}

// ============================================================
// PUBLIC API
// ============================================================

export function analyzeName(input: NameInput): NameAnalysisResult {
  const { analysis, evaluation } = computeCore(input);
  const suggestions = buildSuggestions(input, evaluation);
  return { analysis, evaluation, suggestions };
}

export function suggestNames(surname: string, gender: 'male' | 'female', count: number): { name: string; score: number }[] {
  const pool = [...(gender === 'male' ? MALE_CHARS : FEMALE_CHARS), ...NEUTRAL_CHARS];

  interface Candidate { name: string; score: number }
  const candidates: Candidate[] = [];

  for (const c1 of pool) {
    for (const c2 of pool) {
      if (c1 === c2) continue;
      const givenName = c1 + c2;
      const { evaluation } = computeCore({ surname, givenName, gender });
      candidates.push({ name: surname + c1 + c2, score: evaluation.overallScore });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, count);
}
