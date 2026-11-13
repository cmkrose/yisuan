import { fengshuiEngine } from './service';

export function fengshuiEightMansion(dto: { birthYear: number; gender: 'male' | 'female' }) {
  return fengshuiEngine.eightMansion(dto);
}

export function fengshuiFlyingStars(dto: { year: number }) {
  return fengshuiEngine.flyingStars(dto);
}

export function fengshuiCompass() {
  return fengshuiEngine.compass();
}

export function fengshuiYangHouse(dto: { facing: string; year: number }) {
  return fengshuiEngine.yangHouse(dto);
}

export function fengshuiYinHouse(dto: { location: string; direction: string }) {
  return fengshuiEngine.yinHouse(dto);
}
