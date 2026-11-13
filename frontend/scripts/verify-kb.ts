import { kbAll, kbCategories } from '../src/lib/data/knowledge';

(async () => {
  const all = await kbAll();
  const cats = await kbCategories();
  const sum = cats.reduce((s, c) => s + c.count, 0);
  const ids = new Set(all.map((a) => a.id));
  console.log('文章总数(过滤后):', all.length);
  console.log('唯一 id 数:', ids.size);
  console.log('分类明细:', cats.map((c) => `${c.name}=${c.count}`).join(', '));
  console.log('分类合计:', sum);
  console.log(sum === all.length && ids.size === all.length ? 'COUNT CONSISTENT' : 'COUNT MISMATCH');
})();
