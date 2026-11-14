const fs = require('fs');
const path = __dirname + '/../src/lib/data/articles.ts';
const s = fs.readFileSync(path, 'utf8');
const ids = [...s.matchAll(/id:"([^"]+)"/g)].map((m) => ({ id: m[1], idx: m.index }));
function idAt(i) { let cur = '?'; for (const o of ids) { if (o.idx <= i) cur = o.id; else break; } return cur; }

const needles = [
  ['bazi1', '午为阴火'], ['bazi1', '最近一个'], ['bazi1', '起运'], ['bazi1', '最近'],
  ['bazi3', '壬申'], ['bazi3', '癸酉'], ['bazi3', '甲戌'], ['bazi3', '乙亥'], ['bazi3', '得运则发'], ['bazi3', '扶助日主'], ['bazi3', '申金禄地'], ['bazi3', '羊刃'],
  ['wuxing2', '寅月'], ['wuxing2', '司令'], ['wuxing2', '春季（寅卯辰月）'], ['wuxing2', '辰戌丑未'], ['wuxing2', '戌月'], ['wuxing2', '未月'],
  ['tgdz1', '干支纪年'], ['tgdz1', '周代'], ['tgdz1', '纯阳'],
  ['tgdz2', '巳为阳火'], ['tgdz2', '午为阴火'], ['tgdz2', '子为阴水'], ['tgdz2', '亥为阳水'], ['tgdz2', '无恩'], ['tgdz2', '恃势'], ['tgdz2', '卯辰'],
  ['tgdz3', '隔八'], ['tgdz3', '甲午'], ['tgdz3', '金行'], ['tgdz3', '三组'],
  ['hex1', '相隔两爻'], ['hex1', '莱布尼茨'], ['hex1', '二进制'],
  ['ziwei1', '泛水桃花'], ['ziwei1', '廉贞与贪狼'], ['ziwei1', '上刻'], ['ziwei1', '下刻'],
  ['ziwei2', '三方四正'], ['ziwei2', '对宫'], ['ziwei2', '阳梁'], ['ziwei2', '太阴'],
  ['feng1', '葬经'], ['feng1', '东汉'], ['feng1', '郭璞'], ['feng1', '八运'], ['feng1', '2004'], ['feng1', '蒋大鸿'],
  ['feng2', '九运'], ['feng2', '2024'], ['feng2', '沈竹礽'], ['feng2', '瓞民'], ['feng2', '顺逆'], ['feng2', '壬山丙向'], ['feng2', '连环相生'],
  ['zeri1', '黄道'], ['zeri1', '四离四绝'], ['zeri1', '危'], ['zeri1', '满'],
  ['zeri2', '虚日鼠'], ['zeri2', '氐土貉'], ['zeri2', '奎木狼'], ['zeri2', '建除满日'], ['zeri2', '闰月'],
];

const out = [];
for (const [label, needle] of needles) {
  let from = 0, count = 0;
  while (true) {
    const i = s.indexOf(needle, from);
    if (i < 0 || count >= 4) break;
    out.push(`### ${label} | ${needle} | ${idAt(i)} @${i}\n...${s.slice(Math.max(0, i - 80), i + needle.length + 120).replace(/\n/g, ' ')}...\n`);
    from = i + needle.length;
    count++;
  }
}
fs.writeFileSync(__dirname + '/articles-report.txt', out.join('\n'), 'utf8');
console.log('written', out.length);
