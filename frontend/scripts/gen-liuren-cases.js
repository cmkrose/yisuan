const fs = require('fs');
const { Solar } = require('lunar-javascript');
const cases = [
  [2026,11,16,10,'甲午','己巳'],[1990,5,15,10,'庚辰','辛巳'],[2026,11,16,6,'甲午','丁卯'],[2026,11,16,18,'甲午','癸酉'],
  [2026,11,4,14,'壬午','丁未'],[2026,11,5,21,'癸未','癸亥'],[2026,11,4,23,'壬午','壬子'],[2026,11,3,11,'辛巳','甲午'],
  [2026,1,20,9,'甲午','己巳'],[2026,1,19,9,'癸巳','丁巳'],[1975,3,3,22,'戊申','癸亥'],[2024,2,29,20,'癸亥','壬戌'],
  [2026,3,8,21,'辛巳','己亥'],[2023,6,15,3,'甲辰','丙寅'],[2010,12,25,6,'己酉','丁卯'],[1985,8,20,14,'辛卯','乙未'],
  [2026,5,1,8,'乙亥','庚辰'],[2026,7,19,16,'甲午','壬申'],[2026,9,30,12,'丁未','丙午'],[2000,1,1,0,'戊午','壬子'],
  [2023,12,26,10,'',''],[2011,1,15,10,'',''],
];
const trad = { '惊蛰':'驚蟄', '谷雨':'穀雨', '处暑':'處暑', '小满':'小滿', '芒种':'芒種' };
const out = cases.map(([y,m,d,h,dayGz,hourGz], idx) => {
  const lunar = Solar.fromYmdHms(y,m,d,h,0,0).getLunar();
  const jq = lunar.getPrevJieQi(false).getName();
  return {
    idx: idx + 1, y, m, d, h,
    dayGz: dayGz || lunar.getDayInGanZhi(),
    hourGz: hourGz || lunar.getEightChar().getTime(),
    jieqi: trad[jq] || jq,
    cmonth: Math.abs(lunar.getMonth()),
  };
});
fs.writeFileSync(__dirname + '/liuren-cases.json', JSON.stringify(out, null, 2), 'utf8');
console.log('cases', out.length, out.map((c) => c.jieqi).join(','));
