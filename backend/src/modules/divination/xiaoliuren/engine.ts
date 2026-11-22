import { Solar } from 'lunar-javascript';

export interface XiaoLiuRenResult {
  position: string;
  index: number;
  name: string;
  fortune: string;
  direction: string;
  meaning: string;
  suggestion: string;
}

const NAMES = ['大安','留连','速喜','赤口','小吉','空亡'];

export const XIAOLIUREN_POSITIONS = [
  { name:'大安', fortune:'大吉', direction:'东方', meaning:'身不动时，五行属木，颜色青色，方位东方。临青龙，凡谋事主一、五、七。', suggestion:'大安事事昌，求谋在东方，失物不远去，宅舍保安康。' },
  { name:'留连', fortune:'中平', direction:'北方', meaning:'人未归时，五行属水，颜色黑色，方位北方。临玄武，凡谋事主二、八、十。', suggestion:'留连事难成，求谋日不明，官事只宜缓，去者未回程。' },
  { name:'速喜', fortune:'小吉', direction:'南方', meaning:'人便至时，五行属火，颜色红色，方位南方。临朱雀，凡谋事主三、六、九。', suggestion:'速喜喜来临，求财向南行，失物申午见，行人路上寻。' },
  { name:'赤口', fortune:'凶', direction:'西方', meaning:'官事凶时，五行属金，颜色白色，方位西方。临白虎，凡谋事主四、七、十。', suggestion:'赤口主口舌，官非切要防，失物急去寻，行人有惊慌。' },
  { name:'小吉', fortune:'吉', direction:'北方', meaning:'人来喜时，五行属水，颜色黑色，方位北方。临六合，凡谋事主一、五、七。', suggestion:'小吉最吉昌，路上好商量，失物即见在，行人立便至。' },
  { name:'空亡', fortune:'大凶', direction:'中央', meaning:'音信稀时，五行属土，颜色黄色，方位中央。临勾陈，凡谋事主三、六、九。', suggestion:'空亡事不长，阴人小乖张，求财无利益，行人有灾殃。' },
];

// month/day 为农历；hour 为 0-23（子时 23-1，按标准时支划分）。
export function xiaoLiuRenDivine(month: number, day: number, hour: number): XiaoLiuRenResult {
  const m = month || 1, d = day || 1;
  const hi = Math.floor(((hour || 0) + 1) / 2) % 12;
  const index = ((m - 1 + d - 1 + hi) % 6 + 6) % 6;
  return { ...XIAOLIUREN_POSITIONS[index], index, position: NAMES[index] };
}

export function quickDivine(): XiaoLiuRenResult {
  const now = new Date();
  const lunar = Solar.fromDate(now).getLunar();
  return xiaoLiuRenDivine(Math.abs(lunar.getMonth()), lunar.getDay(), now.getHours());
}

export function randomDivine(): XiaoLiuRenResult {
  const idx = Math.floor(Math.random() * 6);
  return { ...XIAOLIUREN_POSITIONS[idx], index: idx, position: NAMES[idx] };
}
