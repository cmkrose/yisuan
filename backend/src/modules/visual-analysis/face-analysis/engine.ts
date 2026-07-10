export interface FaceAnalysisResult {
  faceShape: { name: string; desc: string; fortune: string };
  forehead: { name: string; desc: string; score: number };
  eyebrows: { name: string; desc: string; score: number };
  eyes: { name: string; desc: string; score: number };
  nose: { name: string; desc: string; score: number };
  mouth: { name: string; desc: string; score: number };
  ears: { name: string; desc: string; score: number };
  chin: { name: string; desc: string; score: number };
  twelvePalaces: { name: string; position: string; fortune: string; desc: string; score: number }[];
  overallScore: number;
  overallFortune: string;
  careerFortune: string;
  wealthFortune: string;
  loveFortune: string;
  healthNote: string;
  suggestions: string[];
}

const FACE_SHAPES = [
  { name:'圆脸', desc:'面容饱满，额头宽阔，地阁方圆', fortune:'福相之征，主性格温和，待人宽厚，一生福禄双全'},
  { name:'方脸', desc:'额头方正，颧骨明显，下颚有力', fortune:'刚毅之相，主行事果断，有领导才能，晚年安稳'},
  { name:'长脸', desc:'面部修长，三停匀称，轮廓分明', fortune:'清贵之相，主思维敏捷，善于谋划，中年有成'},
  { name:'椭圆脸', desc:'面如鹅卵，线条流畅，五官协调', fortune:'秀美之相，主人缘极佳，贵人运旺，一生平顺'},
  { name:'三角脸', desc:'上宽下窄，额头宽广，下巴尖削', fortune:'聪慧之相，主早年运势佳，晚年需守成'},
];

const FOREHEADS = [
  { name:'天庭饱满', desc:'额头宽阔隆起，光滑明亮', score:95 },
  { name:'额角峥嵘', desc:'额角分明，骨相挺拔', score:85 },
  { name:'额头平正', desc:'额头平整，宽窄适中', score:75 },
  { name:'额窄有纹', desc:'额头偏窄，略有纹理', score:60 },
];

const EYEBROWS = [
  { name:'剑眉入鬓', desc:'眉毛修长，眉尾上扬', score:90 },
  { name:'柳叶弯眉', desc:'眉形弯曲，柔美流畅', score:85 },
  { name:'一字横眉', desc:'眉毛平直，浓淡适中', score:75 },
  { name:'眉疏淡浅', desc:'眉毛稀疏，色泽偏淡', score:60 },
];

const EYES = [
  { name:'凤眼含威', desc:'眼形细长，眼角微扬，神采奕奕', score:95 },
  { name:'桃花明眸', desc:'眼大而圆，水润明亮，顾盼生辉', score:88 },
  { name:'丹凤朝阳', desc:'眼尾上翘，黑白分明，精神饱满', score:82 },
  { name:'细长有神', desc:'眼睛偏小但聚光，深邃有神', score:78 },
];

const NOSES = [
  { name:'悬胆鼻', desc:'鼻梁高挺，鼻头圆润，形如悬胆', score:92 },
  { name:'通天鼻', desc:'鼻梁直通印堂，山根高耸', score:88 },
  { name:'蒜头鼻', desc:'鼻头饱满，鼻翼丰厚', score:80 },
  { name:'鹰钩鼻', desc:'鼻梁高挺，鼻尖微勾', score:72 },
];

const MOUTHS = [
  { name:'四方口', desc:'口形方正，嘴角微翘，唇色红润', score:90 },
  { name:'樱桃小口', desc:'嘴唇小巧，唇线分明，色泽鲜艳', score:85 },
  { name:'仰月口', desc:'嘴角上扬如新月，天然笑意', score:82 },
  { name:'覆船口', desc:'嘴角微垂，唇形偏薄', score:65 },
];

const EARS = [
  { name:'双珠朝海', desc:'耳垂丰厚，耳廓分明，色泽白皙', score:92 },
  { name:'贴脑耳', desc:'耳朵紧贴头部，轮廓清晰', score:85 },
  { name:'招风耳', desc:'耳廓外展，形态较大', score:70 },
  { name:'轮廓分明', desc:'耳廓线条清晰，厚薄适中', score:78 },
];

const CHINS = [
  { name:'地阁方圆', desc:'下巴圆润饱满，宽厚有力', score:90 },
  { name:'尖下巴', desc:'下巴尖锐，线条流畅', score:75 },
  { name:'方下巴', desc:'下巴方正，棱角分明', score:82 },
  { name:'双下巴', desc:'下巴丰腴，有福德之相', score:88 },
];

const TWELVE_PALACES = [
  { name:'命宫', position:'印堂', fortune:'印堂开阔主一生顺遂，主28岁运势' },
  { name:'兄弟宫', position:'双眉', fortune:'眉清目秀主手足情深，主兄弟姐妹缘分' },
  { name:'夫妻宫', position:'眼尾眼角', fortune:'眼尾丰润主婚姻美满，主配偶品貌' },
  { name:'子女宫', position:'眼下泪堂', fortune:'眼下饱满主子息兴旺，主子女缘分' },
  { name:'财帛宫', position:'鼻子', fortune:'鼻梁挺直主财源广进，主财富运势' },
  { name:'疾厄宫', position:'山根', fortune:'山根高耸主体魄强健，主健康状况' },
  { name:'迁移宫', position:'额角鬓边', fortune:'额角宽广主出行顺利，主外出发展' },
  { name:'交友宫', position:'两腮', fortune:'腮骨丰满主贵人相助，主人际关系' },
  { name:'事业宫', position:'额头正中', fortune:'天庭饱满主事业有成，主功名成就' },
  { name:'田宅宫', position:'上眼皮', fortune:'眼皮丰润主房产运旺，主家宅安宁' },
  { name:'福德宫', position:'眉尾上方', fortune:'此处丰隆主福气深厚，主晚年福报' },
  { name:'父母宫', position:'日月角', fortune:'日月角隆主父母康健，主长辈缘分' },
];

export function analyzeFace(): FaceAnalysisResult {
  const seed = (key: string) => {
    let h = 0; for (let i = 0; i < key.length; i++) h = ((h << 5) - h) + key.charCodeAt(i);
    return Math.abs(h);
  };

  const pick = <T,>(arr: T[], key: string): T => arr[seed(key) % arr.length];
  const scoreFrom = (min: number, max: number, key: string): number => min + (seed(key) % (max - min + 1));

  const faceShape = pick(FACE_SHAPES, 'face');
  const forehead = pick(FOREHEADS, 'fore');
  const eyebrows = pick(EYEBROWS, 'brow');
  const eyes = pick(EYES, 'eye');
  const nose = pick(NOSES, 'nose');
  const mouth = pick(MOUTHS, 'mouth');
  const ears = pick(EARS, 'ear');
  const chin = pick(CHINS, 'chin');

  const palaces = TWELVE_PALACES.map((p) => ({
    ...p,
    fortune: p.fortune,
    desc: p.fortune.length > 20 ? p.fortune.substring(0, 18) + '...' : p.fortune,
    score: scoreFrom(65, 96, p.name),
  }));

  const avgScore = Math.round(
    (forehead.score + eyebrows.score + eyes.score + nose.score + mouth.score + ears.score + chin.score) / 7
  );

  const overallFortunes = [
    '天庭饱满，地阁方圆，整体面相端庄，福泽深厚之相',
    '五官端正，三停匀称，主一生平顺安泰，晚年享福',
    '骨相清奇，眉眼有神，主聪慧过人，中年运势上升',
    '面相敦厚，气势沉稳，主为人正直，事业步步高升',
  ];

  const careerTexts = [ '事业有贵人相助，宜在35-45岁把握时机', '适合从事管理或自主创业，领导力强劲', '宜稳扎稳打，中年后事业渐入佳境' ];
  const wealthTexts = [ '正财运稳健，宜储蓄投资并重', '中年财运旺盛，晚年后福深厚', '财帛宫丰隆，一生衣食无忧' ];
  const loveTexts = [ '夫妻宫饱满，感情生活和谐美满', '桃花运佳，宜在适龄时把握良缘', '婚姻稳定，夫妻相敬如宾' ];

  return {
    faceShape: { ...faceShape, fortune: faceShape.fortune },
    forehead: { ...forehead, desc: forehead.desc },
    eyebrows: { ...eyebrows, desc: eyebrows.desc },
    eyes: { ...eyes, desc: eyes.desc },
    nose: { ...nose, desc: nose.desc },
    mouth: { ...mouth, desc: mouth.desc },
    ears: { ...ears, desc: ears.desc },
    chin: { ...chin, desc: chin.desc },
    twelvePalaces: palaces,
    overallScore: avgScore,
    overallFortune: overallFortunes[seed('fortune') % overallFortunes.length],
    careerFortune: careerTexts[seed('career') % careerTexts.length],
    wealthFortune: wealthTexts[seed('wealth') % wealthTexts.length],
    loveFortune: loveTexts[seed('love') % loveTexts.length],
    healthNote: '疾厄宫显示体质尚可，注意规律作息和饮食均衡',
    suggestions: [
      '保持乐观积极心态，面色红润更显运势',
      '印堂宜保持光洁，不宜有疤痕或杂纹',
      '眉形自然舒展，象征心胸开阔气运亨通',
      '唇色红润为气血充足之象，注意养生调理',
    ],
  };
}
