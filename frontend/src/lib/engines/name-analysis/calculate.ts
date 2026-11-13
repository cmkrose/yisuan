import { analyzeName, suggestNames } from './index';

export function nameAnalyze(input: any) {
  return analyzeName({ ...input, gender: input.gender || 'male' });
}

export function nameSuggest(input: { surname: string; gender?: 'male' | 'female'; count?: number }) {
  return suggestNames(input.surname, input.gender || 'male', input.count || 5);
}
