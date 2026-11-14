const fs = require('fs');
const s = fs.readFileSync(__dirname + '/../src/lib/data/articles.ts', 'utf8');
const a = s.indexOf('假设某人：命宫在卯');
const b = s.indexOf('婚姻需要注意沟通方式。', a);
fs.writeFileSync(__dirname + '/ziwei2-case.txt', s.slice(a, b + '婚姻需要注意沟通方式。'.length), 'utf8');
console.log('from', a, 'to', b, 'len', b - a);
