'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';

interface Article {
  id: string; title: string; category: string; summary: string;
  content: string; tags: string[]; readMinutes: number; level: string;
}

const levelColors: Record<string, string> = {
  '入门': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  '进阶': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  '精通': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
};

const defaultIcons: Record<string, string> = {
  '八字知识':'☯','五行知识':'⭐','天干地支':'📅','六十四卦':'☰',
  '紫微星曜':'★','风水术语':'🏠','择日知识':'📆',
};

const STORAGE_KEYS = {
  favorites: 'kb_favorites',
  history: 'kb_history',
};

function loadFavorites(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.favorites);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveFavorites(favs: Set<string>) {
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([...favs]));
}

function loadHistory(): Article[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHistory(hist: Article[]) {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(hist.slice(0, 20)));
}

function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = content.split('\n');
  lines.forEach((line) => {
    const match = line.match(/^(#{1,4})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '');
      headings.push({ id, text, level });
    }
  });
  return headings;
}

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [viewArticle, setViewArticle] = useState<Article | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeHeading, setActiveHeading] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    setFavorites(loadFavorites());
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    Promise.all([
      api.get('/api/knowledge/categories').then(r => setCategories(r.data)),
      api.get('/api/knowledge/tags').then(r => setTags(r.data)),
      api.get('/api/knowledge/all').then(r => setArticles((r.data || []).filter((a: any) => a && a.id))),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (viewArticle) {
      const h = extractHeadings(viewArticle.content);
      setHeadings(h);
      setActiveHeading(h[0]?.id || '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [viewArticle]);

  useEffect(() => {
    if (!viewArticle || headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [viewArticle, headings]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleSearch = async (q: string) => {
    setSearch(q); setSelectedCat(''); setShowFavOnly(false);
    const r = q.trim()
      ? await api.get(`/api/knowledge/search?q=${encodeURIComponent(q)}`)
      : await api.get('/api/knowledge/all');
    setArticles(r.data);
  };

  const handleCategory = async (cat: string) => {
    setSelectedCat(cat); setSearch(''); setShowFavOnly(false);
    const r = await api.get(`/api/knowledge/category/${encodeURIComponent(cat)}`);
    setArticles(r.data);
  };

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveFavorites(next);
      return next;
    });
  }, []);

  const openArticle = (a: Article) => {
    setViewArticle(a);
    const newHist = [a, ...history.filter(h => h.id !== a.id)].slice(0, 20);
    setHistory(newHist);
    saveHistory(newHist);
  };

  const prevArticle = viewArticle
    ? articles.find((a) => {
        const idx = articles.findIndex(x => x.id === viewArticle.id);
        return idx > 0 ? a.id === articles[idx - 1].id : false;
      })
    : null;

  const nextArticle = viewArticle
    ? articles.find((a) => {
        const idx = articles.findIndex(x => x.id === viewArticle.id);
        return idx < articles.length - 1 ? a.id === articles[idx + 1].id : false;
      })
    : null;

  const filteredArticles = showFavOnly
    ? articles.filter(a => favorites.has(a.id))
    : articles;

  const renderLine = (line: string, i: number): React.ReactNode => {
    const hMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = hMatch[2].trim();
      const id = text.replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '');
      const Tag = `h${level + 1}` as keyof JSX.IntrinsicElements;
      const cls = level === 1
        ? 'text-xl font-chinese font-bold text-xuan-gold mt-6 mb-4'
        : level === 2
        ? 'text-lg font-chinese font-bold text-xuan-gold mt-5 mb-3'
        : 'text-base font-chinese font-bold text-xuan-gold mt-4 mb-2';
      return <Tag key={i} id={id} className={cls}>{text}</Tag>;
    }
    if (line.startsWith('|')) {
      const cells = line.split('|').filter(Boolean).map((c) => c.trim());
      if (line.includes('---')) return null;
      if (cells.every((c) => c.startsWith('-'))) return null;
      return (
        <div key={i} className="grid grid-flow-col auto-cols-fr gap-1 text-xs py-1 border-b border-xuan-border/50">
          {cells.map((c: string, j: number) => (
            <span key={j} className={`font-chinese px-1 ${j === 0 ? 'text-xuan-gold' : 'text-xuan-silver'}`}>{c}</span>
          ))}
        </div>
      );
    }
    if (line.startsWith('- ')) return <li key={i} className="text-sm text-xuan-silver font-chinese ml-4 list-disc my-1">{line.slice(2)}</li>;
    if (line.trim()) return <p key={i} className="text-sm text-xuan-silver font-chinese leading-relaxed my-2">{line}</p>;
    return <br key={i} />;
  };

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs tracking-[0.3em] text-xuan-gold/70 font-chinese mb-4">学习中心</span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">传统文化知识库</h1>
            <p className="text-xuan-muted font-chinese">系统学习八字·五行·干支·六十四卦·紫微·风水·择日</p>
          </motion.div>

          {viewArticle ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key="detail">
              <button onClick={() => setViewArticle(null)}
                className="mb-6 text-sm font-chinese text-xuan-gold hover:text-xuan-gold-light transition-colors flex items-center gap-1">
                <span>←</span> 返回知识库
              </button>

              <div className="flex gap-6">
                <div className="flex-1 min-w-0">
                  <div className="card-xuan-gold p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-chinese text-xuan-gold">{viewArticle.category}</span>
                      <button onClick={() => toggleFavorite(viewArticle.id)}
                        className={`text-sm font-chinese px-3 py-1 rounded-lg border transition-all ${
                          favorites.has(viewArticle.id)
                            ? 'text-xuan-gold border-xuan-gold/50 bg-xuan-gold/10'
                            : 'text-xuan-muted border-xuan-border/30 hover:border-xuan-gold/30'
                        }`}>
                        {favorites.has(viewArticle.id) ? '★ 已收藏' : '☆ 收藏'}
                      </button>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-chinese font-bold text-xuan-gold mb-4">{viewArticle.title}</h1>
                    <div className="flex flex-wrap gap-2 mb-6 text-xs text-xuan-muted font-chinese">
                      {viewArticle.level && (
                        <span className={`px-2 py-0.5 rounded border ${levelColors[viewArticle.level] || ''}`}>{viewArticle.level}</span>
                      )}
                      <span>⏱ {viewArticle.readMinutes}分钟阅读</span>
                      <span>🏷 {viewArticle.tags.join(' · ')}</span>
                    </div>
                    <div ref={contentRef} className="prose prose-invert max-w-none">
                      {viewArticle.content.split('\n').map((line, i) => renderLine(line, i))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8 gap-4">
                    {prevArticle ? (
                      <button onClick={() => openArticle(prevArticle)}
                        className="flex-1 card-xuan p-4 text-left hover:border-xuan-gold/30 transition-all group">
                        <span className="text-[10px] text-xuan-muted font-chinese">← 上一篇</span>
                        <div className="text-sm font-chinese text-xuan-silver group-hover:text-xuan-gold transition-colors mt-1 line-clamp-1">{prevArticle.title}</div>
                      </button>
                    ) : <div className="flex-1" />}
                    {nextArticle ? (
                      <button onClick={() => openArticle(nextArticle)}
                        className="flex-1 card-xuan p-4 text-right hover:border-xuan-gold/30 transition-all group">
                        <span className="text-[10px] text-xuan-muted font-chinese">下一篇 →</span>
                        <div className="text-sm font-chinese text-xuan-silver group-hover:text-xuan-gold transition-colors mt-1 line-clamp-1">{nextArticle.title}</div>
                      </button>
                    ) : <div className="flex-1" />}
                  </div>

                  {(() => {
                    const related = articles.filter((a) => a.category === viewArticle.category && a.id !== viewArticle.id).slice(0, 3);
                    return related.length > 0 ? (
                      <div className="mt-8">
                        <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">相关文章</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {related.map((r) => (
                            <div key={r.id} onClick={() => openArticle(r)}
                              className="card-xuan p-4 cursor-pointer hover:border-xuan-gold/30 transition-all">
                              <div className="text-sm font-chinese font-bold text-white hover:text-xuan-gold">{r.title}</div>
                              <div className="text-xs text-xuan-muted mt-1">{r.summary}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>

                {headings.length > 0 && (
                  <div className="hidden lg:block w-56 flex-shrink-0">
                    <div className="sticky top-28">
                      <div className="card-xuan p-4">
                        <h4 className="text-xs font-chinese font-bold text-xuan-gold mb-3">目录</h4>
                        <nav className="space-y-1">
                          {headings.map((h) => (
                            <button key={h.id} onClick={() => scrollToHeading(h.id)}
                              className={`block w-full text-left text-xs font-chinese py-1 transition-colors ${
                                h.level === 1 ? 'pl-2' : h.level === 2 ? 'pl-4' : 'pl-6'
                              } ${
                                activeHeading === h.id ? 'text-xuan-gold' : 'text-xuan-muted hover:text-xuan-silver'
                              }`}>
                              {h.text}
                            </button>
                          ))}
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="list">
              <div className="mb-8">
                <div className="relative">
                  <input type="text" value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                    placeholder="搜索知识条目..."
                    className="w-full px-5 py-4 bg-xuan-dark border border-xuan-gold/30 rounded-xl text-sm text-white placeholder-xuan-muted focus:outline-none focus:border-xuan-gold/60 pr-12" />
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-xuan-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <button onClick={() => { handleSearch(''); setShowFavOnly(false); }}
                  className={`p-4 rounded-xl border text-center transition-all ${!selectedCat && !showFavOnly ? 'border-xuan-gold bg-xuan-gold/10 text-xuan-gold' : 'card-xuan text-xuan-muted hover:border-xuan-gold/30'}`}>
                  <span className="text-xl block mb-1">📚</span>
                  <span className="text-xs font-chinese">全部</span>
                  <span className="text-[10px] text-xuan-muted block">{articles.length}篇</span>
                </button>
                <button onClick={() => { setShowFavOnly(true); setSelectedCat(''); setSearch(''); }}
                  className={`p-4 rounded-xl border text-center transition-all ${showFavOnly ? 'border-xuan-gold bg-xuan-gold/10 text-xuan-gold' : 'card-xuan text-xuan-muted hover:border-xuan-gold/30'}`}>
                  <span className="text-xl block mb-1">⭐</span>
                  <span className="text-xs font-chinese">收藏</span>
                  <span className="text-[10px] text-xuan-muted block">{favorites.size}篇</span>
                </button>
                {categories.map((c: any) => (
                  <button key={c.name} onClick={() => { handleCategory(c.name); setShowFavOnly(false); }}
                    className={`p-4 rounded-xl border text-center transition-all ${selectedCat === c.name ? 'border-xuan-gold bg-xuan-gold/5' : 'card-xuan hover:border-xuan-gold/30'}`}>
                    <span className="text-2xl block mb-1">{c.icon || defaultIcons[c.name] || '📖'}</span>
                    <span className={`text-xs font-chinese ${selectedCat === c.name ? 'text-xuan-gold' : 'text-xuan-silver'}`}>{c.name}</span>
                    <span className="text-[10px] text-xuan-muted block">{c.count}篇</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map((t: any) => (
                  <button key={t.name} onClick={() => { handleSearch(t.name); setShowFavOnly(false); }}
                    className="px-3 py-1.5 text-xs font-chinese card-xuan hover:border-xuan-gold/40 rounded-full text-xuan-muted hover:text-xuan-gold transition-all">
                    {t.name} ({t.count})
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredArticles.map((a, i) => (
                  <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    onClick={() => openArticle(a)}
                    className="card-xuan-gold p-4 sm:p-5 cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-chinese font-bold text-white group-hover:text-xuan-gold transition-colors mb-1">{a.title}</h3>
                        <p className="text-xs sm:text-sm text-xuan-muted font-chinese line-clamp-2">{a.summary}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-[10px] text-xuan-muted">{a.category}</span>
                          {a.level && (
                            <span className={`px-1.5 py-0.5 text-[9px] font-chinese rounded border ${levelColors[a.level] || ''}`}>{a.level}</span>
                          )}
                          <span className="text-[10px] text-xuan-muted">{a.readMinutes}分钟</span>
                        </div>
                      </div>
                      <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); toggleFavorite(a.id); }}
                        className={`ml-3 text-lg ${favorites.has(a.id) ? 'text-xuan-gold' : 'text-xuan-muted opacity-30'}`}>
                        {favorites.has(a.id) ? '★' : '☆'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {history.length > 0 && (
                <div className="mt-8 card-xuan p-4">
                  <h3 className="text-sm font-chinese font-bold text-xuan-gold mb-3">最近阅读</h3>
                  <div className="flex flex-wrap gap-2">
                    {history.slice(0, 10).map((h, i) => (
                      <button key={i} onClick={() => {
                        const found = articles.find(a => a.id === h.id) || articles.find(a => a.title === h.title);
                        if (found) openArticle(found);
                      }}
                      className="text-xs font-chinese text-xuan-muted hover:text-xuan-gold px-2 py-1 card-xuan rounded transition-colors">
                        {h.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
