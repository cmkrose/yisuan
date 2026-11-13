import { calculateQimen, analyzeQimen } from './qimen/engine';
import { calculateLiuren, analyzeLiuren } from './liuren/engine';

export interface QimenInput {
  year: number; month: number; day: number; hour: number;
  birthYear?: number; birthMonth?: number; birthDay?: number; birthHour?: number;
  gender?: string; location?: string; purpose?: string;
}

export function sanshiQimen(input: QimenInput): any {
  const chartData = calculateQimen(input.year, input.month, input.day, input.hour);
  const analysis = analyzeQimen(chartData, {
    year: input.year, month: input.month, day: input.day, hour: input.hour,
    birthYear: input.birthYear || 1990, birthMonth: input.birthMonth || 1,
    birthDay: input.birthDay || 1, birthHour: input.birthHour || 12,
    gender: input.gender || 'male', location: input.location || '未指定',
    purpose: input.purpose || 'general',
  });
  return { ...chartData, analysis };
}

export function sanshiLiuren(input: { month: number; hour: number }): any {
  const chartData = calculateLiuren(input.month, input.hour);
  const analysis = analyzeLiuren(chartData, input.month, input.hour);
  return { ...chartData, analysis };
}
