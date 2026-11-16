const fs = require('fs');
const s = fs.readFileSync(__dirname + '/../src/lib/data/articles.ts', 'utf8');
const i = s.indexOf('子丑属土（水）');
fs.writeFileSync(__dirname + '/ziwei2-wuxing.txt', s.slice(Math.max(0, i - 220), i + 320), 'utf8');
console.log('idx', i);
