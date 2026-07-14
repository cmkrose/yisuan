import { Injectable, Logger } from '@nestjs/common';
import { calculateEightMansion, calculateFlyingStars, getCompassData, analyzeHouse, STAR_NAMES, SHAN_ELEMENT, ER_SHI_SI_SHAN, SHAN_BAGUA } from './core';

@Injectable()
export class FengshuiService {
  private readonly logger = new Logger(FengshuiService.name);

  eightMansion(dto: { birthYear: number; gender: 'male' | 'female' }) {
    this.logger.log(`八宅: ${dto.birthYear} ${dto.gender}`);
    const result = calculateEightMansion(dto.birthYear, dto.gender);
    return {
      ...result,
      analysis: this.generateEightMansionAnalysis(result),
    };
  }

  flyingStars(dto: { year: number }) {
    this.logger.log(`飞星: ${dto.year}`);
    const result = calculateFlyingStars(dto.year);
    return {
      ...result,
      analysis: this.generateFlyingStarsAnalysis(result),
    };
  }

  compass() {
    return getCompassData();
  }

  analyze(dto: { year: number; facing: string }) {
    this.logger.log(`住宅分析: ${dto.year} ${dto.facing}`);
    return analyzeHouse(dto.year, dto.facing);
  }

  yangHouse(dto: { facing: string; year: number }) {
    this.logger.log(`阳宅分析: ${dto.facing} ${dto.year}`);
    const feixing = calculateFlyingStars(dto.year);
    const house = analyzeHouse(dto.year, dto.facing);
    return {
      type: '阳宅',
      facing: dto.facing,
      year: dto.year,
      flyingStars: feixing,
      houseAnalysis: house,
      summary: this.generateYangHouseSummary(dto.facing, feixing, house),
      keyPoints: this.generateYangHouseKeyPoints(dto.facing, feixing),
    };
  }

  yinHouse(dto: { location: string; direction: string }) {
    this.logger.log(`阴宅分析: ${dto.location} ${dto.direction}`);
    return {
      type: '阴宅',
      location: dto.location,
      direction: dto.direction,
      compass: getCompassData(),
      summary: this.generateYinHouseSummary(dto.location, dto.direction),
      keyPoints: this.generateYinHouseKeyPoints(dto.location, dto.direction),
    };
  }

  private generateEightMansionAnalysis(result: any): string {
    const { birthGua, birthElement, isEastFour, favorableDirections, unfavorableDirections } = result;

    const guaPersonalities: Record<string, string> = {
      坎: `命卦为坎卦，五行属水。坎为水，象征智慧、流动与险陷。坎命之人天生聪颖，思维敏捷，善于随机应变，具有敏锐的直觉和深沉的内在力量。水性之人外柔内刚，表面平静内心却富有波澜，为人处世圆融通达。坎命之人适合从事脑力劳动、学术研究、文化交流、传媒等行业。性格上需要注意避免过度保守、犹豫不决的倾向，宜多培养决断力和行动力。坎卦对应人体的肾脏、膀胱和生殖系统，需注意这些方面的健康养生。`,
      坤: `命卦为坤卦，五行属土。坤为地，象征包容、柔顺与厚德。坤命之人天性宽厚仁慈，待人真诚，稳重踏实，具有极强的包容心和忍耐力，如大地般承载万物。坤卦之人为人低调谦和，不喜张扬，做事有条不紊，善于规划和管理。坤命之人适合从事教育、医疗、房地产、农业、服务等行业，以德行服人。性格上需要注意避免过于保守、缺乏主动进取心的问题，宜培养自信和决断力。坤卦对应人体的脾胃和腹部，饮食调理尤为重要。`,
      震: `命卦为震，五行属木。震为雷，象征行动、生机与威严。震命之人天性刚健有力，充满活力和进取心，行动力强，敢作敢当，如春雷般奋发向上。震卦之人天生具有领导才能和开创精神，不畏艰难，勇往直前。震命之人适合从事管理、创业、军警、体育等行业。性格上需要注意避免过于急躁、冲动行事的倾向，宜培养耐心和细腻的一面。震卦对应人体的肝胆和筋脉，注意保护肝脏，避免过度劳累和情绪波动。`,
      巽: `命卦为巽，五行属木。巽为风，象征渗透、传播与柔顺。巽命之人天性温和灵动，心思细腻，善解人意，具有极强的沟通能力和协调能力，如风般渗透万物。巽卦之人才思敏捷，善于学习新事物，适应能力强。巽命之人适合从事教育、传媒、外交、贸易、艺术等行业。性格上需要注意避免优柔寡断、见风使舵的倾向，宜培养坚定的立场和原则。巽卦对应人体的肝胆和经络，注意保持规律作息，适度运动疏肝理气。`,
      乾: `命卦为乾，五行属金。乾为天，象征刚健、创造与权威。乾命之人天性刚强正直，意志坚定，胸怀大志，具有强烈的进取心和领导才能，如天行健般自强不息。乾卦之人做事果断，有大格局思维，不拘小节，适合担任领导岗位。乾命之人适合从事管理、金融、法律、科技等行业。性格上需要注意避免过于刚愎自用、独断专行的倾向，宜培养包容和柔和的品质。乾卦对应人体的头部和肺部，注意呼吸系统的保养，避免过度操劳。`,
      兑: `命卦为兑，五行属金。兑为泽，象征喜悦、沟通与变革。兑命之人天性开朗乐观，口才出众，善于社交，具有极强的表达能力和亲和力，如泽水般滋润人心。兑卦之人天生具有艺术气质和审美眼光，善于发现生活中的美好。兑命之人适合从事演艺、传媒、法律、公关、销售等行业。性格上需要注意避免言语过于直率伤人、情绪起伏过大的倾向，宜培养沉稳和内敛。兑卦对应人体的口腔、咽喉和肺部，注意呼吸系统的保养。`,
      艮: `命卦为艮，五行属土。艮为山，象征静止、稳固与坚守。艮命之人天性沉稳踏实，意志坚定，做事有始有终，如大山般稳健可靠。艮卦之人不尚空谈，注重实际，做事一步一个脚印，是值得信赖的合作伙伴。艮命之人适合从事科研、技术、金融、房地产等行业。性格上需要注意避免过于固执保守、不懂得灵活变通的倾向，宜培养开放的心态和创新精神。艮卦对应人体的骨骼、关节和脾胃，注意消化系统和骨骼健康。`,
      离: `命卦为离，五行属火。离为火，象征光明、热情与文明。离命之人天性热情开朗，聪明美丽，富有创造力，如火焰般温暖明亮，具有极强的感染力和影响力。离卦之人才华横溢，善于表现自我，追求美好的事物。离命之人适合从事艺术、设计、娱乐、教育、互联网等行业。性格上需要注意避免热情过度导致三分钟热度、过于依赖外在认可的倾向，宜培养持之以恒的精神和内在独立。离卦对应人体的心脏、眼睛和血管，注意心血管健康和情绪调节。`,
    };

    const gua = guaPersonalities[birthGua] || `命卦为${birthGua}，五行属${birthElement}。`;

    const groupInfo = isEastFour
      ? `${birthGua}属东四命，与东四宅（坎、离、震、巽）气场相合，最宜居住在东四宅的住宅中。东四命之人适合在东、南、北、东南四个方位发展事业和安置重要空间。`
      : `${birthGua}属西四命，与西四宅（乾、坤、艮、兑）气场相合，最宜居住在西四宅的住宅中。西四命之人适合在西、西北、东北、西南四个方位发展事业和安置重要空间。`;

    const goodRoomAdvice = favorableDirections.map((d: any) => {
      const advice: Record<string, string> = {
        '生气': `生气方在${d.direction}(${d.shan})，此为最吉祥之方位。适合作为主卧室、客厅，宜在此方安床、设大门，能增旺人丁、催旺财运。在此方位长期居住或活动，能得贵人扶持，事业顺遂，家庭和睦，子孙昌盛。`,
        '天医': `天医方在${d.direction}(${d.shan})，次吉之方位。适合作为书房、办公室、养生休闲区，利于健康运和学业运。在此方位摆放绿色植物或水晶摆件，可增强治疗疾病、化解灾厄的力量。家中有病人或读书学子，宜在此方活动。`,
        '延年': `延年方在${d.direction}(${d.shan})，小吉之方位。适合作为老人房、待客厅、婚房，利于婚姻和谐和人际关系。此方有助于增进家庭和睦、夫妻感情、社交人脉。在此方添置红色或粉色装饰品，可增强人缘桃花运。`,
        '伏位': `伏位方在${d.direction}(${d.shan})，平吉之方位。适合作为神位、储藏室、客房，利于稳定和安宁。此方气场平稳，适合作为祈祷、冥想或短暂休息的空间。`,
      };
      const rating = d.rating.replace(/\(.*\)$/, '');
      return advice[rating] || `吉方${d.direction}(${d.shan})，评级：${d.rating}。`;
    }).join('\n');

    const badRoomAdvice = unfavorableDirections.slice(0, 4).map((d: any) => {
      const advice: Record<string, string> = {
        '绝命': `绝命方在${d.direction}(${d.shan})，为大凶之方。此方最忌设主卧、厨房和大门。宜设置为卫生间、杂物间或空置不用。若无法避免，需在此方摆放金属制品、六帝钱或八卦镜以化解煞气。`,
        '五鬼': `五鬼方在${d.direction}(${d.shan})，为大凶之方，主口舌是非、火灾横祸。此方不宜设大门、主卧、厨房。宜设为卫生间或储物间。可摆放五帝钱、铜葫芦或红色物品以化解凶气。`,
        '六煞': `六煞方在${d.direction}(${d.shan})，为中凶之方，主感情纠纷、桃花劫煞。此方不宜设主卧和婚房。宜设为卫生间、洗衣房或储藏室。可摆放黑色或蓝色物品以化解煞气。`,
        '祸害': `祸害方在${d.direction}(${d.shan})，为小凶之方，主小人是非、破财耗气。此方不宜设大门和办公室。宜设为储物空间。可摆放绿色植物或水晶以转化负能量。`,
      };
      const rating = d.rating.replace(/\(.*\)$/, '');
      return advice[rating] || `凶方${d.direction}(${d.shan})，评级：${d.rating}。`;
    }).join('\n');

    const elementAdvice: Record<string, string> = {
      水: `${birthElement}命之人宜在家中增添金属性装饰（白色、金色），以金生水，增强命主能量。适合摆放金属摆件、圆形装饰、白色家具。宜养鱼或设水景，增强财运。忌讳土属性过重（黄色、棕色），因土克水。`,
      木: `${birthElement}命之人宜在家中增添水属性装饰（黑色、蓝色），以水生木，增强命主能量。适合摆放鱼缸、流水摆件、深色装饰。宜多养绿色植物，增强生机。忌讳金属性过重（白色、金色），因金克木。`,
      火: `${birthElement}命之人宜在家中增添木属性装饰（绿色），以木生火，增强命主能量。适合摆放绿色植物、木质家具、花卉。宜设置明亮灯光，增强阳气。忌讳水属性过重（黑色、蓝色），因水克火。`,
      土: `${birthElement}命之人宜在家中增添火属性装饰（红色、紫色），以火生土，增强命主能量。适合摆放红色摆件、暖色灯光、陶器。宜用暖色调装饰，增强稳重气场。忌讳木属性过重（绿色），因木克土。`,
      金: `${birthElement}命之人宜在家中增添土属性装饰（黄色、棕色），以土生金，增强命主能量。适合摆放陶瓷、石雕、暖色装饰。宜用方形设计，增强财运气场。忌讳火属性过重（红色、紫色），因火克金。`,
    };

    for (const [_, desc] of Object.entries(elementAdvice)) {
      if (desc.startsWith(birthElement)) {
        const finalAdvice = desc;
        return `${gua}\n\n${groupInfo}\n\n【吉利方位运用】\n${goodRoomAdvice}\n\n【凶煞方位规避】\n${badRoomAdvice}\n\n【五行调理建议】\n${finalAdvice}\n\n【日常生活应用】\n日常生活中应注意以下几点：一是大门宜开在吉方，若现有大门在凶方，可放置屏风或门帘化解；二是床位宜朝向吉方，头朝吉方而睡能增运；三是办公桌宜面向吉方，有利于事业发展；四是重要活动如签约、搬迁应选择吉方日期；五是凶方可安置镇物化解，但不宜长期在凶方逗留。每年流年飞星变化时，需根据当年飞星格局适当调整室内布局，以达到趋吉避凶之效果。`;
      }
    }

    return `${gua}\n\n${groupInfo}\n\n【吉利方位运用】\n${goodRoomAdvice}\n\n【凶煞方位规避】\n${badRoomAdvice}\n\n【五行调理建议】\n五行平衡是家居风水的核心，${birthElement}命之人应注重五行搭配。\n\n【日常生活应用】\n日常生活中应注意以下几点：一是大门宜开在吉方，若现有大门在凶方，可放置屏风或门帘化解；二是床位宜朝向吉方，头朝吉方而睡能增运；三是办公桌宜面向吉方，有利于事业发展；四是重要活动如签约、搬迁应选择吉方日期；五是凶方可安置镇物化解，但不宜长期在凶方逗留。每年流年飞星变化时，需根据当年飞星格局适当调整室内布局，以达到趋吉避凶之效果。`;
  }

  private generateFlyingStarsAnalysis(result: any): string {
    const { year, centerStar, grid, wealthPosition } = result;

    const palaceNames: Record<number, string> = {
      1: '正北', 2: '西南', 3: '正东', 4: '东南', 5: '中宫',
      6: '西北', 7: '正西', 8: '东北', 9: '正南',
    };

    const starDescriptions: Record<number, string> = {
      1: '一白贪狼星，属水，主官运、事业、人缘。此星所到之方利于事业发展、人际关系和考试运。适合在此方位设置书房、办公室，摆放水景或水晶球催旺运势。',
      2: '二黑巨门星，属土，主疾病、伤痛。此星所到之方为病符位，需特别防范健康问题。此方不宜设主卧、厨房，不宜动土装修。宜摆放金属物品或六帝钱化解病气。',
      3: '三碧禄存星，属木，主口舌、是非、官非。此星所到之方易引发口舌争斗和法律纠纷。不宜在此方设置大门和主卧。宜摆放红色物品或灯具以火泄木气化解。',
      4: '四绿文曲星，属木，主文昌、学业、姻缘。此星所到之方利于读书、考试和文艺创作。适合在此方设置书房或孩子的学习区，摆放文昌塔、毛笔或四支富贵竹催旺文运。',
      5: '五黄廉贞星，属土，为最大凶星，主灾祸、意外、重病。此星所到之方为大凶方位。此方绝对不宜动土、装修，不宜设主卧和大门。宜保持安静整洁，可悬挂金属风铃化解煞气。',
      6: '六白武曲星，属金，主偏财、权威、武贵。此星所到之方利于事业管理和偏财运。适合在此方设置财务区域或主管办公室，摆放金属摆件增强气场。',
      7: '七赤破军星，属金，主破财、盗窃、口舌。此星所到之方易有破财失窃或人际纠纷。不宜在此方放置贵重物品或保险柜。宜摆放蓝色或黑色物品以水泄金气化解。',
      8: '八白左辅星，属土，为当运大吉星，主正财、旺丁、富贵。此星所到之方为年度财位所在，适宜在此方设置财位、主卧或客厅，摆放聚宝盆、紫水晶洞、貔貅等招财物件，能大旺全年财运。',
      9: '九紫右弼星，属火，主喜庆、桃花、添丁。此星所到之方利于婚姻和添丁进口。适合在此方设置婚房或客厅，摆放红色鲜花或紫色装饰品催旺喜气。',
    };

    const gridAnalysis = grid.map((g: any) => {
      const palaceName = palaceNames[g.palace] || '未知';
      const starInfo = STAR_NAMES[g.star];
      const desc = starDescriptions[g.star] || `第${g.star}星在${palaceName}，${starInfo?.fortune || '未知'}星。`;
      return `${palaceName}(${g.palace}宫)：${desc}`;
    }).join('\n\n');

    const wealthAdvice = `本年正财位在${wealthPosition}方（八白左辅星所到之处），此为全年最重要的催财方位。建议在此方位摆放黄水晶、紫水晶洞、聚宝盆、貔貅、金蟾等招财物件。保持此方干净整洁、光线明亮，可在此位多活动、多停留，以吸收财气。若此方恰好是客厅或主卧，则财运更旺。若此方是卫生间，需立即化解——可在此方摆放金属摆件或绿色植物，并保持通风干燥。`;

    const dangerStars = grid.filter((g: any) => [2, 5, 3, 7].includes(g.star)).map((g: any) => ({
      palace: palaceNames[g.palace],
      star: g.star,
    }));

    const dangerAdvice = dangerStars.length > 0
      ? `本年需要特别注意的凶星方位：${dangerStars.map((d: any) => `${d.palace}(${STAR_NAMES[d.star]?.name}${STAR_NAMES[d.star]?.fortune})`).join('、')}。这些方位需保持安静整洁，不宜动土装修、敲打钻孔。建议在凶方摆放相应化煞物品：二黑位用金属化煞，五黄位用金属风铃，三碧位用红色物品，七赤位用蓝黑色物品。`
      : `本年各方位无重大凶星影响，但仍需保持整体家居的整洁和通风，定期调整家具布局以顺应流年能量变化。`;

    return `${year}年流年飞星风水详解\n\n` +
      `今年中宫为${centerStar}入中（${STAR_NAMES[centerStar]?.name}），主全年气运基调。${STAR_NAMES[centerStar]?.fortune === '大凶' ? '中宫为大凶星主宰，全年行事需格外谨慎稳重，避免冒险和大的变动。' : STAR_NAMES[centerStar]?.fortune === '吉' || STAR_NAMES[centerStar]?.fortune === '大吉' ? '中宫吉星高照，全年运势整体向好，适合积极进取。' : '中宫气场中平，宜稳步发展。'}\n\n` +
      `【各宫飞星详解】\n${gridAnalysis}\n\n` +
      `【财位布局指南】\n${wealthAdvice}\n\n` +
      `【凶位防范提醒】\n${dangerAdvice}\n\n` +
      `【年度综合建议】\n${year}年建议重点关注的方位：\n` +
      `一、财位（${wealthPosition}方）要重点催旺，可在此方位多放招财物件；\n` +
      `二、文昌位（四绿文曲星所在方位）适合学生学习，可摆放文昌塔；\n` +
      `三、桃花位（九紫右弼星所在方位）适合单身人士布置，摆放鲜花能催旺姻缘运；\n` +
      `四、五黄二黑所在方位避开动土和长时间逗留，如有必要请摆放化解物品；\n` +
      `五、建议在每季度初重新审视飞星布局，根据实际情况微调家具摆放和装饰布置。`;
  }

  private generateYangHouseSummary(facing: string, feixing: any, house: any): string {
    const facingElement = SHAN_ELEMENT[facing] || '未知';
    const facingBagua = SHAN_BAGUA[facing] || '未知';
    const wealthPos = feixing.wealthPosition;

    const facingAnalysis = this.getFacingDirectionAnalysis(facing, facingElement, facingBagua, wealthPos);

    return `阳宅风水综合分析报告\n\n` +
      `基本信息：房屋坐向为${facing}山（五行${facingElement}，八卦${facingBagua}宫），分析年份${feixing.year}年。\n\n` +
      `【一、坐向格局评估】\n` +
      `${facingAnalysis}\n\n` +
      `【二、五行能量分析】\n` +
      `房屋以${facingElement}为坐山五行，决定了整体的能量基调。${this.getElementEnergyAnalysis(facingElement)}` +
      `各空间区域的五行搭配应遵循生克关系：卧室宜用生扶坐山的五行，厨房忌用克制坐山的五行，客厅宜中和各五行以达到阴阳平衡。\n\n` +
      `【三、飞星吉凶分布】\n` +
      `${feixing.year}年本宅的财位在${feixing.wealthPosition}方。${this.getFeixingRoomAnalysis(feixing)}` +
      `飞星气场会随时间变化，建议每年立春后重新审视流年飞星图，对室内布局进行适当调整。\n\n` +
      `【四、房间布局建议】\n` +
      `1. 大门：宜开在吉方，门前整洁明亮，不宜堆积杂物。大门不对阳台或窗户，避免穿堂风直贯。大门颜色宜选择与坐山五行相生的颜色。\n` +
      `2. 客厅：宜设在房屋前半部近大门处，以纳生气。厅宜方正宽大，不宜狭长。沙发宜靠墙而放，形成靠山。财位宜在客厅的财位方，可摆放招财物件。\n` +
      `3. 主卧：宜在房屋的后半部，安静私密。床不宜对门、对镜、横梁压顶。床头宜靠实体墙，不宜悬空。根据命主八字选择最佳床头朝向。\n` +
      `4. 厨房：不宜设在房屋中央（火烧太极），不宜与卫生间相邻或相对。炉灶不宜对门、对窗。灶位宜朝向吉方。\n` +
      `5. 卫生间：宜设在凶方，以秽气压煞气。保持通风干燥、洁净卫生。卫生间门不宜对大门、厨房门、卧室门。\n` +
      `6. 书房：宜设在文昌位，安静明亮。书桌宜面向吉方，背后有靠。摆放文昌塔、文竹等助旺学业事业。\n\n` +
      `【五、家具摆放要诀】\n` +
      `沙发宜靠墙形成靠山，不宜后背悬空或背对门窗。床铺忌横梁压顶，若无法避免则设吊顶化解。餐桌宜圆宜方，避免尖角冲煞。柜类家具宜贴墙而立，不宜阻挡门窗通风。大型绿植宜放在财位和吉方，不宜放在凶方以免壮大煞气。鱼缸宜放在财位方（以水聚财），不宜放在卧室和厨房。\n\n` +
      `【六、色彩与装饰建议】\n` +
      `${this.getColorAdvice(facingElement)}` +
      `整体色彩搭配以不超过三种主色调为宜，避免过于花哨杂乱。装饰品以吉祥寓意为佳，如山水画（山管人丁水管财）、福禄寿三星、百福图等。避免悬挂猛兽、战争、抽象恐怖类图案。\n\n` +
      `【七、重要禁忌提醒】\n` +
      `1. 横梁不宜压床、压灶、压沙发、压办公桌。\n` +
      `2. 大门不宜直对后门、窗户、楼梯、电梯口（冲煞）。\n` +
      `3. 厨房与卫生间不可相邻、相对，水火相冲为大忌。\n` +
      `4. 房屋中央（太极点）不宜设卫生间、楼梯、大型家具。\n` +
      `5. 镜子不宜对床、对门、对窗户。\n` +
      `6. 尖锐墙角不宜直冲床铺和座位（角煞），可用绿植化解。\n` +
      `7. 室内不宜堆放过多杂物，保持气流通畅。`;
  }

  private getFacingDirectionAnalysis(facing: string, element: string, bagua: string, wealthPos: string): string {
    const directionMap: Record<string, string> = {
      子: `子山午向（坐北朝南）乃帝王之向。北为坎水位，坐山玄武得力，根基稳固深厚。南向离火，明堂开阔，阳光充溢，冬暖夏凉。此坐向通风采光俱为上佳，阴阳调和，藏风聚气，堪称最佳住宅格局。利事业根基，宜公职人员和创业人士居住。需注意北方宜高大稳重（靠山），南方宜开阔明亮（明堂）。`,
      午: `午山子向（坐南朝北）为火向水之势。南为离火坐山，阳气充沛；北为坎水朝向，财气流通。此坐向适合八字喜火之人，利于文化创意、教育传媒行业。需注意夏季南方炎热，宜加强遮阳；北方为财气来方，宜保持整洁开阔，可设水景聚财。`,
      卯: `卯山酉向（坐东朝西）为木向金之势。东为震木坐山，生机勃勃，朝气向上；西为兑金朝向，收敛收获，果实丰硕。上午采光充足，利于早起工作学习，利教育、科技、创新行业。需注意下午西晒问题，宜在西方窗户设遮阳；西方不宜有尖角煞冲。`,
      酉: `酉山卯向（坐西朝东）为金向木之势。西为兑金坐山，坐山稳定，气场收敛；东为震木朝向，朝阳初升，充满活力。晨光入室，适合早睡早起的生活习惯。利金融、法律、管理行业。需注意西方不宜有路冲或尖角煞；东方宜开阔明亮以纳朝阳之气。`,
    };

    for (const [key, text] of Object.entries(directionMap)) {
      if (facing === key) return text;
    }

    return `${facing}山坐向，五行属${element}，八卦属${bagua}宫。整体格局需结合具体环境和流年飞星综合分析。坐山为${element}，决定了房屋的能量主基调，朝向方为财气来方，宜保持开阔明亮以纳吉气。`;
  }

  private getElementEnergyAnalysis(element: string): string {
    const analyses: Record<string, string> = {
      水: `水主智，利学业和事业。水能量足则财源广进、智慧通达。宜在家居北方和财位方设置水景、鱼缸以增强水能量。需注意水火平衡，水过多则阴气过重，宜用暖色调和阳光调和。`,
      木: `木主仁，利生长和发展。木能量足则生机勃勃、家运兴旺。宜在家中东方和东南方多摆放绿植花卉以增强木能量。需注意木土平衡，木过旺易导致家人固执，宜用金属装饰加以调和。`,
      火: `火主礼，利名望和人缘。火能量足则家运红火、人气旺盛。宜在家居南方多使用暖色调和明亮灯光以增强火能量。需注意火水平衡，火过旺易导致家人急躁易怒，宜用水景和冷色调调和。`,
      土: `土主信，利稳定和根基。土能量足则家宅稳固、财运敦厚。宜在家居中部和西南方使用暖色调和陶瓷装饰以增强土能量。需注意土木平衡，土过多则家中死气沉沉，宜用绿植和木质家具激活生气。`,
      金: `金主义，利财富和决断。金能量足则财气凝聚、事业有成。宜在家居西方和西北方使用金属装饰和白色调以增强金能量。需注意金木平衡，金过旺易导致家人冷漠疏离，宜用绿植和暖色调调和。`,
    };
    return analyses[element] || `五行以${element}为主，需结合具体房型格局综合判断。`;
  }

  private getFeixingRoomAnalysis(feixing: any): string {
    const wealthPos = feixing.wealthPosition;
    const grid = feixing.grid;

    const palaceDirs: Record<number, string> = { 1: '北', 2: '西南', 3: '东', 4: '东南', 5: '中', 6: '西北', 7: '西', 8: '东北', 9: '南' };

    const goodStars = grid.filter((g: any) => [1, 6, 8, 9, 4].includes(g.star))
      .map((g: any) => `${palaceDirs[g.palace]}方有${STAR_NAMES[g.star]?.name}（${g.fortune}），宜设置重要空间。`)
      .join('');
    const badStars = grid.filter((g: any) => [2, 5, 3, 7].includes(g.star))
      .map((g: any) => `${palaceDirs[g.palace]}方有${STAR_NAMES[g.star]?.name}（${g.fortune}），宜安放化煞物品，不宜设置重要功能空间。`)
      .join('');

    return `${goodStars}\n${badStars}`;
  }

  private getColorAdvice(element: string): string {
    const advices: Record<string, string> = {
      水: `坐山属水，宜用白色（金生水）、金色、银灰色为主色调，可辅以黑色、深蓝色（本命色）。客厅可多用柔和白光灯饰，窗帘宜选轻薄通透的材质。不宜大面积使用黄色、棕色（土克水）。`,
      木: `坐山属木，宜用黑色、深蓝色（水生木）为主色调，可辅以绿色、青色（本命色）。客厅可多摆放绿植，窗帘宜选绿色系或带植物图案。不宜大面积使用白色、金色（金克木）。`,
      火: `坐山属火，宜用绿色、青色（木生火）为主色调，可辅以红色、紫色（本命色）。客厅可多用暖色灯光，适当加入红色装饰品点缀。不宜大面积使用黑色、深蓝色（水克火）。`,
      土: `坐山属土，宜用红色、紫色（火生土）为主色调，可辅以黄色、棕色、卡其色（本命色）。客厅可多用暖色灯光和陶器装饰。不宜大面积使用绿色（木克土）。`,
      金: `坐山属金，宜用黄色、棕色（土生金）为主色调，可辅以白色、金色、银色（本命色）。客厅可多用金属质感的装饰品和灯具。不宜大面积使用红色、紫色（火克金）。`,
    };
    return advices[element] || `根据五行生克原理，选择与坐山五行相生的颜色为主色调，辅以本命色，避免使用克制坐山五行的颜色。`;
  }

  private generateYangHouseKeyPoints(facing: string, feixing: any): string[] {
    const element = SHAN_ELEMENT[facing] || '未知';
    const wealthPos = feixing.wealthPosition;
    return [
      `大门方位：房屋坐向为${facing}山（五行${element}），大门宜朝向吉利方位，门前宜开阔明亮`,
      `财位布局：${feixing.year}年财位在${wealthPos}方，可在此方位摆放紫水晶、聚宝盆等招财物件`,
      `卧室布置：主卧宜设在房屋后半部的吉方，床头宜靠实墙，不宜对门窗`,
      `厨房禁忌：厨房不宜设房屋中央（火烧太极），灶台不宜对门对窗，宜朝向吉方`,
      `卫生间布局：卫生间宜设在凶方以秽气压煞，保持通风干爽，门不宜对大门和卧室门`,
      `五行平衡：居室配色以生扶${element}的色调为主，植物摆放结合五行生克`,
      `流年注意：根据${feixing.year}年飞星图，凶星方位需安放相应化煞物品`,
      `定期调整：建议每年立春后根据流年飞星变化，微调家居布局和装饰摆件位置`,
    ];
  }

  private generateYinHouseSummary(location: string, direction: string): string {
    const locationAnalysis = this.getYinHouseLocationAnalysis(location);
    const directionAnalysis = this.getYinHouseDirectionAnalysis(direction);

    return `阴宅风水勘选分析报告\n\n` +
      `选址信息：地形类型为${location}，预定坐向为${direction}。\n\n` +
      `【一、地形地势分析】\n` +
      `${locationAnalysis}\n\n` +
      `【二、坐向格局评估】\n` +
      `${directionAnalysis}\n\n` +
      `【三、龙脉分析】\n` +
      `龙脉是阴宅风水的首要考量。${this.getLongmaiAnalysis(location)}好的龙脉须来龙有力，去脉有情，蜿蜒起伏如游龙般灵动。` +
      `龙脉以活龙、生龙为上，死龙、病龙为下。选址时应观察后方山脉是否连绵不断、有无断裂破损。` +
      `若龙脉破损或被人为开挖破坏，则为断龙，不宜选用。落脉处（穴场）宜平缓开阔，不宜陡峭险峻。\n\n` +
      `【四、明堂评估】\n` +
      `明堂是墓穴前方的开阔空间，是聚气藏风的关键。${this.getMingtangAnalysis(location)}` +
      `理想的明堂需要：前方案山（近山）不宜过高过近，以免压迫明堂；朝山（远山）宜层次分明、高低错落，形成天然屏障；` +
      `明堂内部平坦开阔，不宜有坑洼、陡坎、乱石堆积。案山如案桌，朝山如朝拜，层层拱卫方为上佳格局。\n\n` +
      `【五、水法分析】\n` +
      `水法为阴宅选址的重中之重，所谓"山管人丁水管财"。${this.getWaterAnalysis(location)}` +
      `来水宜弯曲有情，绕抱墓穴为吉；去水宜蜿蜒而去，不宜直冲直泄。` +
      `水口（来水与去水交汇处）宜狭窄紧锁，使财气不散。水形忌反弓（水弯曲向外）、冲射（水直冲墓穴）、割脚（水紧贴墓基）、` +
      `淋头（水从高处垂直落下）。若水流声大或流速过急，皆为不吉。\n\n` +
      `【六、选址关键要素】\n` +
      `1. 来龙去脉：后靠之山宜高大稳重，绵延不断，层次分明\n` +
      `2. 明堂开阔：前方空间宜平坦宽敞，聚气而不散气\n` +
      `3. 水法得当：水宜环抱弯绕，不可反弓直冲\n` +
      `4. 案山朝山：前方有山作为屏障，一重案山一重朝山为佳\n` +
      `5. 左右龙虎：左右之山宜环抱护卫，不可开口或缺损\n` +
      `6. 四象俱全：后方玄武（靠山）、前方朱雀（明堂）、左方青龙、右方白虎，四象具备方为吉地\n` +
      `7. 土壤质地：土壤宜细腻润泽，不宜砂石遍布或过于潮湿\n` +
      `8. 避开煞气：避开高压线、铁路、公路直冲、庙宇祠堂的冲煞\n\n` +
      `【七、禁忌与注意事项】\n` +
      `1. 不宜在水口直冲处选址，财气易散\n` +
      `2. 不宜在悬崖边或陡坡上选址，根基不稳\n` +
      `3. 不宜在寺庙、道观附近选址，阴阳气场相冲\n` +
      `4. 不宜在坟墓密集处中间安葬，气场混杂\n` +
      `5. 不宜在道路直冲处、桥梁直冲处选址\n` +
      `6. 不宜在枯竭水源附近选址，死气沉沉\n` +
      `7. 坐向需结合逝者的生辰八字来确定，以求天人合一\n` +
      `8. 建议聘请专业风水师实地勘查，结合自然环境综合判断`;
  }

  private getYinHouseLocationAnalysis(location: string): string {
    if (location === '山区') {
      return `山区地形为阴宅选址的首选之地。山势雄伟、峰峦叠嶂，龙脉之气最为充沛。选址时需注意山形须端庄秀丽，不可狰狞破碎。后靠之山（玄武山）宜高大稳重，呈环抱之势；前方视野宜开阔，能远眺数重山峦为佳。左右之山（青龙、白虎）宜对称拱卫，层次分明。山谷不宜过于狭窄阴暗，否则阴气过重；也不宜居于山顶，风大散气。最佳位置在山腰平缓处，前有流水环绕，后有高山依靠，藏风聚气，堪称风水宝地。`;
    }
    if (location === '平原') {
      return `平原地形龙脉之气较为散逸，选址需格外注重微地形变化。平原以"高一寸为山，低一寸为水"为原则。略高之处可视为龙脉，略低之处可视为水法。选址时应注意选择微隆起之地，后方宜略高于前方，形成自然的靠山之势。需避开低洼积水处（阴湿过重）和孤立高处（风大散气）。平原阴宅宜配合人工改造，如种植树木形成屏障、开挖水渠引导水势等。平原选址更需注重周围环境的整体格局，若周围有河渠环绕、树木成林，则为佳地。`;
    }
    return `水边地形选址需特别注重水法。水为财，但水的形态至关重要。水流宜弯曲环抱，如"玉带环腰"之状，不可反弓直冲。坟墓宜与水保持适当距离，不可太近而受水气侵蚀（割脚水），也不可太远而失去水法之益。水边宜选在高埠处，略高于水面，视野开阔，面临水而背靠陆。水边选址需考虑防洪和水位变化，长期被水浸泡之地不宜使用。若水边有缓坡入水，坡上绿树成荫，水清景美，则为上佳水边阴宅之地。`;
  }

  private getYinHouseDirectionAnalysis(direction: string): string {
    const analyses: Record<string, string> = {
      '坐北朝南': `坐北朝南为阴宅最经典、最吉祥的坐向。北方为玄武位，背靠北山，稳如泰山；南方为朱雀位，朝向阳光，阳气充沛。此坐向冬暖夏凉，光照充足，气场最为稳定和谐。北方宜有高山作为依靠，南方明堂宜开阔平坦，远有朝山呼应，近有案山拱卫。左右龙虎山宜环抱有情，形成天然太师椅格局。`,
      '坐南朝北': `坐南朝北需特别注意阴阳平衡。南方为离火，阳气过旺；北方为坎水，阴气较重。此坐向需北方有水系或低洼处聚气，南方宜有山峦遮挡过强的阳光。适合八字喜火或从事文化事业家族的先人。需注意夏季南方山的绿化覆盖，避免暴晒导致地气燥热。`,
      '坐东朝西': `坐东朝西以东为靠山（青龙方），西为朝向（白虎方）。东方为震木之位，代表生机和发展；西方为兑金之位，代表收获和终结。此坐向上午阳光充足，下午夕阳斜照。东方宜有高大山脉或树林，西方宜开阔但不宜过于空旷。适合从事教育、科技、创新行业的家族先人。`,
      '坐西朝东': `坐西朝东以西为靠山（白虎方），东为朝向（青龙方）。西方为兑金之位，代表收获和财富；东方为震木之位，代表新生和希望。此坐向晨光充足，生机勃勃。西方宜稳重厚实，东方宜开阔明亮。适合从事金融、法律、管理行业的家族先人。`,
      '坐西北朝东南': `坐西北朝东南以西北乾位为靠山，东南巽位为朝向。乾为天，为父，代表权威和领导力；巽为风，代表传播和发展。此坐向适合家族中有从政、从军或担任领导职务的先人。西北宜高大稳重，有威严之势；东南宜通风良好，气流顺畅。`,
      '坐西南朝东北': `坐西南朝东北以西南坤位为靠山，东北艮位为朝向。坤为地，为母，代表包容和养育；艮为山，代表稳固和坚守。此坐向适合家族中以德服人、德高望重的先人。西南宜平坦厚重，东北宜有山形呼应。`,
      '坐东北朝西南': `坐东北朝西南以东北艮位为靠山，西南坤位为朝向。艮为山，代表稳固和后继有人；坤为地，代表包容和财富。此坐向利于家族子孙昌盛和财富积累。东北宜有山峦稳固，西南宜开阔纳气。`,
      '坐东南朝西北': `坐东南朝西北以东南巽位为靠山，西北乾位为朝向。巽为风，代表渗透和发展；乾为天，代表事业和成就。此坐向适合从事商贸、外交、传媒行业的家族先人。东南宜通风顺畅，西北宜有山形屏障。`,
    };
    return analyses[direction] || `${direction}坐向需结合具体地形地貌综合判断。好的坐向应做到坐山有力、朝向开阔、左右环抱、阴阳平衡。建议实地勘察后确定最佳坐向角度，以罗盘精确测定。`;
  }

  private getLongmaiAnalysis(location: string): string {
    if (location === '山区') return `山区龙脉最为明显。观龙先看山脉的走向、形态、高低、起伏。真龙之气蜿蜒起伏如波浪，有起有伏、有曲有伸。龙脉以"生"、"活"、"秀"、"清"为上，忌"死"、"硬"、"浊"、"乱"。`;
    if (location === '平原') return `平原龙脉隐伏于地下，需观察微地形、水系走向和植被分布。高一寸为山（龙），低一寸为水。平原观龙重在"望气"，观察草木生长态势、土壤色泽与湿度。`;
    return `水边龙脉沿水系两岸分布，多呈现为沿河岸的缓坡或台地。水边观龙需观察河岸形态和水流方向，水曲则龙驻，水直则龙行。`;
  }

  private getMingtangAnalysis(location: string): string {
    if (location === '山区') return `山区明堂宜平坦开阔，呈"锅底"状微凹，聚气效果好。明堂前方不宜过于陡峭下倾（漏气），也不宜前方有高山阻挡（阻气）。`;
    if (location === '平原') return `平原明堂较难辨识，以视野开阔、微呈凹陷之势为佳。明堂内不宜有大型建筑物或构筑物阻挡视线和气场流动。`;
    return `水边明堂宜在墓穴与水之间，明堂内宜平坦整洁，前方水面开阔为佳。"明堂容万马，水口不通舟"——明堂宜阔，水口宜窄，方为佳格。`;
  }

  private getWaterAnalysis(location: string): string {
    if (location === '山区') return `山区水法看溪流和山谷走向。溪流宜从龙脉侧面弯曲流过墓穴前方（玉带水），不宜从后方直流而过（冲背水）。`;
    if (location === '平原') return `平原地带水法主要看河流、沟渠和道路（虚水）。道路如虚水，弯曲环抱为吉，直冲直射为凶。`;
    return `水边水法最为关键。水面宜平静清澈，水流宜缓慢弯曲。墓穴宜在水流的"抱"弯内侧（凸岸），不可在"反"弯处（凹岸）。`;
  }

  private generateYinHouseKeyPoints(location: string, direction: string): string[] {
    const basePoints = [
      `来龙去脉：山脉走向须有情有意，来势雄健有力，去脉蜿蜒有情，不可直冲墓地`,
      `明堂开阔：前方空间宜平坦开阔，有聚气之势，案山朝山层次分明`,
      `水法讲究：水流环抱为吉、反弓为凶，水口宜紧锁不宜敞泄`,
      `案山朝山：前方远近各有山峦作为屏障，一重案山一重朝山为佳`,
      `左右护持：左青龙右白虎有山峦或高地为护持，不可开口或缺损`,
      `坐向选择：需结合逝者生前的生辰八字来确定最佳坐向角度`,
      `土壤质地：穴场土壤宜五色土、润而不燥、细腻不粗，忌砂石遍布`,
      `避开忌讳：远离高压线、铁路直冲、庙宇正对、坟场中心等不良地形`,
    ];

    if (location === '山区') {
      basePoints.push('山形端正：周边山形宜端庄秀丽，忌狰狞破碎或像刀剑形状');
    }
    if (location === '平原') {
      basePoints.push('人工造势：可适当植树造林形成屏障，开挖渠塘引导水法走向');
    }
    if (location === '水边') {
      basePoints.push('防洪防潮：注意水位变化和防洪，墓穴宜选在高埠处以防水浸');
    }

    return basePoints;
  }
}
