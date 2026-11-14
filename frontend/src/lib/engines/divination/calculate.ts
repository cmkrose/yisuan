import {
  analyzeLiuyao, timeDivination, numberDivination, nameDivination,
  xiaoLiuRenDivine, quickDivine, randomDivine,
} from './core';

export function divLiuyao(dayGan?: string) {
  return analyzeLiuyao(dayGan);
}

export function divMeihuaTime() {
  return timeDivination(new Date());
}

export function divMeihuaNumber(nums: number[]) {
  return numberDivination(nums);
}

export function divMeihuaName(name: string) {
  return nameDivination(name);
}

export function divXiaoLiuRen(month: number, day: number, hour: number) {
  return xiaoLiuRenDivine(month, day, hour);
}

export function divXiaoLiuRenQuick() {
  return quickDivine();
}

export function divXiaoLiuRenRandom() {
  return randomDivine();
}
