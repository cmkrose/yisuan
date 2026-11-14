const fs = require('fs');
const s = fs.readFileSync(__dirname + '/../src/lib/engines/name-analysis/stroke-data.ts', 'utf8');
const mapBlock = s.slice(s.indexOf('const strokeMap'), s.indexOf('const surnameStrokes'));
const keys = [...mapBlock.matchAll(/[\u4e00-\u9fff]\s*:\s*(\d+)/g)];
console.log('strokeMap key count:', keys.length);
for (const ch of ['伟','偉','娜','敏','静','靜','强','強','华','華','杰','傑','涛','濤','磊','鑫','淼','丽','麗','军','軍','国','國','龙','龍','凤','鳳','艳','艷','艳']) {
  const re = new RegExp('(?:^|[\\s,{])' + ch + '\\s*:\\s*(\\d+)', 'm');
  const m = mapBlock.match(re);
  console.log(ch, m ? m[1] : 'NOT FOUND');
}
