import { getDayInfo, selectDates, getMonthCalendar, getDayTimes } from './index';

export function zeriDay(year: number, month: number, day: number) {
  return getDayInfo(year, month, day);
}

export function zeriTimes(year: number, month: number, day: number) {
  return getDayTimes(year, month, day);
}

export function zeriSelect(year: number, month: number, purpose: 'wedding' | 'business' | 'moving' | 'construction') {
  return selectDates(year, month, purpose);
}

export function zeriCalendar(year: number, month: number) {
  return getMonthCalendar(year, month);
}
