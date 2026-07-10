import { PROMPTS, AiReport, AiRequest } from './prompts';

export class LlmClient {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.LLM_API_KEY || '';
    this.baseUrl = process.env.LLM_BASE_URL || 'https://api.deepseek.com/v1';
    this.model = process.env.LLM_MODEL || 'deepseek-chat';
  }

  async chat(systemPrompt: string, userMessage: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('LLM_API_KEY not configured');
    }

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`LLM API error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || '{}';
    } catch (err: any) {
      if (err.message?.includes('fetch')) {
        throw new Error('无法连接到AI服务，请检查网络或API配置');
      }
      throw err;
    }
  }
}

export class AiReportEngine {
  private llm: LlmClient;

  constructor() {
    this.llm = new LlmClient();
  }

  async analyze(req: AiRequest): Promise<AiReport> {
    const hasApi = process.env.LLM_API_KEY;

    if (!hasApi) {
      return this.fallbackAnalysis(req);
    }

    try {
      const { promptType, prompt } = this.buildPrompt(req);
      const userMsg = `用户问题: ${req.question}`;
      const raw = await this.llm.chat(prompt, userMsg);
      return this.parseResponse(raw);
    } catch (err) {
      console.error('LLM analysis failed, using fallback:', err);
      return this.fallbackAnalysis(req);
    }
  }

  private buildPrompt(req: AiRequest): { promptType: string; prompt: string } {
    let promptType: string;
    let prompt: string;

    if (req.categories.length >= 2) {
      promptType = 'comprehensive';
      prompt = PROMPTS.comprehensive
        .replace('{{baziData}}', JSON.stringify(req.baziData || '无', null, 2))
        .replace('{{ziweiData}}', JSON.stringify(req.ziweiData || '无', null, 2))
        .replace('{{divinationData}}', JSON.stringify(req.divinationData || '无', null, 2))
        .replace('{{question}}', req.question);
    } else if (req.categories.includes('divination')) {
      promptType = 'divination';
      prompt = PROMPTS.divination
        .replace('{{divinationData}}', JSON.stringify(req.divinationData || {}, null, 2))
        .replace('{{question}}', req.question);
    } else if (req.categories.includes('ziwei')) {
      promptType = 'ziwei';
      prompt = PROMPTS.ziwei
        .replace('{{ziweiData}}', JSON.stringify(req.ziweiData || {}, null, 2))
        .replace('{{question}}', req.question);
    } else {
      promptType = 'bazi';
      prompt = PROMPTS.bazi
        .replace('{{baziData}}', JSON.stringify(req.baziData || {}, null, 2))
        .replace('{{question}}', req.question);
    }

    return { promptType, prompt };
  }

  private parseResponse(raw: string): AiReport {
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as AiReport;
      }
    } catch (e) {}

    return this.generateStructuredFromText(raw);
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

    // Bazi fallback
    if (bazi?.analysis?.dayMasterAnalysis) {
      const dm = bazi.analysis.dayMasterAnalysis;
      overviewParts.push(`八字日主${dm.dayMaster}(${dm.element})，${dm.strength}，格局${bazi.analysis.pattern?.name || '未定'}。`);
      if (dm.favorableGods?.length) {
        strengths.push(`命局喜神：${dm.favorableGods.slice(0, 2).join('、')}`);
        suggestions.push(`宜多接触${dm.favorable.slice(0, 2).join('、')}属性的事物`);
      }
      if (dm.unfavorableGods?.length) {
        cautions.push(`忌神：${dm.unfavorableGods.slice(0, 2).join('、')}，需注意相关年份`);
      }
    }

    // Ziwei fallback
    if (ziwei?.palaces) {
      const mingPalace = ziwei.palaces[0];
      if (mingPalace) {
        overviewParts.push(`紫微命盘命宫${mingPalace.stem}${mingPalace.branch}，身宫${ziwei.bodyPalace}。`);
        const majorStars = mingPalace.majorStars?.map((s: any) => s.name).join('、');
        if (majorStars) strengths.push(`命宫主星：${majorStars}`);
      }
    }

    // Divination fallback
    if (divData?.hexagramName) {
      overviewParts.push(`${divData.hexagramName}，${divData.meaning || ''}。`);
      if (divData.changedHexagram) {
        cautions.push(`变卦${divData.changedHexagram.name}，提示事情可能有变数`);
      }
    }

    if (q.includes('事业') || q.includes('工作')) {
      suggestions.push('当前宜稳中求进，积累实力');
      suggestions.push('注意人际关系，贵人方位在有利方向');
    }
    if (q.includes('财运') || q.includes('财富')) {
      suggestions.push('开源节流，稳健理财为主');
      strengths.push('正财运稳定，宜通过主业积累');
    }
    if (q.includes('婚姻') || q.includes('感情')) {
      suggestions.push('相互包容理解，注重沟通');
      strengths.push('感情缘分需要双方共同经营');
    }
    if (suggestions.length < 2) suggestions.push('顺其自然，保持积极心态', '多听长辈或专业人士建议');

    return {
      overview: overviewParts.join(' ') || `根据您的${req.categories.join('、')}数据综合分析，整体运势平稳。`,
      strengths: strengths.length > 0 ? strengths : ['命局基础稳固', '运势有上升空间'],
      cautions: cautions.length > 0 ? cautions : ['需注意健康作息', '投资需谨慎'],
      suggestions: suggestions.length > 0 ? suggestions : ['保持平和心态', '稳扎稳打'],
      luckyElements: bazi?.analysis?.dayMasterAnalysis?.favorable
        ? { colors: bazi.analysis.dayMasterAnalysis.favorable.length > 0 ? ['按喜用神选择'] : ['红色','金色'],
            numbers: [3, 8], directions: ['东方','东南'] }
        : undefined,
    };
  }

  private generateStructuredFromText(text: string): AiReport {
    return {
      overview: text.substring(0, 200) || '分析结果已生成',
      strengths: ['综合分析已生成', '请查看详情'],
      cautions: ['建议参考命盘数据', '多维度综合分析'],
      suggestions: ['定期查看运势变化', '保持积极心态'],
    };
  }
}
