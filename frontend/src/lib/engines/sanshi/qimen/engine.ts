const LUOSHU = [4, 9, 2, 3, 5, 7, 8, 1, 6];

const BA_MEN = ['休','生','伤','杜','景','死','惊','开'] as const;
const JIU_XING = ['天蓬','天芮','天冲','天辅','天禽','天心','天柱','天任','天英'] as const;
const BA_SHEN = ['值符','螣蛇','太阴','六合','白虎','玄武','九地','九天'] as const;
const JIU_GONG = ['坎','坤','震','巽','中','乾','兑','艮','离'] as const;
const WUXING: Record<string, string> = { 坎:'水',坤:'土',震:'木',巽:'木',中:'土',乾:'金',兑:'金',艮:'土',离:'火' };

const TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];

const TIAN_GAN_WUXING: Record<string, string> = {
  甲:'木', 乙:'木', 丙:'火', 丁:'火', 戊:'土',
  己:'土', 庚:'金', 辛:'金', 壬:'水', 癸:'水',
};

const TIAN_GAN_MEANINGS: Record<string, string> = {
  甲:'为首领之象，主领导力与贵人运，得甲木生扶则万事亨通',
  乙:'为柔木花草之象，主文墨、妻财、细软之事，以柔克刚',
  丙:'为阳火烈阳之象，主权威名望、光明正大，利于公开行事',
  丁:'为阴火星光之象，主消息文书、希望契机，暗中得助',
  戊:'为阳土厚重之象，主钱财资本、地产物业，根基稳固',
  己:'为阴土意念之象，主策划谋略、私欲私事，宜暗中运筹',
  庚:'为阳金肃杀之象，主阻碍斗争、官非口舌，百事不宜',
  辛:'为阴金精微之象，主错误过失、刑罚罪责，防小人背后',
  壬:'为阳水流通之象，主智慧谋略、变动迁移，通达变化',
  癸:'为阴水隐秘之象，主暗箱操作、后门捷径、暧昧不明',
};

const MEN_MEANINGS: Record<string, { ji: boolean; desc: string }> = {
  休: { ji: true, desc: '休养生息，贵人相助，事业顺遂，健康恢复，宜休整调养' },
  生: { ji: true, desc: '生机勃勃，财运亨通，事业兴旺，生命力强，大利求财创业' },
  伤: { ji: false, desc: '伤害破损，竞争冲突，意外伤害，口舌是非，宜以柔克刚避其锋芒' },
  杜: { ji: false, desc: '杜塞不通，阻碍困难，计划受阻，信息闭塞，宜暗中筹划积蓄力量' },
  景: { ji: false, desc: '虚而不实，表面风光，文书名誉，考试竞赛，宜务实勿贪虚名' },
  死: { ji: false, desc: '终结死亡，结束转变，诉讼官非，破败之象，宜断舍离开新局' },
  惊: { ji: false, desc: '惊恐忧虑，口舌是非，官司诉讼，意外惊吓，宜低调行事防口舌' },
  开: { ji: true, desc: '开门大吉，事业开创，仕途通达，贵人提携，大利求职升迁开业' },
};

const XING_WUXING: Record<string, string> = { 天蓬:'水',天芮:'土',天冲:'木',天辅:'木',天禽:'土',天心:'金',天柱:'金',天任:'土',天英:'火' };

const XING_MEANINGS: Record<string, { ji: boolean; gong: string; desc: string }> = {
  天蓬: { ji: false, gong: '坎', desc: '破财贼盗之星，性凶猛好斗，宜军事不宜民事，犯之损财招灾' },
  天芮: { ji: false, gong: '坤', desc: '疾病学/生之星，性阴柔迟缓，利求学修行，不利远行求财' },
  天冲: { ji: false, gong: '震', desc: '武事争斗之星，性刚烈迅速，利竞争军事，不利合作婚恋' },
  天辅: { ji: true, gong: '巽', desc: '文教辅佐之星，性温和儒雅，大利文化教育事业，考试文书' },
  天禽: { ji: true, gong: '中', desc: '中正平衡之星，性中和无私，万事皆宜百无禁忌，大吉大利' },
  天心: { ji: true, gong: '乾', desc: '医药谋划之星，性机敏聪慧，利医疗治病策划谋略，百事可成' },
  天柱: { ji: false, gong: '兑', desc: '毁折口舌之星，性刚锐锋利，利辩论演讲，不利合作与婚姻' },
  天任: { ji: true, gong: '艮', desc: '农事生育之星，性厚重安定，利基建种植安产生育，稳健得利' },
  天英: { ji: false, gong: '离', desc: '火事文明之星，性燥烈璀璨，利文化艺术娱乐，不利诉讼纷争' },
};

const SHEN_MEANINGS: Record<string, { ji: boolean; desc: string }> = {
  值符: { ji: true, desc: '百神之首，主贵人首领、权威领导，天乙贵人所在，万事亨通逢凶化吉' },
  螣蛇: { ji: false, desc: '虚惊怪异之神，主口舌是非、怪事虚惊、精神恍惚，宜防小人暗算和欺诈' },
  太阴: { ji: true, desc: '阴佑暗助之神，主暗中贵人、谋划策略、女性助力，宜暗中运作蓄势待发' },
  六合: { ji: true, desc: '和合婚姻之神，主合作合资、婚姻恋爱、人际关系圆融，大利婚恋合作' },
  白虎: { ji: false, desc: '凶煞威猛之神，主官非口舌、伤灾疾病、血光之灾，宜避其锋不可硬碰' },
  玄武: { ji: false, desc: '盗贼阴私之神，主盗窃诈骗、阴谋诡计、暧昧不明，防被骗被盗隐私泄露' },
  九地: { ji: true, desc: '稳固长久之神，主蓄势待发、根基稳固、长期发展，利于守成积蓄力量' },
  九天: { ji: true, desc: '奋发向上之神，主扬名显达、积极主动、远行高飞，利于进取开拓事业' },
};

const GONG_MEANINGS: Record<string, string> = {
  坎: '坎为水，主北方，象征危险与智慧，对应事业运、官运、财运之源，藏而待发',
  坤: '坤为地，主西南，象征包容与顺从，对应家庭婚姻生育地产，厚德载物',
  震: '震为雷，主东方，象征行动与变革，对应竞争创业长子运动，生机勃发',
  巽: '巽为风，主东南，象征顺遂与渗透，对应文书教育长女交易，风行天下',
  中: '中为太极，主中央，象征平衡与中和，对应核心决策总体运势，万法归宗',
  乾: '乾为天，主西北，象征刚健与领导，对应官运仕途贵人父亲，天行健',
  兑: '兑为泽，主西方，象征喜悦与口舌，对应口才诉讼少女娱乐，悦而多言',
  艮: '艮为山，主东北，象征静止与积蓄，对应事业靠山少男健康，止而蓄力',
  离: '离为火，主南方，象征美丽与文明，对应名誉文书考试中女，光明照人',
};

const DIRECTION_MAP: Record<number, string> = { 1:'正北',2:'西南',3:'正东',4:'东南',5:'中',6:'西北',7:'正西',8:'东北',9:'正南' };

export interface QimenPalace {
  gong: string;
  number: number;
  direction: string;
  men: string;
  xing: string;
  shen: string;
  tianPan: string;
  diPan: string;
  wuxing: string;
  shengKe: string;
  isZhiFu: boolean;
}

export interface QimenResult {
  yangDun: boolean;
  juShu: number;
  yuan: string;
  palaces: QimenPalace[];
  timeInfo: { year: number; month: number; day: number; hour: number; shiChen: string };
}

export function calculateQimen(year: number, month: number, day: number, hour: number): QimenResult {
  const hsi = Math.floor((hour + 1) / 2) % 12;
  const diZhiList = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const shiChen = diZhiList[hsi];

  const yangDun = [1,2,3,4,5,6].includes(month);

  const juShu = ((year + month + day) % 9) || 9;

  const yuan = day <= 10 ? '上元' : day <= 20 ? '中元' : '下元';

  const palaces: QimenPalace[] = [];

  const directionMap: Record<number, string> = { 1:'北',2:'西南',3:'东',4:'东南',5:'中',6:'西北',7:'西',8:'东北',9:'南' };

  for (let i = 0; i < 9; i++) {
    const num = LUOSHU[i];
    const gongIdx = (i + juShu) % 9;
    const gong = JIU_GONG[gongIdx];

    const menIdx = yangDun ? (juShu - 1 + i) % 8 : (8 - (juShu - 1) - i + 8) % 8;
    const xingIdx = (juShu - 1 + i) % 9;
    const shenIdx = yangDun ? i % 8 : (8 - i) % 8;

    const tianGanIdx = (juShu + i) % 10;
    const diGanIdx = (i * 2) % 10;

    palaces.push({
      gong,
      number: num,
      direction: directionMap[num],
      men: BA_MEN[menIdx],
      xing: JIU_XING[xingIdx],
      shen: BA_SHEN[shenIdx],
      tianPan: TIAN_GAN[tianGanIdx],
      diPan: TIAN_GAN[diGanIdx],
      wuxing: WUXING[gong as keyof typeof WUXING],
      shengKe: computeShengKe(WUXING[gong as keyof typeof WUXING], TIAN_GAN_WUXING[TIAN_GAN[tianGanIdx]]),
      isZhiFu: num === LUOSHU[2],
    });
  }

  return {
    yangDun,
    juShu,
    yuan,
    palaces,
    timeInfo: { year, month, day, hour, shiChen },
  };
}

function computeShengKe(gongWuxing: string, ganWuxing: string): string {
  const sheng: Record<string, string> = { 木:'火', 火:'土', 土:'金', 金:'水', 水:'木' };
  const ke: Record<string, string> = { 木:'土', 土:'水', 水:'火', 火:'金', 金:'木' };
  if (gongWuxing === ganWuxing) return '比和';
  if (sheng[gongWuxing] === ganWuxing) return '我生';
  if (sheng[ganWuxing] === gongWuxing) return '生我';
  if (ke[gongWuxing] === ganWuxing) return '我克';
  if (ke[ganWuxing] === gongWuxing) return '克我';
  return '比和';
}

export function analyzeQimen(
  chartData: QimenResult,
  inputParams: {
    year: number; month: number; day: number; hour: number;
    birthYear: number; birthMonth: number; birthDay: number; birthHour: number;
    gender: string; location: string; purpose: string;
  }
): string {
  const { yangDun, juShu, yuan, palaces, timeInfo } = chartData;
  const { purpose } = inputParams;

  const zhiFuPalace = palaces.find(p => p.isZhiFu)!;
  const zhiFuXing = zhiFuPalace.xing;
  const zhiShiMen = zhiFuPalace.men;

  const dunType = yangDun ? '阳遁' : '阴遁';
  const dunNature = yangDun ? '阳气上升，万物生发，宜主动出击、积极进取' : '阴气渐盛，万物收藏，宜以静制动、守成为上';

  const jiPalaces = palaces.filter(p => isPalaceAuspicious(p));
  const xiongPalaces = palaces.filter(p => !isPalaceAuspicious(p));
  const jiCount = jiPalaces.length;
  const xiongCount = xiongPalaces.length;

  const overallMood = jiCount >= 7 ? '大吉之象'
    : jiCount >= 5 ? '总体偏吉'
    : jiCount >= 3 ? '吉凶参半'
    : jiCount >= 1 ? '总体偏凶'
    : '大凶之象';

  const sections: string[] = [];

  sections.push(buildJuShiAnalysis(dunType, juShu, yuan, zhiFuPalace, zhiFuXing, zhiShiMen, dunNature, overallMood, timeInfo, jiCount));
  sections.push(buildJiuGongAnalysis(palaces, zhiFuPalace));
  sections.push(buildBaMenAnalysis(palaces, purpose));
  sections.push(buildJiuXingAnalysis(palaces, zhiFuXing, yangDun, juShu));
  sections.push(buildBaShenAnalysis(palaces, zhiFuPalace));
  sections.push(buildJixiongAnalysis(palaces, jiPalaces, xiongPalaces, overallMood));
  sections.push(buildActionAdvice(palaces, purpose, zhiFuPalace, jiPalaces, xiongPalaces, dunType, juShu));

  return sections.join('\n\n');
}

function isPalaceAuspicious(p: QimenPalace): boolean {
  const menJi = MEN_MEANINGS[p.men]?.ji ?? true;
  const xingJi = XING_MEANINGS[p.xing]?.ji ?? true;
  const shenJi = SHEN_MEANINGS[p.shen]?.ji ?? true;
  const jiScore = (menJi ? 1 : 0) + (xingJi ? 1 : 0) + (shenJi ? 1 : 0);
  return jiScore >= 2;
}

function buildJuShiAnalysis(
  dunType: string, juShu: number, yuan: string,
  zhiFuPalace: QimenPalace, zhiFuXing: string, zhiShiMen: string,
  dunNature: string, overallMood: string,
  timeInfo: QimenResult['timeInfo'],
  jiCount: number
): string {
  const lines: string[] = [];
  lines.push('【局势分析】');
  lines.push(`本次奇门遁甲起局为${dunType}${juShu}局，时当${yuan}，为${timeInfo.shiChen}时盘。${dunNature}。`);
  lines.push(`值符星「${zhiFuXing}」落${zhiFuPalace.gong}宫（第${zhiFuPalace.number}宫，${zhiFuPalace.direction}方），值使门为「${zhiShiMen}门」。值符为百神之首，其所落之宫即为天乙贵人所在，也是全局能量的枢纽与核心。`);
  lines.push(`值符临${zhiFuPalace.gong}宫，该宫五行属${zhiFuPalace.wuxing}，天盘干「${zhiFuPalace.tianPan}」、地盘干「${zhiFuPalace.diPan}」，天盘地盘的${zhiFuPalace.shengKe === '比和' ? '和谐比和' : zhiFuPalace.shengKe === '生我' ? '相生有利' : zhiFuPalace.shengKe === '我生' ? '耗泄不利' : zhiFuPalace.shengKe === '我克' ? '克制有得' : '受克有损'}关系，反映了天时与地利之间的互动格局。`);
  lines.push(`全局${dunType}${juShu}局配${yuan}，${juShu >= 5 ? '阳数偏大，气运旺盛流动较快' : '阴数偏小，气运和缓沉稳'}` +
    `，${yuan === '上元' ? '上元之气雄浑厚重，宜做长远规划' : yuan === '中元' ? '中元之气平衡中和，百事皆宜' : '下元之气轻灵变幻，宜速战速决'}。`);
  const menInfo = MEN_MEANINGS[zhiShiMen] || { desc: '' };
  lines.push(`值使「${zhiShiMen}门」主宰当前事务的总体走向。${menInfo.desc}。总体而言，此局${overallMood}，${jiCount >= 5 ? '天时地利人和皆备，正是大展宏图之时' : jiCount >= 3 ? '机遇与挑战并存，需审时度势趋吉避凶' : '形势不容乐观，宜守不宜攻，等待时机'}`);
  return lines.join('');
}

function buildJiuGongAnalysis(palaces: QimenPalace[], zhiFuPalace: QimenPalace): string {
  const lines: string[] = [];
  lines.push('【九宫分析】');

  const sorted = [...palaces].sort((a, b) => a.number - b.number);

  for (const p of sorted) {
    const gongDesc = GONG_MEANINGS[p.gong] || '';
    const xingInfo = XING_MEANINGS[p.xing];
    const xingWx = XING_WUXING[p.xing];
    const menInfo = MEN_MEANINGS[p.men];
    const shenInfo = SHEN_MEANINGS[p.shen];
    const tgWx = TIAN_GAN_WUXING[p.tianPan];
    const dpWx = TIAN_GAN_WUXING[p.diPan];
    const tgMeaning = TIAN_GAN_MEANINGS[p.tianPan];
    const isZhiFu = p.isZhiFu;
    const palaceAuspicious = isPalaceAuspicious(p);

    let palaceAnalysis = `第${p.number}宫·${p.gong}宫（${p.direction}方）五行属${p.wuxing}。`;
    palaceAnalysis += `${gongDesc}`;

    palaceAnalysis += `天盘星为${p.xing}，${xingInfo.desc}，该星原属${xingInfo.gong}宫${XING_MEANINGS[p.xing]?.ji ? '吉' : '凶'}星，${isZhiFu ? '本局为值符星在此镇守，力量加倍，统摄全局。' : `今落${p.gong}宫，${p.wuxing === xingWx ? '星宫五行相同，能量得以充分发挥' : `${xingWx === '水' && p.wuxing === '木' ? '星生宫，天力滋养地利，大吉' : xingWx === '木' && p.wuxing === '火' ? '星生宫，顺势而为，吉利' : xingWx === '火' && p.wuxing === '土' ? '星生宫，气势流畅' : xingWx === '土' && p.wuxing === '金' ? '星生宫，根基稳固' : xingWx === '金' && p.wuxing === '水' ? '星生宫，运势通畅' : `${p.wuxing}泄${xingWx}，星力被宫耗泄`}`}。`}`;

    palaceAnalysis += `天盘干「${p.tianPan}」（属${tgWx}），${tgMeaning}。地盘干「${p.diPan}」（属${dpWx}），${dpWx === tgWx ? '天地盘五行相同，内外一致，信息明确' : TIAN_GAN_MEANINGS[p.diPan].slice(0, 30)}。${p.shengKe === '比和' ? '天地二盘比和相助，此宫气机顺畅' : p.shengKe === '生我' ? '地盘生天盘，地利助天时，大吉大利' : p.shengKe === '我生' ? '天盘生地盘，天时养地利，宜稳步推进' : p.shengKe === '我克' ? '天盘克地盘，主动可控，宜进取' : '天盘被地盘克，被动受制，宜谨慎行事'}。`;

    palaceAnalysis += `临「${p.men}门」，${menInfo.desc}。神盘得「${p.shen}」加临，${shenInfo.desc}。`;

    palaceAnalysis += `综合此宫：${palaceAuspicious ? '吉庆之宫，利事可成' : '凶险之宫，宜慎重对待'}。${isZhiFu ? '此宫为值符所在，全局核心，最为关键。' : ''}`;

    lines.push(palaceAnalysis);
  }

  return lines.join('\n');
}

function buildBaMenAnalysis(palaces: QimenPalace[], purpose: string): string {
  const lines: string[] = [];
  lines.push('【八门分析】');

  const menToPalace = new Map<string, QimenPalace>();
  for (const p of palaces) {
    menToPalace.set(p.men, p);
  }

  const jiMenList = ['开','休','生'];
  const xiongMenList = ['死','惊','伤'];
  const zhongMenList = ['杜','景'];

  const jiMenPositions: string[] = [];
  const xiongMenPositions: string[] = [];

  for (const men of BA_MEN) {
    const p = menToPalace.get(men);
    if (!p) continue;
    const info = MEN_MEANINGS[men];
    const tag = jiMenList.includes(men) ? '（吉门）' : xiongMenList.includes(men) ? '（凶门）' : '（中平）';
    if (jiMenList.includes(men)) {
      jiMenPositions.push(`「${men}门」落${p.gong}宫（${p.direction}方）`);
    }
    if (xiongMenList.includes(men)) {
      xiongMenPositions.push(`「${men}门」落${p.gong}宫（${p.direction}方）`);
    }
    lines.push(`「${men}门」落第${p.number}宫·${p.gong}宫（${p.direction}方）${tag}：${info.desc}`);
  }

  lines.push('');
  lines.push(`三大吉门分布：${jiMenPositions.join('；')}。此三方为当前时空下最利行动的方向。`);
  lines.push(`三大凶门分布：${xiongMenPositions.join('；')}。此三方宜避其锋芒，不宜主动出击。`);

  const purposeMenMap: Record<string, string> = {
    事业: '开', 财运: '生', 婚姻: '休', 健康: '休',
  };
  const targetMen = purposeMenMap[purpose] || '开';
  const targetPalace = menToPalace.get(targetMen);
  if (targetPalace) {
    lines.push('');
    if (purpose === '事业') {
      lines.push(`您求问${purpose}事宜，「开门」为事业之门，今落${targetPalace.gong}宫（${targetPalace.direction}方）。${menToPalace.get('生') ? `同时「生门」落${menToPalace.get('生')!.gong}宫（${menToPalace.get('生')!.direction}方），生门主财运辅助事业。` : ''}建议面向${targetPalace.direction}方求职、开拓、签约。`);
    } else if (purpose === '财运') {
      lines.push(`您求问${purpose}事宜，「生门」为财富之门，今落${targetPalace.gong}宫（${targetPalace.direction}方）。${menToPalace.get('开') ? `「开门」落${menToPalace.get('开')!.gong}宫（${menToPalace.get('开')!.direction}方），开门的事业运可带动财运。` : ''}投资理财宜朝向${targetPalace.direction}方，以求财源广进。`);
    } else if (purpose === '婚姻') {
      lines.push(`您求问${purpose}事宜，「休门」与婚恋相关，今落${targetPalace.gong}宫（${targetPalace.direction}方）。${menToPalace.get('生') ? `「生门」落${menToPalace.get('生')!.gong}宫利于生育，` : ''}建议在${targetPalace.direction}方多活动，或在家中此方位布置催旺婚缘。`);
    } else if (purpose === '健康') {
      lines.push(`您求问${purpose}事宜，「休门」主休养康复，落${targetPalace.gong}宫（${targetPalace.direction}方）。${menToPalace.get('死') ? `须特别注意「死门」落${menToPalace.get('死')!.gong}宫，此方位不宜久待。` : ''}宜朝向${targetPalace.direction}方休养调理。`);
    } else {
      lines.push(`您求问综合事宜，吉门「开休生」分别落在${jiMenPositions.join('、')}，行事朝向此三方最为有利。`);
    }
  }

  return lines.join('');
}

function buildJiuXingAnalysis(palaces: QimenPalace[], zhiFuXing: string, yangDun: boolean, juShu: number): string {
  const lines: string[] = [];
  lines.push('【九星分析】');

  const xingToPalace = new Map<string, QimenPalace>();
  for (const p of palaces) {
    xingToPalace.set(p.xing, p);
  }

  const jiStars: string[] = [];
  const xiongStars: string[] = [];

  for (const xingName of JIU_XING) {
    const p = xingToPalace.get(xingName);
    if (!p) continue;
    const info = XING_MEANINGS[xingName];
    const isJi = info.ji;
    if (isJi) jiStars.push(xingName);
    else xiongStars.push(xingName);

    const tag = isJi ? '吉星' : '凶星';
    const isFu = xingName === zhiFuXing;
    const gongMatch = info.gong === p.gong;
    let positionInfo = `落${p.gong}宫（第${p.number}宫，${p.direction}方）`;
    if (gongMatch) {
      positionInfo += '，星归本位（伏吟），能量纯正但不免迟滞';
    }
    if (isFu) {
      positionInfo += '，为全局值符星，力量最强';
    }

    lines.push(`「${xingName}」（${tag}）：${info.desc}。本局${positionInfo}。`);
  }

  lines.push('');
  lines.push(`吉星：${jiStars.join('、')}，落在相应宫位可助运成事。`);
  lines.push(`凶星：${xiongStars.join('、')}，行事时应避开其所在宫位方向。`);
  lines.push(`值符星「${zhiFuXing}」为九星之首，其所在宫位是全局力量的汇聚点，一切决策应以值符星的方向为导向。`);

  return lines.join('');
}

function buildBaShenAnalysis(palaces: QimenPalace[], zhiFuPalace: QimenPalace): string {
  const lines: string[] = [];
  lines.push('【八神分析】');

  const shenToPalace = new Map<string, QimenPalace>();
  for (const p of palaces) {
    shenToPalace.set(p.shen, p);
  }

  for (const shenName of BA_SHEN) {
    const p = shenToPalace.get(shenName);
    if (!p) continue;
    const info = SHEN_MEANINGS[shenName];
    const tag = info.ji ? '吉神' : '凶神';
    const isZhiFu = shenName === '值符';

    lines.push(`「${shenName}」（${tag}）落${p.gong}宫（${p.direction}方）：${info.desc}${isZhiFu ? `此神落值符宫${zhiFuPalace.gong}宫，为全局神盘之首，各方神煞均受其统领。` : ''}`);
  }

  lines.push('');
  const jiShens = BA_SHEN.filter(s => SHEN_MEANINGS[s].ji);
  const xiongShens = BA_SHEN.filter(s => !SHEN_MEANINGS[s].ji);
  lines.push(`吉神${jiShens.join('、')}所临之宫，宜主动办事、求取吉利。`);
  lines.push(`凶神${xiongShens.join('、')}所临之宫，宜回避退让、暗中行事，不可正面冲突。`);

  const baihuP = shenToPalace.get('白虎');
  const xuanwuP = shenToPalace.get('玄武');
  if (baihuP) {
    lines.push(`特别注意：「白虎」临${baihuP.gong}宫（${baihuP.direction}方），此方易有口舌官非、血光之灾，宜避开此方向出行或办事。`);
  }
  if (xuanwuP) {
    lines.push(`「玄武」临${xuanwuP.gong}宫（${xuanwuP.direction}方），须防小人暗算、盗窃诈骗，重要文件财物远离此方位。`);
  }

  return lines.join('');
}

function buildJixiongAnalysis(
  palaces: QimenPalace[],
  jiPalaces: QimenPalace[],
  xiongPalaces: QimenPalace[],
  overallMood: string
): string {
  const lines: string[] = [];
  lines.push('【吉凶分析】');

  const scored = palaces.map(p => {
    const menJi = MEN_MEANINGS[p.men]?.ji ?? true;
    const xingJi = XING_MEANINGS[p.xing]?.ji ?? true;
    const shenJi = SHEN_MEANINGS[p.shen]?.ji ?? true;
    let bonus = 0;
    if (p.isZhiFu) bonus += 2;
    if (p.shengKe === '生我' || p.shengKe === '比和') bonus += 1;
    if (p.shengKe === '克我') bonus -= 1;
    return { palace: p, score: (menJi ? 2 : 0) + (xingJi ? 2 : 0) + (shenJi ? 1 : 0) + bonus };
  });
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0].palace;
  const worst = scored[scored.length - 1].palace;

  lines.push(`本局${overallMood}。九宫评分最高为第${best.number}宫·${best.gong}宫（${best.direction}方），总分最高，${isPalaceAuspicious(best) ? '为全局最吉之宫' : '相对最优'}。此宫天盘星「${best.xing}」、门「${best.men}」、神「${best.shen}」，三者合力形成${best.isZhiFu ? '值符' : ''}吉格，大利施为。${best.direction}方为当前最佳行动方位。`);
  lines.push(`最不利为第${worst.number}宫·${worst.gong}宫（${worst.direction}方），星「${worst.xing}」、门「${worst.men}」、神「${worst.shen}」均不吉，${worst.shengKe === '克我' ? '且天盘克地盘，形势极为不利，' : ''}此方宜尽量避开，千万不可在此方位进行重要事务。`);

  lines.push('');
  lines.push('各宫吉凶评级如下：');
  for (const { palace: p, score } of scored) {
    const rating = score >= 5 ? '★★★★☆ 大吉' : score >= 3 ? '★★★☆☆ 中吉' : score >= 1 ? '★★☆☆☆ 小吉' : score >= -1 ? '★☆☆☆☆ 平' : '☆☆☆☆☆ 凶';
    const marks = [];
    if (p.isZhiFu) marks.push('值符宫');
    lines.push(`第${p.number}宫·${p.gong}宫（${p.direction}方）${marks.length > 0 ? '【' + marks.join('') + '】' : ''}：${rating} —— 星${p.xing}·门${p.men}·神${p.shen}`);
  }

  lines.push('');
  lines.push(`吉宫${jiPalaces.map(p => p.gong).join('、')}共${jiPalaces.length}宫，宜主动作为。`);
  lines.push(`凶宫${xiongPalaces.map(p => p.gong).join('、')}共${xiongPalaces.length}宫，宜守不宜攻。`);

  return lines.join('');
}

function buildActionAdvice(
  palaces: QimenPalace[],
  purpose: string,
  zhiFuPalace: QimenPalace,
  jiPalaces: QimenPalace[],
  xiongPalaces: QimenPalace[],
  dunType: string,
  juShu: number
): string {
  const lines: string[] = [];
  lines.push('【行动建议】');

  const menToPalace = new Map<string, QimenPalace>();
  const shenToPalace = new Map<string, QimenPalace>();
  const xingToPalace = new Map<string, QimenPalace>();
  for (const p of palaces) {
    menToPalace.set(p.men, p);
    shenToPalace.set(p.shen, p);
    xingToPalace.set(p.xing, p);
  }

  const bestJiPalace = jiPalaces.length > 0 ? jiPalaces[0] : palaces[0];
  const bestJiDirection = bestJiPalace.direction;

  const zhiFuDirection = zhiFuPalace.direction;

  if (purpose === '事业') {
    const kaiP = menToPalace.get('开');
    const shengP = menToPalace.get('生');
    const liuheP = shenToPalace.get('六合');
    const jiutianP = shenToPalace.get('九天');

    lines.push(`您求问事业发展，综合奇门盘局，建议如下：`);
    lines.push(`1. 最佳求职/面试方位：${kaiP ? kaiP.direction + '方（开门所在）' : bestJiDirection + '方'}。开门为事业之门，${kaiP ? `今落${kaiP.gong}宫，星得${kaiP.xing}加持` + (kaiP.shengKe === '生我' ? '，天时地利相合，大吉。' : '。') : ''}${kaiP && kaiP.isZhiFu ? '开门恰在值符宫，事业运极为旺盛，升职加薪有望。' : ''}`);
    lines.push(`2. 最佳行动方向：${jiutianP ? jiutianP.direction + '方（九天扬名之方）' : zhiFuDirection + '方（值符所在）'}，宜朝此方向递简历、拜访客户、洽谈合作。`);
    lines.push(`3. 贵人方向：${zhiFuDirection}方。值符为天乙贵人，在此方活动易遇贵人提携。`);
    lines.push(`4. ${shengP ? `「生门」落${shengP.gong}宫（${shengP.direction}方），财源方向与此相关，事业与财运相辅相成。` : ''}`);
    lines.push(`5. ${liuheP ? `「六合」落${liuheP.gong}宫（${liuheP.direction}方），合作合伙宜于此方洽谈，易达成共识。` : ''}`);
    lines.push(`6. 时间建议：${jiPalaces.length >= 5 ? '近期运势较好，宜果断出击、把握时机。' : '当前形势较为复杂，建议谨慎观望，待吉门所在时日再行动。'}${xiongPalaces.length > 0 ? `注意避开${xiongPalaces.map(p => p.direction + '方').join('、')}。` : ''}`);
  } else if (purpose === '财运') {
    const shengP = menToPalace.get('生');
    const kaiP = menToPalace.get('开');
    const tianxinP = xingToPalace.get('天心');

    lines.push(`您求问财运事宜，综合奇门盘局，建议如下：`);
    lines.push(`1. 最佳求财方位：${shengP ? shengP.direction + '方（生门所在）' : bestJiDirection + '方'}。生门为财富之门，${shengP ? `今落${shengP.gong}宫，${shengP.shengKe === '生我' ? '生助之局最为有利，' : ''}生门得星「${shengP.xing}」主导财运。` : ''}${shengP && shengP.isZhiFu ? '生门逢值符，财运亨通，大吉大利。' : ''}`);
    lines.push(`2. 投资方向：${kaiP ? kaiP.direction + '方（开门）' : bestJiDirection + '方'}和${shengP ? shengP.direction + '方（生门）' : zhiFuDirection + '方'}为最佳投资方位。`);
    lines.push(`3. ${tianxinP ? `天心星落${tianxinP.gong}宫，主谋划策略，投资前宜在此方静心谋划。` : ''}`);
    lines.push(`4. 财不入急门，${jiPalaces.length >= 4 ? '财运整体向好，但也需稳扎稳打' : '财运需耐心经营，不可贪图快钱'}。${xiongPalaces.length > 0 ? `避免在${xiongPalaces.map(p => p.direction + '方').join('、')}进行重要财务决策。` : ''}`);
  } else if (purpose === '婚姻') {
    const liuheP = shenToPalace.get('六合');
    const xiuP = menToPalace.get('休');
    const shengP = menToPalace.get('生');
    const taiyinP = shenToPalace.get('太阴');

    lines.push(`您求问婚姻感情事宜，综合奇门盘局，建议如下：`);
    lines.push(`1. 婚缘最佳方位：${liuheP ? liuheP.direction + '方（六合所在）' : bestJiDirection + '方'}。六合为婚姻和合之神，${liuheP ? `今落${liuheP.gong}宫，在此方约会、求婚、定亲最为有利。` : ''}${liuheP && liuheP.isZhiFu ? '六合得值符之位，婚姻美满和谐，极为有利。' : ''}`);
    lines.push(`2. ${xiuP ? `「休门」落${xiuP.gong}宫（${xiuP.direction}方），休门利于感情修复和缓和关系，若有矛盾可于此方沟通化解。` : ''}`);
    lines.push(`3. ${shengP ? `「生门」落${shengP.gong}宫，生门主生育，${shengP.isZhiFu ? '生门在值符宫，' : ''}利于怀孕生子。` : ''}`);
    lines.push(`4. ${taiyinP ? `「太阴」落${taiyinP.gong}宫（${taiyinP.direction}方），暗中助缘，可在此方摆放成双物件以催旺桃花。` : ''}`);
    lines.push(`5. ${xiongPalaces.some(p => p.men === '死' || p.men === '惊' || p.shen === '白虎') ? `注意：感情中避免在${xiongPalaces.filter(p => p.men === '死' || p.men === '惊' || p.shen === '白虎').map(p => p.direction + '方（' + p.gong + '宫）').join('、')}谈论敏感话题，以免发生争吵。` : ''}`);
  } else if (purpose === '健康') {
    const tianruiP = xingToPalace.get('天芮');
    const xiuP = menToPalace.get('休');
    const siP = menToPalace.get('死');
    const tianxinP = xingToPalace.get('天心');

    lines.push(`您求问健康事宜，综合奇门盘局，建议如下：`);
    lines.push(`1. 健康养护方位：${xiuP ? xiuP.direction + '方（休门所在）' : bestJiDirection + '方'}。休门主休养康复，宜朝向此方休整养生。`);
    lines.push(`2. 特别注意：${tianruiP ? `天芮星（病星）落${tianruiP.gong}宫（${tianruiP.direction}方），家中此方位若有污秽杂物应及时清理，不宜久待。` : ''}${siP ? `「死门」落${siP.gong}宫（${siP.direction}方），此方能量对健康不利，尤其重病之人应避开此方位。` : ''}`);
    lines.push(`3. ${tianxinP ? `天心星（医药之星）落${tianxinP.gong}宫（${tianxinP.direction}方），求医问药宜朝向此方，易遇良医良药。` : ''}`);
    lines.push(`4. ${palaces.some(p => p.shen === '九天') ? `九天所临之宫宜做户外运动、锻炼身体。` : ''}${palaces.some(p => p.shen === '九地') ? `九地所临之宫宜做静养、冥想、太极等慢运动。` : ''}`);
  } else {
    lines.push(`您求问综合运势，以下为当前时空下最重要的行动指南：`);
    lines.push(`1. 贵人方位：${zhiFuDirection}方。值符所在，遇事往此方寻求帮助最易得贵人相助。`);
    lines.push(`2. 最佳行动方位：${bestJiDirection}方。全局吉庆之宫所在，宜朝此方向办事求财。`);
    lines.push(`3. 吉门方位：${jiPalaces.slice(0, 3).map(p => p.direction + '方（' + p.gong + '宫）').join('、')}，办事、出行、谈判均宜选此三方。`);
    lines.push(`4. 避忌方位：${xiongPalaces.slice(0, 3).map(p => p.direction + '方（' + p.gong + '宫）').join('、')}，此方宜静不宜动。`);
    lines.push(`5. 当前局象${dunType}${juShu}局，值符${zhiFuPalace.xing}在${zhiFuPalace.gong}宫，建议以${zhiFuPalace.gong === '离' ? '光明正大' : zhiFuPalace.gong === '坎' ? '智慧谋略' : zhiFuPalace.gong === '震' ? '积极主动' : zhiFuPalace.gong === '巽' ? '顺势而为' : zhiFuPalace.gong === '乾' ? '刚健果断' : zhiFuPalace.gong === '坤' ? '厚德载物' : zhiFuPalace.gong === '兑' ? '以和为贵' : zhiFuPalace.gong === '艮' ? '静待时机' : '中正平和'}的策略应对当前局势。`);
  }

  lines.push('');
  lines.push(`—— 以上分析基于奇门遁甲数理模型，请结合实际情况理性参考 ——`);

  return lines.join('');
}

export { LUOSHU, BA_MEN, JIU_XING, BA_SHEN, JIU_GONG };
