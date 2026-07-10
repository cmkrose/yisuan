export interface PalmAnalysisResult {
  lifeLine: { name: string; quality: string; desc: string; ageHint: string; score: number };
  wisdomLine: { name: string; quality: string; desc: string; traits: string; score: number };
  emotionLine: { name: string; quality: string; desc: string; relationship: string; score: number };
  careerLine: { name: string; quality: string; desc: string; direction: string; score: number };
  marriageLine: { count: number; quality: string; desc: string; score: number };
  successLine: { quality: string; desc: string; score: number };
  mounts: { name: string; quality: string; desc: string; score: number }[];
  overallScore: number;
  overallFortune: string;
  healthSummary: string;
  suggestions: string[];
}

const LIFE_LINES = [
  { name:'生命线深长', quality:'优质', desc:'线条清晰深长，弧度优美，环绕拇指根部', ageHint:'精力充沛，生命力旺盛，有望长寿', score:92 },
  { name:'生命线清晰', quality:'良好', desc:'线条清晰可见，弧度适中，连贯不断', ageHint:'体质较好，中年注意保养可享高寿', score:82 },
  { name:'生命线分支', quality:'普通', desc:'线条在中段出现分支，向不同方向延伸', ageHint:'人生有转折或迁徙，中年后运势多变', score:72 },
  { name:'生命线浅短', quality:'偏弱', desc:'线条较浅，长度偏短，弧度较小', ageHint:'体质稍弱，需注意健康保养，劳逸结合', score:60 },
  { name:'生命线断续', quality:'需关注', desc:'线条在中途出现断裂或交错纹路', ageHint:'生命中有重大变化或健康挑战，谨慎应对', score:48 },
];

const WISDOM_LINES = [
  { name:'智慧线通达', quality:'优秀', desc:'线条清晰修长，贯穿手掌中部', traits:'思维敏捷，判断力强，善于分析和决策', score:93 },
  { name:'智慧线平直', quality:'良好', desc:'线条平直延伸，纹路清晰', traits:'理性务实，做事有条理，适合技术型工作', score:85 },
  { name:'智慧线弯曲', quality:'有创意', desc:'线条向下弯曲，延伸至月丘位置', traits:'想象力丰富，艺术天赋高，适合创意行业', score:80 },
  { name:'智慧线短促', quality:'普通', desc:'线条偏短，止于中指下方', traits:'思维直接，反应快速，但缺乏长远规划', score:65 },
  { name:'双智慧线', quality:'特殊', desc:'两条平行的智慧线同时存在', traits:'多才多艺，可以同时处理多个领域的事务', score:88 },
];

const EMOTION_LINES = [
  { name:'感情线圆满', quality:'优秀', desc:'线条清晰完整，止于食指和中指之间', relationship:'感情专一，婚姻美满，家庭生活和谐幸福', score:90 },
  { name:'感情线上扬', quality:'良好', desc:'线条向上延伸至食指根部', relationship:'感情热烈浪漫，对伴侣充满热情和关爱', score:85 },
  { name:'感情线平直', quality:'理性', desc:'线条平直延伸，纹路清晰', relationship:'感情理性务实，善于经营婚姻，但缺乏浪漫', score:78 },
  { name:'感情线下垂', quality:'感性', desc:'线条向下弯曲至智慧线附近', relationship:'感情丰富细腻，但容易多愁善感，需增强自信', score:70 },
  { name:'感情线分叉', quality:'波动', desc:'线条末端出现分叉，多向延伸', relationship:'感情经历丰富，有多次重要感情际遇', score:65 },
];

const CAREER_LINES = [
  { name:'事业线明朗', quality:'优秀', desc:'线条贯穿掌心，清晰有力', direction:'事业有成，步步高升，有明确的职业发展方向', score:90 },
  { name:'事业线渐强', quality:'上升', desc:'线条从中部开始逐渐加深', direction:'事业需厚积薄发，中年后运势强劲上升', score:82 },
  { name:'事业线曲折', quality:'多变', desc:'线条蜿蜒曲折，时有转折', direction:'事业发展多起伏，需要灵活应变和不断调整', score:70 },
  { name:'双事业线', quality:'多元', desc:'两条事业线并行或交错', direction:'适合多元发展，可同时经营主业和副业', score:85 },
  { name:'事业线浅淡', quality:'隐现', desc:'线条若有若无，不够清晰', direction:'事业方向尚在探索中，需明确目标持续努力', score:62 },
];

const MARRIAGE_LINES = [
  { count:1, quality:'专一', desc:'一条清晰的婚姻线，象征稳定的感情生活', score:88 },
  { count:2, quality:'丰富', desc:'两条婚姻线，感情经历较丰富，可遇良缘', score:78 },
  { count:3, quality:'多情', desc:'三条婚姻线，感情世界多彩，人缘极佳', score:72 },
  { count:0, quality:'待缘', desc:'婚姻线不明显，缘分未至或独身主义倾向', score:65 },
];

const SUCCESS_LINES = [
  { quality:'明显', desc:'成功线清晰可见，事业顺利，名利双收', score:88 },
  { quality:'渐显', desc:'成功线随年龄渐显，大器晚成之象', score:75 },
  { quality:'微弱', desc:'成功线若有若无，需加倍努力方可成功', score:60 },
  { quality:'交叉', desc:'成功线有交叉纹路，机遇与挑战并存', score:70 },
];

const MOUNTS = [
  { name:'金星丘(拇指根部)', desc:'代表爱情与生命力，丰隆者精力充沛' },
  { name:'木星丘(食指下方)', desc:'代表权力与野心，发达者有领导才能' },
  { name:'土星丘(中指下方)', desc:'代表智慧与稳重，饱满者深思熟虑' },
  { name:'太阳丘(无名指下)', desc:'代表艺术与成功，隆起者富有创造力' },
  { name:'水星丘(小指下方)', desc:'代表沟通与财运，发达者善交际' },
  { name:'月丘(掌缘外侧)', desc:'代表想象力与旅行运，丰隆者浪漫爱自由' },
];

export function analyzePalm(): PalmAnalysisResult {
  const seed = (key: string) => {
    let h = 0; for (let i = 0; i < key.length; i++) h = ((h << 5) - h) + key.charCodeAt(i);
    return Math.abs(h);
  };

  const pick = <T,>(arr: T[], key: string): T => arr[seed(key) % arr.length];
  const scoreFrom = (min: number, max: number, key: string): number => min + (seed(key) % (max - min + 1));

  const lifeLine = pick(LIFE_LINES, 'life');
  const wisdomLine = pick(WISDOM_LINES, 'wisdom');
  const emotionLine = pick(EMOTION_LINES, 'emotion');
  const careerLine = pick(CAREER_LINES, 'career');
  const marriageLine = pick(MARRIAGE_LINES, 'marriage');
  const successLine = pick(SUCCESS_LINES, 'success');

  const mounts = MOUNTS.map((m) => ({
    ...m,
    quality: ['丰隆饱满','发育良好','平正适中','略有低陷'][seed(m.name) % 4],
    desc: m.desc,
    score: scoreFrom(60, 90, m.name),
  }));

  const avgScore = Math.round(
    (lifeLine.score + wisdomLine.score + emotionLine.score + careerLine.score + marriageLine.score + successLine.score) / 6
  );

  return {
    lifeLine,
    wisdomLine,
    emotionLine,
    careerLine,
    marriageLine,
    successLine,
    mounts,
    overallScore: avgScore,
    overallFortune: `手相整体评分${avgScore}分，${
      avgScore >= 80 ? '掌心明润，掌纹清晰，运势亨通，万事可期' :
      avgScore >= 65 ? '掌纹分布尚可，运势平稳，努力可得改善' :
      '掌纹偏弱，宜积极面对，运势可通过后天努力改变'
    }`,
    healthSummary: `生命线显示${
      lifeLine.score >= 75 ? '体质较好，平时注意保持即可' : '需多加关注身体健康，定期体检'
    }`,
    suggestions: [
      '保持手掌清洁柔软，掌纹清晰则运势更佳',
      '多锻炼手部力量，太阳丘隆起有助于提升创造力',
      '留意握拳时掌纹变化，每日变化暗示运势起伏',
      '掌中如有朱砂痣或元宝纹，皆为富贵之兆',
    ],
  };
}
