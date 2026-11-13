import { fetchJson } from './diff';
import { calculateBazi } from '../src/lib/engines/bazi/calculate';

const API = 'https://yisuan.onrender.com/api/bazi/calculate';
const cases = [
  { gender: 'male', birthYear: 1990, birthMonth: 5, birthDay: 15, birthHour: 10 },
  { gender: 'female', birthYear: 2000, birthMonth: 1, birthDay: 1, birthHour: 0 },
  { gender: 'male', birthYear: 2024, birthMonth: 2, birthDay: 10, birthHour: 23 },
];

const NAYIN = ['海中金','炉中火','大林木','路旁土','剑锋金','山头火','涧下水','城头土','白蜡金','杨柳木','泉中水','屋上土','霹雳火','松柏木','长流水','沙中金','山下火','平地木','壁上土','金箔金','覆灯火','天河水','大驿土','钗钏金','桑柘木','大溪水','沙中土','天上火','石榴木','大海水','流年水','砂石金','钗环金','砂中土'];
function stripNayin(s: string): string { return NAYIN.reduce((acc, n) => acc.split(n).join(''), s); }

function walk(a: any, b: any, path: string, out: { path: string; a: any; b: any }[]) {
  if (a === b) return;
  const aArr = Array.isArray(a), bArr = Array.isArray(b);
  if (aArr || bArr) {
    if (aArr !== bArr) { out.push({ path, a, b }); return; }
    if (a.length !== b.length) { out.push({ path, a, b }); return; }
    for (let i = 0; i < a.length; i++) walk(a[i], b[i], `${path}[${i}]`, out);
    return;
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) walk(a[k], b[k], `${path}.${k}`, out);
    return;
  }
  out.push({ path, a, b });
}

(async () => {
  let disallowed = 0;
  for (let i = 0; i < cases.length; i++) {
    const c = cases[i] as any;
    const local = calculateBazi(c);
    const remote = await fetchJson(API, c);
    const diffs: { path: string; a: any; b: any }[] = [];
    walk(local, remote, '$', diffs);
    const allowed: Record<string, number> = {};
    const bad: string[] = [];
    for (const d of diffs) {
      if (d.path.includes('.nayin')) { allowed.nayin = (allowed.nayin || 0) + 1; continue; }
      if (d.path.includes('elementCounts') || d.path.includes('elementDistribution')) { allowed.elementCounts = (allowed.elementCounts || 0) + 1; continue; }
      if (d.path.endsWith('.detailedAnalysis.pillars')) { allowed.nayinText = (allowed.nayinText || 0) + 1; continue; }
      if (d.path.endsWith('.detailedAnalysis.wuxingBalance')) { allowed.clampText = (allowed.clampText || 0) + 1; continue; }
      if (d.path.endsWith('.detailedAnalysis.dayMaster')) { allowed.roundingText = (allowed.roundingText || 0) + 1; continue; }
      if (d.path.endsWith('.dayMasterAnalysis.detailedAnalysis')) { allowed.roundingText = (allowed.roundingText || 0) + 1; continue; }
      bad.push(d.path);
    }
    // elementCounts 不得再有负值
    const ecNeg = Object.values(local.analysis.dayMasterAnalysis.elementCounts).filter((v: any) => v < 0).length;
    console.log(`Case ${i + 1}: 允许差异=${JSON.stringify(allowed)} 非法差异=${bad.length} 负值数=${ecNeg}`);
    if (bad.length) { bad.slice(0, 10).forEach((p) => console.log('   UNEXPECTED: ' + p)); disallowed += bad.length; }
    if (ecNeg > 0) disallowed++;
  }
  console.log(disallowed === 0 ? '\nP0-2 回归：仅纳音/五行截断差异，其余字段完全一致 ✅' : `\nP0-2 回归：存在 ${disallowed} 处非预期差异 ❌`);
  process.exit(disallowed === 0 ? 0 : 1);
})();
