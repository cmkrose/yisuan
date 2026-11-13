export function yearRangeDesc(start = 1900, end = new Date().getFullYear() + 1): number[] {
  const out: number[] = [];
  for (let y = end; y >= start; y--) out.push(y);
  return out;
}
