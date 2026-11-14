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

export class AiReportEngine {
  analyzeLocal(req: AiRequest): AiReport {
    return this.fallbackAnalysis(req);
  }

  private fallbackAnalysis(req: AiRequest): AiReport {
    const q = req.question || '整体运势';
    const bazi = req.baziData;
    const ziwei = req.ziweiData;
    const divData = req.divinationData;

    const overviewParts: string[] = [];
    const strengths: string[] = [];
    const cautions: string[] = [];
    const suggestions: string[] = [];

    if (bazi?.analysis?.dayMasterAnalysis) {
      const dm = bazi.analysis.dayMasterAnalysis;
      overviewParts.push(`八字日主${dm.dayMaster}(${dm.element})，${dm.strength}，格局${bazi.analysis.pattern?.name || '未定'}。命局中五行力量的分布决定了运势的基本走向，日主的强弱直接影响着对大运流年的承受能力。当前大运对命局的影响需要综合分析，以确定最佳的发展策略。`);
      if (dm.favorableGods?.length) {
        strengths.push(`命局喜神${dm.favorableGods.slice(0, 2).join('、')}得力，有利于在相关领域获得发展机会。喜用神的力量增强时，运势会呈现上升趋势，适合积极把握机遇。`);
        suggestions.push(`宜多接触${dm.favorable.slice(0, 2).join('、')}属性的事物，如方位、颜色、行业等，可以增强运势的正面影响。在日常生活中有意识地融入喜用神元素，有助于提升整体运势。`);
      }
      if (dm.unfavorableGods?.length) {
        cautions.push(`忌神${dm.unfavorableGods.slice(0, 2).join('、')}需注意，在相关年份或大运中可能出现不利影响。建议提前做好防范措施，避免在忌神力量强盛时做重大决策。`);
      }
    }

    if (ziwei?.palaces) {
      const mingPalace = ziwei.palaces[0];
      if (mingPalace) {
        overviewParts.push(`紫微命盘命宫${mingPalace.stem}${mingPalace.branch}，身宫${ziwei.bodyPalace}。命宫主星的组合决定了个人的性格特质和行为模式，身宫则反映了后天发展的方向和潜力。`);
        const majorStars = mingPalace.majorStars?.map((s: any) => s.name).join('、');
        if (majorStars) strengths.push(`命宫主星${majorStars}，赋予了独特的人格魅力和天赋能力，在相关领域容易获得成就。`);
      }
    }

    if (divData?.hexagramName) {
      overviewParts.push(`${divData.hexagramName}，${divData.meaning || ''}。卦象反映了当前事物发展的状态和趋势，蕴含着重要的启示信息。`);
      if (divData.changedHexagram) {
        cautions.push(`变卦${divData.changedHexagram.name}，提示事情可能有变数，建议保持灵活应变的态度，不宜过于执着于既定计划。`);
      }
    }

    if (q.includes('事业') || q.includes('工作')) {
      suggestions.push('当前宜稳中求进，积累实力。事业发展中要注重能力的全面提升，同时把握有利时机展现自己的才华。');
      suggestions.push('注意人际关系的维护，贵人方位在有利方向。多与志同道合的人交流合作，可以借助团队力量推动事业发展。');
      suggestions.push('制定清晰的职业规划，分阶段实现目标。避免好高骛远，脚踏实地做好每一件事。');
      strengths.push('事业方面存在发展空间，能否把握取决于运势配合与个人努力。');
    }
    if (q.includes('财运') || q.includes('财富')) {
      suggestions.push('开源节流，稳健理财为主。投资决策需谨慎，不宜过于激进，建议分散投资降低风险。');
      suggestions.push('正财运稳定，宜通过主业积累财富。副业收入可作为补充，但不宜投入过多精力。');
      strengths.push('财运有波动机会，宜稳健理财、量力而行。');
    }
    if (q.includes('婚姻') || q.includes('感情')) {
      suggestions.push('相互包容理解，注重沟通。感情中要保持真诚和耐心，避免因小事产生误会。');
      suggestions.push('缘分需要双方共同经营，不宜过于急躁。在合适的时机表达心意，成功率更高。');
      strengths.push('感情方面有发展机会，仍需双方用心经营。');
    }

    if (suggestions.length < 2) suggestions.push('顺其自然，保持积极心态，把握当下有利条件。', '多听长辈或专业人士建议，借助外力完善自己的决策。');
    if (strengths.length < 2) strengths.push('命局基础稳固，运势有上升空间。');
    if (cautions.length < 1) cautions.push('需注意健康作息，保持良好的生活习惯。');

    const favorable: string[] = bazi?.analysis?.dayMasterAnalysis?.favorable || [];
    const dmBase = bazi?.analysis?.dayMasterAnalysis;
    const strengthText = dmBase?.strength || '未明';
    const isStrong = strengthText.includes('强');
    const isWeak = strengthText.includes('弱');
    const overallAnalysis = `从命理结构看，日主${dmBase?.dayMaster || '未知'}（${dmBase?.element || '未知'}），${strengthText}，格局${bazi?.analysis?.pattern?.name || '未定'}。` +
      (isStrong ? '日主偏强，喜泄耗克，得运时宜主动作为，失运时宜收敛锋芒。' : isWeak ? '日主偏弱，喜生扶，得助时宜稳步推进，失助时宜守成蓄力。' : '日主较为中和，宜随大运流年节奏调整，保持稳健。') +
      '以上为模板化分析，吉凶需结合大运流年综合判断，不作定论。';
    const futureTrend = (isStrong ? '未来趋势取决于泄耗克是否到位：' : isWeak ? '未来趋势取决于生扶是否得力：' : '未来趋势偏于平稳，重点在把握流年节奏：') +
      '得运时积极、失运时收敛，避免预设必然向好。建议保持稳健策略，并关注关键时间节点。';

    return {
      overview: overviewParts.join(' ') || `根据您的${req.categories.join('、')}数据综合分析，整体运势平稳，命局基础较好。当前阶段适合稳中求进，把握有利时机推动个人发展。`,
      overallAnalysis,
      causeAnalysis: `当前运势的形成是先天命格与后天运势共同作用的结果。命局中的五行平衡状态为运势发展奠定了基础，大运流年的变化则直接影响着具体事件的发生。从命理学角度看，当前阶段的运势既有命局先天因素的影响，也有大运流年后天因素的作用。理解这些因素的相互关系，有助于更好地把握机遇和应对挑战。`,
      strengths: strengths.length > 0 ? strengths : ['命局基础稳固，先天条件优越', '当前运势有上升空间，把握机遇可获发展', '贵人运较好，人际关系有利于事业发展'],
      cautions: cautions.length > 0 ? cautions : ['需注意健康作息，保持良好的生活习惯', '投资理财需谨慎，避免冲动决策'],
      suggestions: suggestions.length > 0 ? suggestions : ['保持平和心态，稳扎稳打', '多听长辈建议，借助外力完善决策'],
      futureTrend,
      luckyElements: luckyFor(favorable),
      baziInsight: bazi?.analysis?.dayMasterAnalysis ? `从八字角度分析，日主${bazi.analysis.dayMasterAnalysis.dayMaster}(${bazi.analysis.dayMasterAnalysis.element})，${bazi.analysis.dayMasterAnalysis.strength}，格局${bazi.analysis.pattern?.name || '未定'}。命局中的五行关系决定了个人的核心特质和发展方向。` : undefined,
      ziweiInsight: ziwei?.palaces ? `从紫微斗数角度分析，命宫主星组合反映了个人的天赋能力和行为模式。命盘中各宫位的互动关系影响着运势的各个方面。` : undefined,
      divinationInsight: divData?.hexagramName ? `从占卜角度分析，${divData.hexagramName}卦象反映了当前事物发展的状态。卦辞和爻辞蕴含着重要的启示信息，值得深入思考和领悟。` : undefined,
    };
  }
}

export const aiEngine = new AiReportEngine();
