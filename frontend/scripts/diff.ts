export function diff(a: any, b: any, path: string, out: string[]) {
  if (out.length > 60) return;
  if (a === b) return;

  const aArr = Array.isArray(a);
  const bArr = Array.isArray(b);
  if (aArr || bArr) {
    if (aArr !== bArr) { out.push(`${path}: array mismatch`); return; }
    if (a.length !== b.length) { out.push(`${path}: length local=${a.length} remote=${b.length}`); return; }
    for (let i = 0; i < a.length; i++) diff(a[i], b[i], `${path}[${i}]`, out);
    return;
  }

  const ta = typeof a;
  const tb = typeof b;
  if (ta !== tb) { out.push(`${path}: type local=${ta} remote=${tb}`); return; }
  if (ta === 'object' && a && b) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) diff(a[k], b[k], `${path}.${k}`, out);
    return;
  }
  out.push(`${path}: local=${JSON.stringify(a)} remote=${JSON.stringify(b)}`);
}

export async function fetchJson(url: string, body: any, timeoutMs = 90000): Promise<any> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}
