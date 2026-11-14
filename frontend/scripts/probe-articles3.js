const fs = require('fs');
const s = fs.readFileSync(__dirname + '/../src/lib/data/articles.ts', 'utf8');
const ids = [...s.matchAll(/id:"([^"]+)"/g)].map((m) => ({ id: m[1], idx: m.index }));
const idAt = (i) => { let c = '?'; for (const o of ids) { if (o.idx <= i) c = o.id; else break; } return c; };
const ns = ['寅卯辰月','巳午未月','申酉戌月','亥子丑月','太阳天梁','天同巨门','夫妻宫','子水','武曲天梁','阳梁','太阴独坐','天相'];
const out = [];
for (const n of ns) {
  let f = 0, c = 0;
  while (true) {
    const i = s.indexOf(n, f);
    if (i < 0 || c >= 4) break;
    out.push('### ' + n + ' ' + idAt(i) + ' ...' + s.slice(Math.max(0, i - 60), i + n.length + 100).replace(/\n/g, ' ') + '...');
    f = i + n.length; c++;
  }
}
fs.writeFileSync(__dirname + '/articles-report3.txt', out.join('\n'), 'utf8');
