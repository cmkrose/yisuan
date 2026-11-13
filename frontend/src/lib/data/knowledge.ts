import type { KnowledgeArticle } from './articles';

let cache: KnowledgeArticle[] | null = null;

async function load(): Promise<KnowledgeArticle[]> {
  if (cache) return cache;
  const mod = await import('./articles');
  cache = (mod.articles || []).filter((a: any) => a && a.id && a.title) as KnowledgeArticle[];
  return cache;
}

export async function kbCategories(): Promise<{ name: string; count: number; icon: string }[]> {
  const articles = await load();
  const catMap = new Map<string, number>();
  const icons: Record<string, string> = {
    '八字知识': '☯', '五行知识': '⭐', '天干地支': '📅', '六十四卦': '☰',
    '紫微星曜': '★', '风水术语': '🏠', '择日知识': '📆',
  };
  for (const a of articles) {
    catMap.set(a.category, (catMap.get(a.category) || 0) + 1);
  }
  return Array.from(catMap.entries()).map(([name, count]) => ({
    name, count, icon: icons[name] || '📖',
  }));
}

export async function kbSearch(query: string): Promise<KnowledgeArticle[]> {
  const articles = await load();
  if (!query?.trim()) return articles;
  const q = query.toLowerCase();
  return articles.filter((a) =>
    a.title.includes(q) || a.summary.includes(q) ||
    a.tags.some((t) => t.includes(q)) || a.content.includes(q),
  );
}

export async function kbByCategory(category: string): Promise<KnowledgeArticle[]> {
  const articles = await load();
  return articles.filter((a) => a.category === category);
}

export async function kbById(id: string): Promise<KnowledgeArticle | undefined> {
  const articles = await load();
  return articles.find((a) => a.id === id);
}

export async function kbRelated(id: string): Promise<KnowledgeArticle[]> {
  const articles = await load();
  const article = articles.find((a) => a.id === id);
  if (!article) return [];
  return articles.filter((a) => a.id !== id && a.category === article.category).slice(0, 4);
}

export async function kbTags(): Promise<{ name: string; count: number }[]> {
  const articles = await load();
  const tagMap = new Map<string, number>();
  for (const a of articles) {
    for (const t of a.tags) {
      tagMap.set(t, (tagMap.get(t) || 0) + 1);
    }
  }
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

export async function kbAll(): Promise<KnowledgeArticle[]> {
  return load();
}
