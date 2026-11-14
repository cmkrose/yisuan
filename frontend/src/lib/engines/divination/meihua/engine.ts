import { HEXAGRAMS } from '../liuyao/hexagram-data';
import { Solar } from 'lunar-javascript';

export interface MeihuaResult {
  method: string;
  upperGua: { id: number; name: string; element: string };
  lowerGua: { id: number; name: string; element: string };
  movingYao: number;
  hexagramId: number;
  hexagramName: string;
  symbol: string;
  bodyGua: string;
  yongGua: string;
  bodyYongRelation: string;
  interpretation: string;
}

const BAGUA = ['乾','兑','离','震','巽','坎','艮','坤'];
const BAGUA_ELEMENT: Record<string, string> = { 乾:'金',兑:'金',离:'火',震:'木',巽:'木',坎:'水',艮:'土',坤:'土' };
const BAGUA_ID: Record<string, number> = { 乾:1,兑:58,离:30,震:51,巽:57,坎:29,艮:52,坤:2 };

const ELEMENT_RELATION: Record<string, Record<string, string>> = {
  金:{金:'比和',木:'克出',水:'生出',火:'受克',土:'受生'},
  木:{金:'受克',木:'比和',水:'受生',火:'生出',土:'克出'},
  水:{金:'受生',木:'生出',水:'比和',火:'克出',土:'受克'},
  火:{金:'克出',木:'受生',水:'受克',火:'比和',土:'生出'},
  土:{金:'生出',木:'受克',水:'克出',火:'受生',土:'比和'},
};

function getHexByNum(n: number): number {
  const idx = (n - 1) % 8;
  const gua = BAGUA[idx];
  return BAGUA_ID[gua] || 1;
}

export function timeDivination(date: Date): MeihuaResult {
  // 通行时间起卦：上卦=(年支序+农历月+农历日)%8，下卦再加时支序，动爻=总数%6。
  const lunar = Solar.fromDate(date).getLunar();
  const yearZhi = '子丑寅卯辰巳午未申酉戌亥'.indexOf(lunar.getYearInGanZhi()[1]) + 1;
  const lunarMonth = Math.abs(lunar.getMonth());
  const lunarDay = lunar.getDay();
  const hourZhi = (Math.floor((date.getHours() + 1) / 2) % 12) + 1;

  const upperNum = (yearZhi + lunarMonth + lunarDay) % 8 || 8;
  const total = yearZhi + lunarMonth + lunarDay + hourZhi;
  const lowerNum = total % 8 || 8;
  const movingNum = total % 6 || 6;

  return buildMeihuaResult('时间起卦', getHexByNum(upperNum), getHexByNum(lowerNum), movingNum);
}

export function numberDivination(nums: number[]): MeihuaResult {
  const a = nums[0] || 1, b = nums[1] || 2, c = nums[2] || 3;
  return buildMeihuaResult('数字起卦', getHexByNum(a), getHexByNum(b), c % 6 || 6);
}

export function nameDivination(chars: string): MeihuaResult {
  let strokeTotal = 0;
  for (const c of chars) {
    const code = c.charCodeAt(0);
    if (code >= 0x4e00 && code <= 0x9fff) strokeTotal += (code - 0x4e00) % 23 + 1;
    else strokeTotal += code % 10 + 1;
  }
  const upper = (chars.charCodeAt(0) % 8) || 8;
  const lower = (chars.charCodeAt(chars.length - 1) % 8) || 8;
  const moving = (strokeTotal % 6) || 6;
  return buildMeihuaResult('姓名起卦（娱乐玩法：按字符编码取数，非笔画）', getHexByNum(upper), getHexByNum(lower), moving);
}

function buildMeihuaResult(method: string, upperId: number, lowerId: number, movingYao: number): MeihuaResult {
  const upperGua = BAGUA[Object.values(BAGUA_ID).indexOf(upperId) % 8] || '乾';
  const lowerGua = BAGUA[Object.values(BAGUA_ID).indexOf(lowerId) % 8] || '乾';

  // Find combined hexagram
  const lowerName = HEXAGRAMS[lowerId]?.lower || '乾';
  const upperName = HEXAGRAMS[upperId]?.upper || '乾';
  let hexId = 1;
  for (let i = 1; i <= 64; i++) {
    if (HEXAGRAMS[i].upper === upperName && HEXAGRAMS[i].lower === lowerName) {
      hexId = i; break;
    }
  }

  const hexagram = HEXAGRAMS[hexId] || HEXAGRAMS[1];
  // 体用：动爻所在卦为「用」，另一卦为「体」。
  const bodyGua = movingYao <= 3 ? upperGua : lowerGua;
  const yongGua = movingYao <= 3 ? lowerGua : upperGua;
  const bodyEl = BAGUA_ELEMENT[bodyGua];
  const yongEl = BAGUA_ELEMENT[yongGua];
  const relation = ELEMENT_RELATION[bodyEl]?.[yongEl] || '比和';

  const relationMeaning: Record<string, string> = {
    '比和':'体用比和，诸事顺遂，大吉大利。',
    '生出':'体生用，有损耗，事可成但有耗泄。',
    '受生':'用生体，有增益，运势上升得人帮助。',
    '克出':'体克用，事可成但费力，需努力争取。',
    '受克':'用克体，诸事不顺，宜退守不宜进取。',
  };

  return {
    method,
    upperGua: { id: upperId, name: upperGua, element: BAGUA_ELEMENT[upperGua] },
    lowerGua: { id: lowerId, name: lowerGua, element: BAGUA_ELEMENT[lowerGua] },
    movingYao,
    hexagramId: hexId,
    hexagramName: hexagram.name,
    symbol: hexagram.symbol,
    bodyGua,
    yongGua,
    bodyYongRelation: relation,
    interpretation: `${relationMeaning[relation] || ''} 本卦${hexagram.name}，动爻第${movingYao}爻。`,
  };
}
