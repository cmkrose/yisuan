const fs = require('fs');
const s = fs.readFileSync(__dirname + '/../src/lib/data/articles.ts', 'utf8');
const ids = [...s.matchAll(/id:"([^"]+)"/g)].map((m) => ({ id: m[1], idx: m.index }));
const idAt = (i) => { let cur = '?'; for (const o of ids) { if (o.idx <= i) cur = o.id; else break; } return cur; };

const jobs = [
  ['阴火', 160], ['命宫在寅', 520], ['夫妻宫', 200], ['子水', 180],
  ['壬山丙向', 700], ['午辰', 160], ['相害', 180], ['天同', 180],
  ['巨门', 180], ['阳梁', 200], ['卯宫', 180], ['四柱纯阳', 120],
  ['最近一个节气', 100], ['最近一个「节」', 100],
];
const out = [];
for (const [needle, w] of jobs) {
  let from = 0, count = 0;
  while (true) {
    const i = s.indexOf(needle, from);
    if (i < 0 || count >= 3) break;
    out.push(`### ${needle} | ${idAt(i)} @${i}\n...${s.slice(Math.max(0, i - w / 2), i + needle.length + w).replace(/\n/g, ' ')}...\n`);
    from = i + needle.length;
    count++;
  }
}
fs.writeFileSync(__dirname + '/articles-report2.txt', out.join('\n'), 'utf8');
console.log('written', out.length);
