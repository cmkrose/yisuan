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

  const tgList = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];

  // Four Lessons (四课)
  const lessons: LiurenLesson[] = [];
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

const LIUREN_ELEMENT_RELATIONS: Record<string, string> = {
  '木火': '木生火，为相生关系，主顺遂通达，事业有贵人相助',
  '火土': '火生土，为相生关系，主根基稳固，财运渐起',
  '土金': '土生金，为相生关系，主收获丰厚，财富积累',
  '金水': '金生水，为相生关系，主智慧流通，消息灵通',
  '水木': '水生木，为相生关系，主生机勃勃，新事顺利',
  '木土': '木克土，为相克关系，主阻碍困难，宜守不宜攻',
  '土水': '土克水，为相克关系，主财运受阻，需谨慎行事',
  '水火': '水克火，为相克关系，主口舌是非，注意人际关系',
  '火金': '火克金，为相克关系，主破财损耗，投资需谨慎',
  '金木': '金克木，为相克关系，主压力重重，宜以柔克刚',
  '木木': '木木比和，为同类相助，主团结合作，人脉广阔',
  '火火': '火火比和，为同类相助，主热情高涨，名声在外',
  '土土': '土土比和，为同类相助，主稳重厚实，稳中求进',
  '金金': '金金比和，为同类相助，主刚毅果断，财源广进',
  '水水': '水水比和，为同类相助，主智慧深远，谋略得当',
};

const GENERAL_ANALYSIS: Record<string, string> = {
  贵人: '贵人主尊贵护佑，临位则贵人相助，逢凶化吉。贵人乘吉支则万事顺遂，乘凶支则贵人远离，需主动寻助。',
  螣蛇: '螣蛇主虚惊怪异，临位则有口舌是非、怪异之事。螣蛇属火，遇火支则虚惊加倍，宜持正守心，勿轻信虚言。',
  朱雀: '朱雀主文书信息，临位则有消息传来，利于考试、文书、通讯之事。朱雀得吉则文书顺利，得凶则消息不利。',
  六合: '六合主和合婚姻，临位则利于合作、婚恋、谈判。六合为和合之神，诸事得助，人缘极佳，利于社交活动。',
  勾陈: '勾陈主争讼纠纷，临位则易有官非、争斗之事。勾陈属土，宜守不宜攻，避免与人争执，凡事忍让为上。',
  青龙: '青龙主喜庆升迁，临位则喜事临门，利于求官、求财、升迁。青龙为吉神之首，所到之处多有喜庆之事。',
  天空: '天空主虚诈不实，临位则易有虚假信息、空欢喜之事。天空临位需谨慎，勿轻信他人许诺，脚踏实地为上。',
  白虎: '白虎主凶伤灾祸，临位则需防范意外、疾病、血光之灾。白虎为凶神之首，宜安守静待，避免冒险行动。',
  太常: '太常主饮食宴乐，临位则利于聚会、宴请、享受之事。太常属土，享乐之余需注意节制，避免骄奢。',
  玄武: '玄武主盗贼暗昧，临位则易有失窃、暗害、阴私之事。玄武属水，宜加强防范，保管财物，谨防小人。',
  太阴: '太阴主隐秘策划，临位则利于谋略、暗中行事。太阴属金，宜低调行事，暗中布局，待时而动。',
  天后: '天后主女性贵人，临位则得女性贵人相助，利于婚姻、美容、艺术之事。天后为阴柔之吉神，以柔克刚。',
};

const SIX_RELATIONS = {
  父母: '父母爻主文书、学业、长辈之事。父母临旺相则学业有成，考试顺利；父母临休囚则文书迟滞，长辈有忧。',
  兄弟: '兄弟爻主手足、朋友、同辈之事。兄弟临旺相则朋友得力，合作顺利；兄弟临休囚则朋友离散，孤立无援。',
  妻财: '妻财爻主财富、妻子、交易之事。妻财临旺相则财运亨通，婚姻美满；妻财临休囚则钱财损耗，感情不和。',
  官鬼: '官鬼爻主功名、官职、疾病之事。官鬼临旺相则仕途顺利，声望提升；官鬼临休囚则官非缠身，身体有恙。',
  子孙: '子孙爻主子嗣、娱乐、解忧之事。子孙临旺相则子女安康，心情愉悦；子孙临休囚则子嗣有忧，烦恼不断。',
};

const ACTION_ADVICE: Record<string, string> = {
  追求: '当前气场利于进取，建议把握时机主动出击。事业上可积极谋求升迁，感情上可大胆表白，财运上可适当投资。',
  守成: '当前气场宜守不宜攻，建议稳守既有成果。不宜做出重大决策，投资需谨慎，避免冲动行事。维持现状，积蓄力量。',
  等待: '当前气场尚需酝酿，建议耐心等待时机。急进反而招损，保持低调行事，待贵人相助或气场转变之后再行动。',
};

export function analyzeLiuren(result: LiurenResult, month: number, hour: number): string {
  const lines: string[] = [];

  // ===== 课体分析 =====
  lines.push('【课体分析】');
  const lessonDescs = result.lessons.map((l, i) => {
    const posLabel = ['第一课（日）','第二课（辰）','第三课（阴）','第四课（神）'][i];
    return `${posLabel}：天干${l.stem}、地支${l.branch}、五行属${l.element}，此为${l.element === '木' ? '万物生长之象' : l.element === '火' ? '光明热烈之象' : l.element === '土' ? '厚重载物之象' : l.element === '金' ? '刚毅果断之象' : '智慧流动之象'}`;
  });
  lines.push(lessonDescs.join('\n'));
  lines.push('四课之中，' +
    `日课${result.lessons[0].stem}${result.lessons[0].branch}主问事之主体，` +
    `辰课${result.lessons[1].stem}${result.lessons[1].branch}主外部环境，` +
    `阴课${result.lessons[2].stem}${result.lessons[2].branch}主内部隐情，` +
    `神课${result.lessons[3].stem}${result.lessons[3].branch}主变化趋势。`);

  const lesson1 = result.lessons[0];
  const lesson2 = result.lessons[1];
  const relKey12 = lesson1.element + lesson2.element;
  const rel12 = LIUREN_ELEMENT_RELATIONS[relKey12] || '课体关系平和中正，无甚偏颇';
  lines.push(`日课与辰课：${rel12}。`);

  // ===== 三传分析 =====
  lines.push('');
  lines.push('【三传分析】');
  lines.push('三传者，事物发展之三个阶段也：');
  for (const c of result.chuan) {
    const stageLabel = c.sequence === '初传' ? '初始阶段' : c.sequence === '中传' ? '发展阶段' : '结果阶段';
    const methodLabel = c.name === '贼克' ? '贼克法：以克为主，主争讼竞争之事' :
      c.name === '比用' ? '比用法：以比和为主，主合作和谐之事' :
      '涉害法：以利害为主，主复杂多变之事';
    lines.push(`${c.sequence}（${stageLabel}）：天干${c.stem}、地支${c.branch}，取${methodLabel}。`);
  }
  const chuanFlow = result.chuan.map((c) => c.branch).join(' → ');
  lines.push(`三传流势：${chuanFlow}，` +
    `体现事态从${result.chuan[0].branch}地走向${result.chuan[2].branch}地之变化过程。`);

  // ===== 十二天将分析 =====
  lines.push('');
  lines.push('【十二天将分析】');
  const guiren = result.twelveGenerals[0];
  lines.push(`月将：${result.monthGeneral}，时神：${result.hourGeneral}。` +
    `贵人起于${guiren.branch}位，属${guiren.element}，方向在${guiren.direction}。`);
  for (const g of result.twelveGenerals) {
    const genAnalysis = GENERAL_ANALYSIS[g.name] || `${g.name}临${g.branch}位，需综合判断吉凶。`;
    lines.push(`${g.name}：临${g.branch}（${g.element}·${g.direction}）。${genAnalysis}`);
  }

  // Highlight key generals
  const qinglong = result.twelveGenerals[5];
  const baihu = result.twelveGenerals[7];
  lines.push(`\n重点提示：青龙临${qinglong.branch}${qinglong.direction}方，主吉庆之事；白虎临${baihu.branch}${baihu.direction}方，需防意外之灾。` +
    `贵人${guiren.branch}位若为吉支，则贵人得力；若为凶支，则贵人难求。`);

  // ===== 六亲关系 =====
  lines.push('');
  lines.push('【六亲关系分析】');
  const allStems = [
    ...result.lessons.map(l => l.stem),
    ...result.chuan.map(c => c.stem),
  ];
  const uniqueStems = [...new Set(allStems)];
  const rels = ['父母','兄弟','妻财','官鬼','子孙'];
  const pickedRels: string[] = [];
  for (let i = 0; i < Math.min(3, rels.length); i++) {
    const ri = (month + hour + i * 2) % rels.length;
    pickedRels.push(rels[ri]);
  }
  for (const r of pickedRels) {
    const key = r as keyof typeof SIX_RELATIONS;
    const desc = SIX_RELATIONS[key] || `${r}爻需综观全卦而定其吉凶。`;
    const state = (month + hour) % 3 === 0 ? '旺相' : (month + hour) % 3 === 1 ? '平和' : '休囚';
    lines.push(`${r}爻（${state}）：${desc}`);
  }
  const dominantBranch = result.lessons[0].branch;
  const branchIdx = DIZHI.indexOf(dominantBranch);
  const sixHe = DIZHI[(branchIdx + 6) % 12];
  const sixHarm = DIZHI[(branchIdx + 1) % 12];
  lines.push(`\n日支${dominantBranch}之六合为${sixHe}，六害为${sixHarm}。` +
    `主事与属${['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'][DIZHI.indexOf(sixHe)]}之人合作有利，` +
    `与属${['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'][DIZHI.indexOf(sixHarm)]}之人需谨慎相处。`);

  // ===== 吉凶判断 =====
  lines.push('');
  lines.push('【吉凶判断】');
  const goodGenerals = ['贵人','青龙','六合','太常','天后'];
  const badGenerals = ['白虎','玄武','勾陈','螣蛇','天空'];
  const goodCount = result.twelveGenerals.filter((g) => goodGenerals.includes(g.name)).length;
  const badCount = result.twelveGenerals.filter((g) => badGenerals.includes(g.name)).length;

  const ki = (month * 2 + hour) % 3;
  if (ki === 0) {
    lines.push('综合来看，本课吉神（贵人、青龙、六合、太常、天后）临位有力，凶神受制，气场以吉为主。' +
      `贵人乘${guiren.branch}而临，青龙在${qinglong.branch}方，整体格局偏吉。` +
      '然白虎、玄武等凶神虽受制，亦需防其暗中作祟。总体判断：吉多凶少，宜把握时机积极进取。');
  } else if (ki === 1) {
    lines.push('综合来看，本课吉凶参半。吉神虽临位但力量不足，凶神虽在但未成大患。' +
      '气场处于均衡状态，事态发展取决于自身决策和行动。' +
      `贵人${guiren.branch}位尚可，但白虎${baihu.branch}位亦需注意。` +
      '总体判断：中平之象，宜稳中求进，谨慎决策。');
  } else {
    lines.push('综合来看，本课凶神较盛，气场偏于不利。宜守不宜攻，避免重大决策。' +
      `白虎临${baihu.branch}位，需特别注意意外灾害和口舌是非。` +
      '然天无绝人之路，青龙、贵人虽弱亦存，逢凶化吉之机仍在。' +
      '总体判断：偏凶之象，宜低调行事，积蓄力量，待时而动。');
  }

  // ===== 行动建议 =====
  lines.push('');
  lines.push('【行动建议】');
  const adviceKey = ki === 0 ? '追求' : ki === 1 ? '守成' : '等待';
  lines.push(ACTION_ADVICE[adviceKey]);

  const monthBranchIdx = (month + 1) % 12;
  const luckyDir = ['东','东南','南','西南','西','西北','北','东北','中','东','南','西'][monthBranchIdx];
  const unluckyDir = ['西','西北','北','东北','东','东南','南','西南','中','西','北','东'][monthBranchIdx];
  lines.push(`\n方位建议：吉方在${luckyDir}方，凶方在${unluckyDir}方。` +
    `重要事宜宜朝向${luckyDir}方进行，避免在${unluckyDir}方做重大决定。`);

  const ausHours: Record<number, string> = { 1: '子时', 5: '辰时', 7: '午时', 11: '申时', 13: '酉时' };
  const inausHours: Record<number, string> = { 3: '寅时', 9: '巳时', 15: '亥时' };
  const h = Math.floor((hour + 1) / 2) % 12;
  const luckyHour = ausHours[month] || '辰时';
  const unluckyHour = inausHours[(month + 6) % 12] || '亥时';
  lines.push(`时辰建议：宜选${luckyHour}行事，避开${unluckyHour}时段。`);

  lines.push(`\n总体而言，月将${result.monthGeneral}、时神${result.hourGeneral}，` +
    `三传${result.chuan.map((c) => c.branch).join('→')}之象，` +
    `贵人${guiren.branch}位执事。` +
    '建议结合具体问事类别（求财、求婚、求职、求医等）进行综合判断。' +
    '六壬之道深奥莫测，此分析仅为盘面解读，最终吉凶祸福仍取决于个人德行修为与实际行动。' +
    '善行积德可转祸为福，恶行损德则吉亦变凶，愿君慎之。');

  return lines.join('\n');
}
