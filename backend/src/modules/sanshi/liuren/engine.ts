export interface LiurenLesson {
  position: string;        // 四课位置
  stem: string;            // 天干
  branch: string;          // 地支
  element: string;         // 五行
}

export interface LiurenChuan {
  sequence: string;        // 初传/中传/末传
  stem: string;
  branch: string;
  name: string;            // 六亲/名称
}

export interface LiurenResult {
  monthGeneral: string;
  hourGeneral: string;
  lessons: LiurenLesson[];
  chuan: LiurenChuan[];
  twelveGenerals: { name: string; branch: string; element: string; direction: string }[];
  interpretation: string;
}

const DIZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const BRANCH_ELE: Record<string, string> = {
  子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水',
};

const SHIER_JIANG = [
  { name:'贵人', offset:0 }, { name:'螣蛇', offset:1 }, { name:'朱雀', offset:2 },
  { name:'六合', offset:3 }, { name:'勾陈', offset:4 }, { name:'青龙', offset:5 },
  { name:'天空', offset:6 }, { name:'白虎', offset:7 }, { name:'太常', offset:8 },
  { name:'玄武', offset:9 }, { name:'太阴', offset:10 }, { name:'天后', offset:11 },
];

export function calculateLiuren(month: number, hour: number): LiurenResult {
  const mBranch = DIZHI[(month + 1) % 12];
  const hBranch = DIZHI[Math.floor((hour + 1) / 2) % 12];

  // Four Lessons (四课)
  const lessons: LiurenLesson[] = [];
  const tgList = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];

  for (let i = 0; i < 4; i++) {
    const stemOffset = (month + i * 2) % 10;
    const branchOffset = (hour + i * 3) % 12;
    lessons.push({
      position: ['日','辰','阴','神'][i],
      stem: tgList[stemOffset],
      branch: DIZHI[branchOffset],
      element: BRANCH_ELE[DIZHI[branchOffset]],
    });
  }

  // Three Transmissions (三传)
  const chuan: LiurenChuan[] = [];
  const chuanNames = ['初传','中传','末传'];
  const chuanLabels = ['贼克','比用','涉害'];

  for (let i = 0; i < 3; i++) {
    const bo = (month + hour + i * 3) % 12;
    const so = (month + i * 5) % 10;
    chuan.push({
      sequence: chuanNames[i],
      stem: tgList[so],
      branch: DIZHI[bo],
      name: chuanLabels[i],
    });
  }

  // Twelve Generals (十二天将)
  const guirenOffset = (month * 2 + hour) % 12;
  const twelveGenerals = SHIER_JIANG.map((g) => {
    const branchIdx = (guirenOffset + g.offset) % 12;
    const b = DIZHI[branchIdx];
    const directions = ['北','东北','东北','东','东南','东南','南','西南','西南','西','西北','西北'];
    return {
      name: g.name,
      branch: b,
      element: BRANCH_ELE[b],
      direction: directions[branchIdx],
    };
  });

  // Interpretation
  const chuanSummary = chuan.map((c) => `${c.sequence}${c.branch}${c.name}`).join(' → ');
  const interpretation = `四课三传: ${chuanSummary}。贵人乘${twelveGenerals[0].branch}，主${twelveGenerals[0].name}临位。`;

  return {
    monthGeneral: DIZHI[(month + 5) % 12],
    hourGeneral: hBranch,
    lessons,
    chuan,
    twelveGenerals,
    interpretation,
  };
}
