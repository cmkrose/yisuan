import {
  HEAVENLY_STEMS, EARTHLY_BRANCHES, PALACES,
  TianGan, DiZhi, Star, Palace, PalaceName, ZiweiResult,
} from './constants';

const ziweiRelPos  = [0, -1, -2, -3, -4, -5];
const tianjiRelPos  = [0, -1, 2, -3, 4, -5];
const taiyangRelPos = [0, -3, 2, -5, 4, -1];
const wuquRelPos    = [0, -4, 2, -1, 4, -3];
const tiantongRelPos= [0, -5, 2, -3, 4, -1];
const lianzhenRelPos= [0, 4, 2, -5, -3, -1];

const tianfuStars: string[] = ['天府','太阴','贪狼','巨门','天相','天梁','七杀','破军'];

const wuxingJuTable: Record<string, string> = {
  '甲子': '金四局','乙丑': '金四局','丙寅': '火六局','丁卯': '火六局','戊辰': '木三局','己巳': '木三局',
  '庚午': '土五局','辛未': '土五局','壬申': '金四局','癸酉': '金四局',
  '甲戌': '火六局','乙亥': '火六局','丙子': '水二局','丁丑': '水二局','戊寅': '土五局','己卯': '土五局',
  '庚辰': '金四局','辛巳': '金四局','壬午': '木三局','癸未': '木三局',
  '甲申': '水二局','乙酉': '水二局','丙戌': '土五局','丁亥': '土五局','戊子': '火六局','己丑': '火六局',
  '庚寅': '木三局','辛卯': '木三局','壬辰': '水二局','癸巳': '水二局',
  '甲午': '金四局','乙未': '金四局','丙申': '火六局','丁酉': '火六局','戊戌': '木三局','己亥': '木三局',
  '庚子': '土五局','辛丑': '土五局','壬寅': '金四局','癸卯': '金四局',
  '甲辰': '火六局','乙巳': '火六局','丙午': '水二局','丁未': '水二局','戊申': '土五局','己酉': '土五局',
  '庚戌': '金四局','辛亥': '金四局','壬子': '木三局','癸丑': '木三局',
  '甲寅': '水二局','乙卯': '水二局','丙辰': '土五局','丁巳': '土五局','戊午': '火六局','己未': '火六局',
  '庚申': '木三局','辛酉': '木三局','壬戌': '水二局','癸亥': '水二局',
};

const ziweiTables: Record<number, number[]> = {
  2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],
  3: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 0, 0, 1, 1, 2, 2],
  4: [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9],
  5: [0, 6, 0, 6, 1, 7, 0, 6, 1, 7, 1, 7, 2, 8, 1, 7, 2, 8, 2, 8, 3, 9, 2, 8, 3, 9, 3, 9, 4, 10],
  6: [0, 0, 6, 6, 0, 6, 1, 7, 0, 6, 1, 7, 1, 7, 2, 8, 1, 7, 2, 8, 2, 8, 3, 9, 2, 8, 3, 9, 3, 9],
};

export function calculateZiwei(
  birthYear: number, birthMonth: number, birthDay: number,
  birthHour: number, gender: 'male' | 'female',
): ZiweiResult {
  const ysi = (birthYear - 4) % 10, ybi = (birthYear - 4) % 12;
  const ys = HEAVENLY_STEMS[(ysi + 10) % 10], yb = EARTHLY_BRANCHES[(ybi + 12) % 12];

  const monthBranchIdx = (birthMonth + 1) % 12;
  const lifeBranchIdx = ((2 + birthMonth - 1 - birthHour + 12) % 12 + 12) % 12;
  const lifeBranch = EARTHLY_BRANCHES[lifeBranchIdx];
  const bodyBranchIdx = ((2 + birthMonth - 1 + birthHour + 12) % 12 + 12) % 12;
  const bodyBranch = EARTHLY_BRANCHES[bodyBranchIdx];

  // Palace stems
  const yiIdx = EARTHLY_BRANCHES.indexOf('寅');
  const yiStemForYear: Record<string, number> = { 甲:0, 己:0, 乙:2, 庚:2, 丙:4, 辛:4, 丁:6, 壬:6, 戊:8, 癸:8 };
  const yiStemIdx = yiStemForYear[ys] || 0;
  const palaceStems: TianGan[] = [];
  for (let i = 0; i < 12; i++) {
    palaceStems.push(HEAVENLY_STEMS[(yiStemIdx + i) % 10]);
  }

  // Build 12 palaces
  const palaces: Palace[] = [];
  for (let i = 0; i < 12; i++) {
    const bi = (lifeBranchIdx + i) % 12;
    palaces.push({
      name: PALACES[0],
      branch: EARTHLY_BRANCHES[bi],
      stem: palaceStems[(bi - yiIdx + 12) % 12],
      majorStars: [],
      minorStars: [],
      isBodyPalace: bi === bodyBranchIdx,
      majorLimit: null,
    });
  }
  for (let i = 0; i < 12; i++) {
    palaces[i].name = PALACES[i];
  }

  // Five Element Bureau
  const gongSg = palaces[0].stem + palaces[0].branch;
  const bureau = wuxingJuTable[gongSg] || '水二局';
  const bureauNum = parseInt(bureau.match(/\d/)![0]);

  // Ziwei position
  const div = Math.floor(birthDay / bureauNum);
  const rem = birthDay % bureauNum;
  const zwTable = ziweiTables[bureauNum] || ziweiTables[5];
  const ziweiOffset = rem === 0 ? zwTable[Math.min(div - 1, zwTable.length - 1)] : zwTable[Math.min(div, zwTable.length - 1)];
  const ziweiBranchIdx = (lifeBranchIdx - ziweiOffset + 0 + 12) % 12;

  // Place 14 major stars
  placeMajorStars(palaces, ziweiBranchIdx, div, rem, bureauNum);

  // Place auxiliary stars
  const hsi = EARTHLY_BRANCHES.indexOf(palaces[5].branch); // 疾厄 branch index
  const ysiVal = HEAVENLY_STEMS.indexOf(ys);

  placeAuxStars(palaces, ysiVal, birthMonth, birthHour, lifeBranchIdx);

  // Determine body palace
  const bodyPalace = PALACES[(bodyBranchIdx - lifeBranchIdx + 0 + 12) % 12];

  // Major cycles
  const isYang = (HEAVENLY_STEMS.indexOf(ys)) % 2 === 0;
  const forward = (isYang && gender === 'male') || (!isYang && gender === 'female');
  const majorCycles = calcMajorCycles(palaces, forward, bureauNum);

  return {
    palaces,
    bodyPalace,
    fiveElementBureau: bureau,
    majorCycles,
    currentCycle: getCurrentCycle(majorCycles, birthYear),
  };
}

function placeMajorStars(palaces: Palace[], zwi: number, div: number, rem: number, bureau: number) {
  const totalPalaces = 12;
  const offset = (idx: number) => ((idx % totalPalaces) + totalPalaces) % totalPalaces;

  const ziweiStarsRel: Record<number, { star: string; offset: number }[]> = {
    0: [{ star: '紫微', offset: 0 }, { star: '天机', offset: -1 }, { star: '', offset: -2 },
         { star: '太阳', offset: -3 }, { star: '武曲', offset: -4 }, { star: '天同', offset: -5 },
         { star: '廉贞', offset: 4 }],
  };

  const zwRel = ziweiStarsRel[0];
  for (const s of zwRel) {
    if (!s.star) continue;
    const pi = offset(zwi + s.offset);
    palaces[pi].majorStars.push({ name: s.star as any, brightness: '平', isMajor: true });
  }

  // Tianfu position - opposite to Ziwei + some offset
  const tfOffset = (3 - (div % bureau === 0 ? div - 1 : div)) % 2 === 0 ? 4 : 5;
  const tianfuIdx = offset(zwi + 4);

  const tfRel = [
    { star: '天府', offset: 0 }, { star: '太阴', offset: 1 }, { star: '贪狼', offset: 2 },
    { star: '巨门', offset: 3 }, { star: '天相', offset: 4 }, { star: '天梁', offset: 5 },
    { star: '七杀', offset: 6 }, { star: '破军', offset: 10 },
  ];

  for (const s of tfRel) {
    const pi = offset(tianfuIdx + s.offset);
    palaces[pi].majorStars.push({ name: s.star as any, brightness: '平', isMajor: true });
  }

  // Mark brightness
  setBrightness(palaces);
}

function setBrightness(palaces: Palace[]) {
  const brightnessMap: Record<string, number[]> = {
    紫微: [0,1,3,5,7,8,9,11],
    天府: [0,1,2,3,4,5,6,9,10,11],
    天机: [1,3,5,6,8],
    太阳: [3,5,6,7],
    武曲: [3,4,7,8,11],
    天同: [1,6,7,8],
    廉贞: [1,5,8],
    太阴: [1,7,8,11],
    贪狼: [1,3,8],
    巨门: [3,5,8],
    天相: [3,5,8],
    天梁: [3,5,8],
    七杀: [1,5,9],
    破军: [3,7],
  };

  for (let i = 0; i < 12; i++) {
    for (const star of palaces[i].majorStars) {
      const good = brightnessMap[star.name] || [];
      if (good.includes(i)) star.brightness = '庙';
      else star.brightness = '平';
    }
  }
}

function placeAuxStars(palaces: Palace[], yearStemIdx: number, month: number, hour: number, lifeIdx: number) {
  const total = 12;
  const offset = (i: number) => ((i % total) + total) % total;

  const auxData: { star: string; position: (name: string) => number | null; brightness: string }[] = [
    { star: '文昌', position: () => offset(10 - hour + 0), brightness: '平' },
    { star: '文曲', position: () => offset(4 - hour + 0), brightness: '平' },
    { star: '左辅', position: () => offset(4 + (month - 1) + 0), brightness: '平' },
    { star: '右弼', position: () => offset(10 - (month - 1) + 0), brightness: '平' },
    { star: '天魁', position: () => {
      const pos = [2, 0, 10, 8, 2, 0, 8, 6, 4, 2];
      return offset(pos[yearStemIdx] + lifeIdx);
    }, brightness: '平' },
    { star: '天钺', position: () => {
      const pos = [8, 6, 4, 2, 8, 6, 2, 0, 10, 8];
      return offset(pos[yearStemIdx] + lifeIdx);
    }, brightness: '平' },
    { star: '禄存', position: () => {
      const pos = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
      return offset(pos[yearStemIdx] + lifeIdx);
    }, brightness: '平' },
    { star: '天马', position: () => {
      // Based on year branch, placed at specific branches relative to life palace
      const tianmaByBranch: Record<string, number> = {
        寅:0, 午:0, 戌:0, 申:6, 子:6, 辰:6, 巳:3, 酉:3, 丑:3, 亥:9, 卯:9, 未:9,
      };
      const bi = (new Date().getFullYear() - 4) % 12;
      const yBranch = EARTHLY_BRANCHES[(bi + 12) % 12];
      return (tianmaByBranch[yBranch] || 0) % 12;
    }, brightness: '平' },
    { star: '擎羊', position: () => {
      const pos = [4, 5, 6, 7, 8, 9, 10, 11, 0, 1];
      return offset(pos[yearStemIdx] + lifeIdx);
    }, brightness: '陷' },
    { star: '陀罗', position: () => {
      const pos = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      return offset(pos[yearStemIdx] + lifeIdx);
    }, brightness: '陷' },
    { star: '火星', position: () => {
      const hsi = hour;
      return offset((hsi < 12 ? (11 - hsi) : (23 - hsi)) + lifeIdx);
    }, brightness: '陷' },
    { star: '铃星', position: () => {
      const hsi = hour;
      return offset((hsi < 12 ? (11 - hsi + 6) : (23 - hsi + 6)) + lifeIdx);
    }, brightness: '陷' },
    { star: '地空', position: () => {
      return offset(11 - hour + lifeIdx);
    }, brightness: '陷' },
    { star: '地劫', position: () => {
      return offset(11 - hour + 6 + lifeIdx);
    }, brightness: '陷' },
    { star: '擎羊', position: () => offset(lifeIdx + 3), brightness: '陷' },
  ];

  for (const aux of auxData) {
    for (let attempt = 0; attempt < 1; attempt++) {
      const pos = aux.position?.(aux.star);
      if (pos !== null && pos !== undefined) {
        // Check if already exists
        const exists = palaces[pos].minorStars.some(s => s.name === aux.star);
        if (!exists) {
          palaces[pos].minorStars.push({
            name: aux.star as any,
            brightness: aux.brightness as any,
            isMajor: false,
          });
        }
      }
    }
  }

  // Remove duplicates by name
  for (let i = 0; i < 12; i++) {
    const seen = new Set<string>();
    palaces[i].minorStars = palaces[i].minorStars.filter(s => {
      if (seen.has(s.name)) return false;
      seen.add(s.name);
      return true;
    });
  }
}

function calcMajorCycles(palaces: Palace[], forward: boolean, bureau: number) {
  const lifeAge = bureau * 2;
  const cycles: { palace: PalaceName; startAge: number; endAge: number }[] = [];

  const startIdx = 0;
  for (let i = 0; i < 12; i++) {
    const idx = forward ? (startIdx + i) % 12 : (startIdx - i + 12) % 12;
    const startAge = i === 0 ? lifeAge : cycles[cycles.length - 1].endAge + 1;
    const endAge = i === 11 ? 120 : Math.min(startAge + 9, 120);
    cycles.push({ palace: palaces[idx].name, startAge, endAge });
    palaces[idx].majorLimit = { startAge, endAge };
  }
  return cycles;
}

function getCurrentCycle(cycles: { startAge: number; endAge: number }[], birthYear: number) {
  const age = new Date().getFullYear() - birthYear;
  for (const c of cycles) {
    if (age >= c.startAge && age <= c.endAge) return c as any;
  }
  return null;
}
