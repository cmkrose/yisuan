import type { AiReport, AiRequest } from './prompts';

const ELEMENT_LUCKY: Record<string, { colors: string[]; numbers: number[]; directions: string[] }> = {
  木: { colors: ['青绿', '绿色'], numbers: [3, 8], directions: ['东方'] },
  火: { colors: ['红紫', '红色', '紫色'], numbers: [2, 7], directions: ['南方'] },
  土: { colors: ['黄棕', '黄色', '棕色'], numbers: [5, 0], directions: ['中宫及四隅'] },
  金: { colors: ['白金', '白色', '金色'], numbers: [4, 9], directions: ['西方'] },
  水: { colors: ['黑蓝', '黑色', '蓝色'], numbers: [1, 6], directions: ['北方'] },
};

function luckyFor(favorable: string[]) {
  const el = favorable.find((e) => ELEMENT_LUCKY[e]);
  if (!el) return { colors: ['按喜用神选择'], numbers: [] as number[], directions: ['按喜用神方位'] };
  return {
    colors: [...ELEMENT_LUCKY[el].colors],
    numbers: [...ELEMENT_LUCKY[el].numbers],
    directions: [...ELEMENT_LUCKY[el].directions],
  };
}

type QCat = 'wealth' | 'career' | 'love' | 'health' | 'study' | 'travel' | 'general';
const CAT_LABEL: Record<QCat, string> = {
  wealth: '财运/投资', career: '事业', love: '感情/婚姻', health: '健康',
  study: '学业/考试', travel: '出行/决策', general: '综合',
};

function detectCategory(question: string): { cat: QCat; matched: boolean } {
  const q = question || '';
  if (/投资|理财|股票|基金|财运|财富|钱|收入|破财|置业|买房|买楼|收益|亏/.test(q)) return { cat: 'wealth', matched: true };
  if (/事业|工作|升职|跳槽|创业|职业|官运|老板|同事|职场|求职/.test(q)) return { cat: 'career', matched: true };
  if (/感情|婚姻|恋爱|对象|结婚|脱单|桃花|伴侣|夫妻|复合/.test(q)) return { cat: 'love', matched: true };
  if (/健康|身体|疾病|养生|病|体检|睡眠|亚健康/.test(q)) return { cat: 'health', matched: true };
  if (/学业|考试|升学|学习|考研|考公|证书|成绩|offer|留学/.test(q)) return { cat: 'study', matched: true };
  if (/出行|搬家|远行|旅行|移居|决策|选择|签约|合作|官司|诉讼|跳不跳|去不去/.test(q)) return { cat: 'travel', matched: true };
  if (/综合|整体|全面|运势|命理|分析|怎么样/.test(q)) return { cat: 'general', matched: true };
  return { cat: 'general', matched: false };
}

const SHISHEN_HINT: Record<string, string> = {
  正财: '正财主稳定收入与务实积累', 偏财: '偏财主机会财、投资与人脉变现',
  正官: '正官主职位、规则与责任', 七杀: '七杀主压力、竞争与突发挑战',
  正印: '正印主学业、文书与长辈贵人', 偏印: '偏印主偏门学问与独特思维',
  食神: '食神主才华、口福与温和表达', 伤官: '伤官主才气、创新与锋芒',
  比肩: '比肩主自我、同辈与独立', 劫财: '劫财主魄力、争夺与合伙分利',
};

function shishenHint(s?: string) {
  return s ? (SHISHEN_HINT[s] || s) : '十神未明';
}

export class AiReportEngine {
  analyzeLocal(req: AiRequest): AiReport {
    return this.fallbackAnalysis(req);
  }

  private fallbackAnalysis(req: AiRequest): AiReport {
    const q = req.question || '整体运势';
    const bazi = req.baziData;
    const ziwei = req.ziweiData;
    const divData = req.divinationData;
    const { cat, matched } = detectCategory(q);
    const label = CAT_LABEL[cat];

    const dm = bazi?.analysis?.dayMasterAnalysis;
    const dayMaster = dm?.dayMaster || '未知';
    const dayEl = dm?.element || '未知';
    const strength = dm?.strength || '未明';
    const patternName = bazi?.analysis?.pattern?.name || '未定';
    const favorable: string[] = dm?.favorable || [];
    const unfavorable: string[] = dm?.unfavorable || [];
    const favText = favorable.length ? `喜用${favorable.join('、')}` : '喜用未明';
    const unfavText = unfavorable.length ? `忌${unfavorable.join('、')}` : '';
    const currentYear = new Date().getFullYear();
    const liunianList = bazi?.analysis?.liunian || [];
    const currentLiunian = liunianList.find((l: any) => l.year === currentYear) || liunianList[0];
    const birthYear = bazi?.input?.birthYear;
    const age = typeof birthYear === 'number' ? currentYear - birthYear : null;
    let currentDayun: any = null;
    if (age != null && Array.isArray(bazi?.analysis?.dayun)) {
      for (const decade of bazi.analysis.dayun) {
        const first = decade?.[0];
        if (first && age >= first.age && age <= first.age + 9) { currentDayun = first; break; }
      }
    }
    const dayunText = currentDayun
      ? `当前大运${currentDayun.stem}${currentDayun.branch}（${currentDayun.element}）`
      : '当前大运数据未取到';
    const liunianText = currentLiunian
      ? `当前流年${currentLiunian.year}为${currentLiunian.stem}${currentLiunian.branch}（${currentLiunian.shishen}）`
      : '当前流年数据未取到';
    const lnShi = currentLiunian?.shishen || '';
    const base = `日主${dayMaster}（${dayEl}）${strength}，格局${patternName}，${favText}${unfavText ? '，' + unfavText : ''}；${dayunText}，${liunianText}。`;

    let answer = '';
    let cause = '';
    let trend = '';
    let strengths: string[] = [];
    let cautions: string[] = [];
    let suggestions: string[] = [];

    if (cat === 'wealth') {
      let verdict = '以稳健理财为主，不宜重仓投机。';
      if (/财/.test(lnShi)) verdict = '流年见财星，求财与投资机会增多，但支出与诱惑也增，宜分批投入、设好止损。';
      else if (/劫|比/.test(lnShi)) verdict = '流年比劫偏旺，易有分利、竞争或冲动消费，投资不宜合伙与重仓。';
      else if (/官|杀/.test(lnShi)) verdict = '流年官杀主事，外部压力与规则约束强，投资宜保守、先控风险。';
      else if (/食|伤/.test(lnShi)) verdict = '流年食伤生财，适合凭技能与创意开源，但仍需控制杠杆。';
      else if (/印/.test(lnShi)) verdict = '流年印星主事，宜学习与稳健配置，不宜激进投机。';
      answer = `${verdict}${favorable.length ? `命局${favText}，可在${favorable.join('、')}属性行业/方位寻找机会；` : ''}${unfavorable.length ? `忌神${unfavorable.join('、')}当令时不宜加码。` : ''}`;
      cause = `依据：日主${dayMaster}${strength}，${favText}${unfavorable.length ? '、' + unfavText : ''}；${liunianText}，${shishenHint(lnShi)}。所以财运结论按“先看流年十神、再看喜忌能否承载”给出。`;
      trend = currentDayun ? `大运${currentDayun.stem}${currentDayun.branch}阶段，财运随流年十神起伏；${/财/.test(lnShi) ? '见财之年可把握，但需落袋为安。' : '未见财星时以主业与储蓄为主。'}` : '大运数据不足，财运以流年十神为主判断。';
      strengths = [`${favText}，可用以承接财星/食伤带来的机会。`, `日主${strength}，对财富的承载力需与风险匹配。`];
      cautions = ['忌在比劫旺年合伙、借贷或重仓单一标的。', '见财星之年支出同步增加，宜先设预算与止损。'];
      suggestions = ['把投资分为“稳健底仓 + 小比例机会仓”，底仓不因流年波动频繁调整。', `优先选择${favorable.join('、') || '喜用'}属性行业与方位的机会，避开${unfavorable.join('、') || '忌神'}过重的标的。`, '重大投资前先看当年流年十神与所在大运，避免在官杀/比劫压力最大时做决定。'];
    } else if (cat === 'career') {
      let verdict = '事业以稳中求进为主，先积累再求突破。';
      if (/官|杀/.test(lnShi)) verdict = '流年官杀主事，职位、责任与压力同步增加，宜守规则、抓正式平台机会。';
      else if (/印/.test(lnShi)) verdict = '流年印星主事，利学习、证书、长辈提携与平台内晋升。';
      else if (/食|伤/.test(lnShi)) verdict = '流年食伤主事，利表达、创作、技术与副业，但需防口舌与冲动顶撞。';
      else if (/财/.test(lnShi)) verdict = '流年财星主事，事业目标更偏结果与收益，宜用业绩说话。';
      else if (/劫|比/.test(lnShi)) verdict = '流年比劫主事，竞争与协作并存，宜借团队之力，不宜单打独斗。';
      answer = `${verdict}${currentDayun ? `当前行${currentDayun.stem}${currentDayun.branch}大运（${shishenHint(currentDayun.shishen)}），` : ''}${favorable.length ? `宜向${favorable.join('、')}属性行业/岗位靠拢。` : ''}`;
      cause = `依据：日主${dayMaster}${strength}，格局${patternName}，${favText}；${dayunText}，${liunianText}。事业判断以“日主能否担官杀/食伤、喜用是否到位”为主线。`;
      trend = currentDayun ? `本步大运${currentDayun.stem}${currentDayun.branch}期间，事业节奏随流年十神变化；${/官|杀/.test(lnShi) ? '官杀年宜争取正式职位。' : '非官杀年宜蓄力与打磨专业。'}` : '大运数据不足，事业以流年十神为主线。';
      strengths = [`日主${dayMaster}${strength}，${/官|杀/.test(lnShi) ? '官杀年有担责机会。' : '可按喜用方向积累专业。'}`, `${favText}，利在对应行业建立优势。`];
      cautions = ['伤官/七杀旺时防与上级、规则冲突。', '比劫旺年防同事竞争与合伙分歧。'];
      suggestions = ['把目标拆成“本年可交付的成果”，用结果争取平台认可。', `优先在${favorable.join('、') || '喜用'}属性的行业、岗位与方位发展。`, '跳槽/创业前先核对当年流年十神与大运是否同向，避免在压力年裸辞。'];
    } else if (cat === 'love') {
      const gender = (req as any)?.gender || bazi?.input?.gender;
      const spouseStar = gender === 'female' ? '正官/七杀' : '正财/偏财';
      let verdict = '感情宜慢热经营，重在沟通与边界。';
      if (/财|官|杀/.test(lnShi)) verdict = '流年见配偶星（财/官杀），感情机会增多，但需分辨质量、避免急于定论。';
      else if (/劫|比/.test(lnShi)) verdict = '流年比劫旺，感情中易有竞争、吃醋或第三方干扰，宜明确边界。';
      else if (/食|伤/.test(lnShi)) verdict = '流年食伤主事，表达欲强、桃花活跃，但需防口舌与情绪化。';
      else if (/印/.test(lnShi)) verdict = '流年印星主事，感情偏内敛，宜通过长辈/熟人介绍与稳定相处。';
      answer = `${verdict}（${gender === 'female' ? '女命' : '男命'}以${spouseStar}为配偶星）${currentDayun ? `当前${currentDayun.stem}${currentDayun.branch}大运，` : ''}${favorable.length ? `宜多接触${favorable.join('、')}属性的人与场合。` : ''}`;
      cause = `依据：日主${dayMaster}${strength}，${favText}；${liunianText}，${shishenHint(lnShi)}。感情判断先看配偶星是否出现，再看日支（夫妻宫）是否受冲合。`;
      trend = '感情走势看流年配偶星与夫妻宫引动：见财/官之年机会增，冲夫妻宫之年易有变动，宜提前沟通。';
      strengths = ['命局喜用明确，可按喜用属性筛选相处舒服的对象。', '日支夫妻宫稳定与否需结合流年冲合判断。'];
      cautions = ['比劫旺年防竞争与第三方干扰。', '伤官旺年防言语伤人、冲动分手。'];
      suggestions = ['把“价值观、生活节奏、金钱观”三项前置沟通，再谈长期。', '在见配偶星的流年主动扩大社交，但不因压力仓促定婚。', '冲夫妻宫之年减少冷战，用明确表达替代猜测。'];
    } else if (cat === 'health') {
      const counts = dm?.elementCounts || {};
      const maxEl = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0];
      answer = `健康以作息与情绪管理为先。${maxEl ? `命局${maxEl}偏旺，` : ''}${unfavorable.length ? `忌神${unfavorable.join('、')}当令时易有对应脏腑的负担，` : ''}${/官|杀/.test(lnShi) ? '流年官杀主事，压力与睡眠是重点。' : /食|伤/.test(lnShi) ? '流年食伤主事，注意饮食与情绪消耗。' : '流年以稳养为主，避免熬夜与过度透支。'}`;
      cause = `依据：日主${dayMaster}${strength}，${favText}${unfavorable.length ? '，' + unfavText : ''}；${liunianText}。健康按五行偏旺/偏弱对应脏腑与流年压力综合判断。`;
      trend = '健康趋势随大运流年五行起伏；忌神年与官杀压力年需提前体检与减负。';
      strengths = [`${favText}，可通过对应五行属性的作息/运动调和。`];
      cautions = ['忌神当令年注意对应脏腑与情绪。', '官杀旺年防压力性失眠、焦虑。'];
      suggestions = ['固定睡眠与运动节奏，比临时进补更重要。', `多接触${favorable.join('、') || '喜用'}属性的环境与活动，少熬夜。`, '有明显不适先就医，命理只作生活方式参考。'];
    } else if (cat === 'study') {
      answer = `${/印/.test(lnShi) ? '流年印星主事，利考试、证书与升学，适合系统学习。' : /食|伤/.test(lnShi) ? '流年食伤主事，利表达、创作与面试，但需防分心。' : '流年对学业的直接助力一般，宜靠计划与执行力。'}${currentDayun ? `当前${currentDayun.stem}${currentDayun.branch}大运（${shishenHint(currentDayun.shishen)}），` : ''}${favorable.length ? `宜在${favorable.join('、')}属性的学科/方向上深耕。` : ''}`;
      cause = `依据：日主${dayMaster}${strength}，${favText}；${dayunText}，${liunianText}。学业看印星（吸收）与食伤（输出）是否得力。`;
      trend = '学业走势看印星/食伤流年：印年利考学，食伤年利表达与实战。';
      strengths = [`日主${dayMaster}${strength}，${/印/.test(lnShi) ? '印星年吸收力强。' : '可按喜用方向稳定积累。'}`];
      cautions = ['食伤旺年防分心、熬夜与过度社交。', '财旺年防因兼职/实习挤占复习时间。'];
      suggestions = ['把目标拆成每周可完成的最小任务，按周复盘。', '考试/升学优先选喜用属性方向，避免只追热门。', '重要考试前用流年印星/食伤节奏安排冲刺与输出。'];
    } else if (cat === 'travel') {
      const hasYima = (bazi?.analysis?.extras?.shensha || []).some((s: any) => String(s.name).includes('驿马') && s.hits?.length);
      answer = `${hasYima ? '命带驿马且当前被引动，出行/迁动机会较多，' : '命局驿马不显，出行与变动宜主动规划，'}${/官|杀/.test(lnShi) ? '流年官杀主事，出行/签约易受规则与外部压力影响，宜留缓冲。' : /财/.test(lnShi) ? '流年财星主事，出行多为求财/办事，宜先算成本。' : '流年以稳为主，远行前做好备选方案。'}`;
      cause = `依据：日主${dayMaster}${strength}，${favText}；${liunianText}。出行/决策看驿马引动与流年十神压力。`;
      trend = '出行与变动看驿马与冲合引动：有引动则动象明显，无引动则宜稳。';
      strengths = [`${favText}，可选择对应方位出行/发展。`];
      cautions = ['官杀年签约/远行防规则与突发变动。', '冲夫妻宫/年支之年防家庭与出行冲突。'];
      suggestions = ['远行/搬迁前先做 A/B 方案，重要证件与预算留余量。', `优先选择${favorable.join('、') || '喜用'}方位办事。`, '重大决策避开情绪高峰，先写下“最坏结果能否承受”。'];
    } else {
      answer = `综合来看，日主${dayMaster}（${dayEl}）${strength}、格局${patternName}，${favText}${unfavorable.length ? '，' + unfavText : ''}；${dayunText}，${liunianText}。${currentDayun ? `本步大运${currentDayun.stem}${currentDayun.branch}（${shishenHint(currentDayun.shishen)}），` : ''}运势以“喜用是否到位、流年十神是否顺逆”为主线，宜稳中求进。`;
      cause = `依据：命局五行与日主强弱决定承载力，大运流年决定阶段性起伏；当前${liunianText}，${shishenHint(lnShi)}。`;
      trend = '未来趋势需结合下一步大运与流年十神判断；得运时积极、失运时收敛，避免预设必然向好。';
      strengths = [`${favText}，是命局可用的着力点。`, `日主${strength}，发展节奏宜与承载力匹配。`];
      cautions = ['忌神当令时避免逆势加码。', '流年冲合引动时注意情绪与决策节奏。'];
      suggestions = [`把资源集中在${favorable.join('、') || '喜用'}方向，减少${unfavorable.join('、') || '忌神'}方向的消耗。`, '每年先看流年十神，再定“进取/守成”策略。', '重大事项结合具体类别（财/官/婚/健康）分开判断。'];
    }

    const questionLead = `你问的是「${q}」。`;
    const scopePrefix = matched ? '' : `这个问题超出模板解读范围，先按最接近的「${label}」给解读：`;
    const overview = `${scopePrefix}${questionLead}${base}${answer}`;
    const overallAnalysis = `${questionLead}${base}${answer} ${cause}`;
    const futureTrend = trend;

    return {
      overview,
      overallAnalysis,
      causeAnalysis: cause,
      strengths: strengths.length ? strengths : ['命局信息有限，建议补充完整出生时间后再细化。'],
      cautions: cautions.length ? cautions : ['模板解读仅供参考，重大决策请结合现实信息。'],
      suggestions: suggestions.length ? suggestions : ['先补齐出生时间与地点，再做分项判断。'],
      futureTrend,
      luckyElements: luckyFor(favorable),
      baziInsight: dm ? `从八字看，日主${dayMaster}（${dayEl}）${strength}，格局${patternName}，${favText}；${dayunText}，${liunianText}。` : undefined,
      ziweiInsight: ziwei?.palaces ? `从紫微看，命宫${ziwei.palaces[0]?.stem || ''}${ziwei.palaces[0]?.branch || ''}，主星${(ziwei.palaces[0]?.majorStars || []).map((s: any) => s.name).join('、') || '—'}；可与会八字结论互参。` : undefined,
      divinationInsight: divData?.hexagramName ? `从占卜看，${divData.hexagramName}（${divData.meaning || ''}），可作为当前问题的旁证，不宜单凭卦象定论。` : undefined,
      bestTiming: currentLiunian ? `${currentLiunian.year}年（${currentLiunian.stem}${currentLiunian.branch}·${currentLiunian.shishen}）是当前应期参考；具体月份需结合月令。` : undefined,
    };
  }
}

export const aiEngine = new AiReportEngine();
