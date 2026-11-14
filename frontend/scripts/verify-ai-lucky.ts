import { aiEngine } from '../src/lib/engines/ai-consultant/engine';
import { AiReportEngine } from '../../backend/src/modules/ai-consultant/core/engine';

let fail = 0;
const check = (label: string, got: any, exp: any) => {
  const ok = JSON.stringify(got) === JSON.stringify(exp);
  if (!ok) fail++;
  console.log(`  ${label}: ${JSON.stringify(got)} 期望=${JSON.stringify(exp)} ${ok ? 'PASS' : 'FAIL'}`);
};
const checkTrue = (label: string, cond: boolean) => { if (!cond) fail++; console.log(`  ${label}: ${cond ? 'PASS' : 'FAIL'}`); };

function req(favorable: string[], strength: string) {
  return {
    question: '整体运势',
    categories: ['bazi'],
    baziData: { analysis: { dayMasterAnalysis: { dayMaster: '壬', element: '水', strength, favorable, unfavorable: ['土'], favorableGods: ['比肩'], unfavorableGods: ['七杀'] }, pattern: { name: '正格' } } },
  } as any;
}

console.log('== 幸运元素按喜用神映射 ==');
for (const [el, colors, nums, dirs] of [
  ['水', ['黑蓝', '黑色', '蓝色'], [1, 6], ['北方']],
  ['木', ['青绿', '绿色'], [3, 8], ['东方']],
  ['火', ['红紫', '红色', '紫色'], [2, 7], ['南方']],
  ['金', ['白金', '白色', '金色'], [4, 9], ['西方']],
  ['土', ['黄棕', '黄色', '棕色'], [5, 0], ['中宫及四隅']],
] as [string, string[], number[], string[]][]) {
  const r = aiEngine.analyzeLocal(req([el], '偏弱'));
  check(`${el} 颜色`, r.luckyElements!.colors, colors);
  check(`${el} 数字`, r.luckyElements!.numbers, nums);
  check(`${el} 方位`, r.luckyElements!.directions, dirs);
}

console.log('== 中性表述：不再无条件向好 ==');
const weak: any = aiEngine.analyzeLocal(req(['水'], '偏弱'));
checkTrue('弱：overall 含「偏弱/生扶」', weak.overallAnalysis.includes('偏弱') || weak.overallAnalysis.includes('生扶'));
checkTrue('弱：overall 不含「格局层次较高」', !weak.overallAnalysis.includes('格局层次较高'));
checkTrue('弱：future 不含「整体向好」', !weak.futureTrend.includes('整体向好'));
const strong: any = aiEngine.analyzeLocal(req(['火'], '偏强'));
checkTrue('强：overall 含「偏强/泄耗」', strong.overallAnalysis.includes('偏强') || strong.overallAnalysis.includes('泄耗'));
checkTrue('强：future 不含「稳步上升」', !strong.futureTrend.includes('稳步上升'));

console.log('== 前后端一致 ==');
const llm: any = new AiReportEngine();
const back: any = llm.fallbackAnalysis(req(['水'], '偏弱'));
check('后端 水颜色', back.luckyElements.colors, ['黑蓝', '黑色', '蓝色']);
check('后端 水数字', back.luckyElements.numbers, [1, 6]);
checkTrue('后端 future 中性', !back.futureTrend.includes('整体向好'));

console.log(fail === 0 ? 'AI LUCKY: ALL PASS' : `AI LUCKY: FAIL(${fail})`);
