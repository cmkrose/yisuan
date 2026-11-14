const L = require('lunar-javascript');
console.log('exports:', Object.keys(L).slice(0, 20).join(','));
const { Solar, Lunar } = L;

const s = Solar.fromYmd(2024, 2, 10);
const lu = s.getLunar();
console.log('2024-02-10 -> lunar', lu.getYear(), lu.getMonth(), lu.getDay(), 'leap?', lu.getMonth() < 0);

const back = Lunar.fromYmd(2024, 1, 1).getSolar();
console.log('lunar 2024-1-1 -> solar', back.getYear(), back.getMonth(), back.getDay());

// leap month test: 2025 leap 6th month. lunar-javascript uses negative month or LunarMonth?
try {
  const lm = L.LunarMonth.fromYm(2025, -6);
  console.log('2025 leap6 LunarMonth:', lm ? lm.getMonth() : 'null');
} catch (e) { console.log('LunarMonth.fromYm err', e.message); }

for (const m of [6, -6]) {
  try {
    const sl = Lunar.fromYmd(2025, m, 1).getSolar();
    console.log(`lunar 2025 month ${m} day1 -> solar`, sl.getYear(), sl.getMonth(), sl.getDay());
  } catch (e) { console.log('fromYmd 2025 ' + m + ' err', e.message); }
}

const lu6 = Solar.fromYmd(2025, 7, 25).getLunar();
console.log('2025-07-25 lunar month', lu6.getMonth(), 'day', lu6.getDay());
console.log('methods on Lunar:', ['getYear','getMonth','getDay','getSolar','isLeap'].filter(k=>typeof Lunar.prototype[k]==='function' || k in Lunar).join(','));
