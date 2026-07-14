import { Injectable, Logger } from '@nestjs/common';
import { articles as rawArticles, KnowledgeArticle } from './core/articles';

const articles: KnowledgeArticle[] = rawArticles.filter(a => a && a.id && a.title);

@Injectable()
export class KnowledgeBaseService {
  private readonly logger = new Logger(KnowledgeBaseService.name);

  getCategories(): { name: string; count: number; icon: string }[] {
    const catMap = new Map<string, number>();
    const icons: Record<string, string> = {
      '八字知识':'☯', '五行知识':'⭐', '天干地支':'📅', '六十四卦':'☰',
      '紫微星曜':'★', '风水术语':'🏠', '择日知识':'📆',
    };

    for (const a of articles) {
      catMap.set(a.category, (catMap.get(a.category) || 0) + 1);
    }

    return Array.from(catMap.entries()).map(([name, count]) => ({
      name, count, icon: icons[name] || '📖',
    }));
  }

  search(query: string): KnowledgeArticle[] {
    if (!query?.trim()) return articles;
    const q = query.toLowerCase();
    return articles.filter((a) =>
      a.title.includes(q) || a.summary.includes(q) ||
      a.tags.some((t) => t.includes(q)) || a.content.includes(q),
    );
  }

  getByCategory(category: string): KnowledgeArticle[] {
    return articles.filter((a) => a.category === category);
  }

  getById(id: string): KnowledgeArticle | undefined {
    return articles.find((a) => a.id === id);
  }

  getRelated(id: string): KnowledgeArticle[] {
    const article = this.getById(id);
    if (!article) return [];
    return articles
      .filter((a) => a.id !== id && a.category === article.category)
      .slice(0, 4);
  }

  getPopularTags(): { name: string; count: number }[] {
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
}
