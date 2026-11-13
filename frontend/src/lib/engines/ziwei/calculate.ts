import { calculateZiwei } from './index';

export interface ZiweiInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  gender: 'male' | 'female';
}

export function calculateZiweiLocal(input: ZiweiInput): any {
  try {
    return calculateZiwei(
      input.birthYear, input.birthMonth, input.birthDay, input.birthHour, input.gender,
    );
  } catch (e: any) {
    return { error: e.message, input };
  }
}
