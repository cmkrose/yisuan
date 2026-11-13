import { calculateBazi } from '../src/lib/engines/bazi/calculate';

type Case = { gender: 'male' | 'female'; birthYear: number; birthMonth: number; birthDay: number; birthHour: number };

const cases: Case[] = [
  { gender: 'male', birthYear: 1990, birthMonth: 5, birthDay: 15, birthHour: 10 },
  { gender: 'female', birthYear: 2000, birthMonth: 1, birthDay: 1, birthHour: 0 },
  { gender: 'male', birthYear: 2024, birthMonth: 2, birthDay: 10, birthHour: 23 },
];

const API = 'https://yisuan.onrender.com/api/bazi/calculate';

function diff(a: any, b: any, path: string, out: string[]) {
  if (out.length > 50) return;
  if (a === b) return;

  const aArr = Array.isArray(a);
  const bArr = Array.isArray(b);
  if (aArr || bArr) {
    if (aArr !== bArr) { out.push(`${path}: array mismatch (local ${aArr ? 'array' : typeof a} vs remote ${bArr ? 'array' : typeof b})`); return; }
    if (a.length !== b.length) { out.push(`${path}: length local=${a.length} remote=${b.length}`); return; }
    for (let i = 0; i < a.length; i++) diff(a[i], b[i], `${path}[${i}]`, out);
    return;
  }

  const ta = typeof a;
  const tb = typeof b;
  if (ta !== tb) { out.push(`${path}: type local=${ta} remote=${tb} (${JSON.stringify(a)} vs ${JSON.stringify(b)})`); return; }
  if (ta === 'object' && a && b) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) diff(a[k], b[k], `${path}.${k}`, out);
    return;
  }
  out.push(`${path}: local=${JSON.stringify(a)} remote=${JSON.stringify(b)}`);
}

async function fetchRemote(c: Case): Promise<any> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 90000);
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(c),
      signal: ctrl.signal,
    });
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

(async () => {
  let allPass = true;
  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    const local = calculateBazi(c as any);
    let remote: any;
    try {
      remote = await fetchRemote(c);
    } catch (e: any) {
      console.log(`Case ${i + 1} ${JSON.stringify(c)} -> REMOTE FETCH FAILED: ${e.message}`);
      allPass = false;
      continue;
    }
    const out: string[] = [];
    diff(local, remote, '$', out);
    if (out.length === 0) {
      console.log(`Case ${i + 1} ${JSON.stringify(c)} -> PASS (逐字段一致)`);
    } else {
      allPass = false;
      console.log(`Case ${i + 1} ${JSON.stringify(c)} -> FAIL (${out.length} diffs)`);
      out.slice(0, 15).forEach((d) => console.log('   ' + d));
    }
  }
  console.log(allPass ? '\nALIGNMENT: ALL PASS' : '\nALIGNMENT: FAILED');
  process.exit(allPass ? 0 : 1);
})();
