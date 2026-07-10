const LUOSHU = [4, 9, 2, 3, 5, 7, 8, 1, 6];

const BA_MEN = ['休','生','伤','杜','景','死','惊','开'] as const;
const JIU_XING = ['天蓬','天芮','天冲','天辅','天禽','天心','天柱','天任','天英'] as const;
const BA_SHEN = ['值符','螣蛇','太阴','六合','白虎','玄武','九地','九天'] as const;
const JIU_GONG = ['坎','坤','震','巽','中','乾','兑','艮','离'] as const;
const WUXING = { 坎:'水',坤:'土',震:'木',巽:'木',中:'土',乾:'金',兑:'金',艮:'土',离:'火' };
const YANGDUN = true;
const YINDUN = false;

export interface QimenPalace {
  gong: string;              // 宫位名
  number: number;            // 洛书数
  direction: string;         // 方位
  men: string;               // 八门
  xing: string;              // 九星
  shen: string;              // 八神
  tianPan: string;           // 天盘干
  diPan: string;             // 地盘干
  wuxing: string;            // 五行
  shengKe: string;           // 生克关系
  isZhiFu: boolean;          // 是否值符宫
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

  // Determine Yang/Yin Dun based on Jie Qi (simplified)
  const yangDun = [1,2,3,4,5,6].includes(month); // 上半年阳遁

  // Determine Ju Shu based on the day stem-branch
  const juShu = ((year + month + day) % 9) || 9;

  // Determine Yuan (上中下元)
  const yuan = day <= 10 ? '上元' : day <= 20 ? '中元' : '下元';

  // Build 9 palaces
  const palaces: QimenPalace[] = [];

  const directionMap: Record<number, string> = { 1:'北',2:'西南',3:'东',4:'东南',5:'中',6:'西北',7:'西',8:'东北',9:'南' };

  for (let i = 0; i < 9; i++) {
    const num = LUOSHU[i];
    const gongIdx = (i + juShu) % 9;
    const gong = JIU_GONG[gongIdx];

    // Door rotation
    const menIdx = yangDun ? (juShu - 1 + i) % 8 : (8 - (juShu - 1) - i + 8) % 8;
    // Star rotation
    const xingIdx = (juShu - 1 + i) % 9;
    // God rotation
    const shenIdx = yangDun ? i % 8 : (8 - i) % 8;

    // Heavenly/earthly stem plates (simplified)
    const tg = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    const tianGanIdx = (juShu + i) % 10;
    const diGanIdx = (i * 2) % 10;

    palaces.push({
      gong,
      number: num,
      direction: directionMap[num],
      men: BA_MEN[menIdx],
      xing: JIU_XING[xingIdx],
      shen: BA_SHEN[shenIdx],
      tianPan: tg[tianGanIdx],
      diPan: tg[diGanIdx],
      wuxing: WUXING[gong as keyof typeof WUXING],
      shengKe: num === LUOSHU[2] ? '值符' : '',
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

export { LUOSHU, BA_MEN, JIU_XING, BA_SHEN, JIU_GONG };
