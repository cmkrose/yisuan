import { Solar, Lunar } from 'lunar-javascript';

export interface SolarDate { year: number; month: number; day: number; }
export interface LunarDate { year: number; month: number; day: number; isLeap: boolean; }

// 农历转公历；isLeap=true 表示闰月（lunar-javascript 以负月份表示闰月）。
export function lunarToSolar(year: number, month: number, day: number, isLeap: boolean): SolarDate {
  const m = isLeap ? -month : month;
  const solar = Lunar.fromYmd(year, m, day).getSolar();
  return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
}

// 公历转农历；闰月时 isLeap=true。
export function solarToLunar(year: number, month: number, day: number): LunarDate {
  const lu = Solar.fromYmd(year, month, day).getLunar();
  const m = lu.getMonth();
  return { year: lu.getYear(), month: Math.abs(m), day: lu.getDay(), isLeap: m < 0 };
}
