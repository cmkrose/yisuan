// 真太阳时校正：经度差 + 均时差（近似公式）。
// 中国标准时以 120°E 为准，经度每差 1° 约 4 分钟；均时差采用常见近似公式（分钟）。

export interface TrueSolarResult {
  year: number;
  month: number;
  day: number;
  hour: number;
  offsetMinutes: number;
}

const BRANCH_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export function hourBranchName(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  const bi = Math.floor((h + 1) / 2) % 12;
  return `${BRANCH_NAMES[bi]}时`;
}

export function computeTrueSolar(year: number, month: number, day: number, hour: number, longitude: number): TrueSolarResult {
  const base = new Date(year, month - 1, day, hour, 0, 0);
  const yearStart = new Date(year, 0, 0);
  const dayOfYear = Math.floor((base.getTime() - yearStart.getTime()) / 86400000);
  const B = (2 * Math.PI * (dayOfYear - 81)) / 364;
  const equationOfTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const offsetMinutes = (longitude - 120) * 4 + equationOfTime;
  const corrected = new Date(base.getTime() + offsetMinutes * 60000);
  return {
    year: corrected.getFullYear(),
    month: corrected.getMonth() + 1,
    day: corrected.getDate(),
    hour: corrected.getHours() + corrected.getMinutes() / 60,
    offsetMinutes: Math.round(offsetMinutes),
  };
}
