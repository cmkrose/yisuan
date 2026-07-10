'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  report?: any;
}

const quickQuestions = [
  { q: '我最近的事业运势如何？', cat: ['bazi','ziwei'] as ('bazi'|'ziwei'|'divination')[] },
  { q: '今年的财运怎么样？', cat: ['bazi','divination'] as const },
  { q: '婚姻感情什么时候有转机？', cat: ['bazi','ziwei'] as const },
  { q: '帮我做一次综合命理分析', cat: ['bazi','ziwei','divination'] as const },
  { q: '最近适合投资吗？', cat: ['bazi','divination'] as const },
  { q: '身体健康方面有什么要注意？', cat: ['bazi','ziwei'] as const },
];

export default function AiConsultantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是易算AI命理助手。我可以结合八字、紫微、占卜等多维度数据为你做综合命理分析。请输入你的问题，或点击下方快捷提问。' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<('bazi'|'ziwei'|'divination')[]>(['bazi','ziwei']);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (question: string, cats?: ('bazi'|'ziwei'|'divination')[]) => {
    if (!question.trim() || loading) return;
    const catsToUse = cats || categories;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      let baziData = null, ziweiData = null, divData = null;

      if (token && catsToUse.includes('bazi')) {
        try { const r = await api.get('/api/users/charts'); baziData = r.data.find((c:any)=>c.chartType==='bazi')?.chartData; } catch(e){}
      }
      if (token && catsToUse.includes('ziwei')) {
        try { const r = await api.get('/api/users/charts'); ziweiData = r.data.find((c:any)=>c.chartType==='ziwei')?.chartData; } catch(e){}
      }
      if (token && catsToUse.includes('divination')) {
        try { divData = (await api.post('/api/divination/liuyao')).data; } catch(e){}
      }

      const res = await api.post('/api/ai-consultant/analyze', {
        question, categories: catsToUse, baziData, ziweiData, divinationData: divData,
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: '', report: res.data }]);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || '分析请求失败，请稍后重试';
      setMessages((prev) => [...prev, { role: 'assistant', content: errMsg }]);
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const renderReportCard = (report: any) => (
    <div className="space-y-4">
      {/* Overview */}
      <div className="p-4 bg-xuan-gold/5 rounded-lg border border-xuan-gold/20">
        <div className="text-xs text-xuan-gold font-chinese mb-2">📊 综合解读</div>
        <p className="text-sm text-xuan-silver font-chinese leading-relaxed">{report.overview}</p>
      </div>

      {/* Insights from multiple sources */}
      {report.baziInsight && (
        <div className="p-3 bg-amber-500/5 rounded border border-amber-500/20">
          <div className="text-xs text-amber-400 font-chinese mb-1">☯ 八字洞察</div>
          <p className="text-xs text-xuan-silver font-chinese">{report.baziInsight}</p>
        </div>
      )}
      {report.ziweiInsight && (
        <div className="p-3 bg-purple-500/5 rounded border border-purple-500/20">
          <div className="text-xs text-purple-400 font-chinese mb-1">★ 紫微洞察</div>
          <p className="text-xs text-xuan-silver font-chinese">{report.ziweiInsight}</p>
        </div>
      )}
      {report.divinationInsight && (
        <div className="p-3 bg-cyan-500/5 rounded border border-cyan-500/20">
          <div className="text-xs text-cyan-400 font-chinese mb-1">爻 占卜洞察</div>
          <p className="text-xs text-xuan-silver font-chinese">{report.divinationInsight}</p>
        </div>
      )}

      {/* Strengths & Cautions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
          <div className="text-xs text-emerald-400 font-chinese mb-2">✅ 优势</div>
          <ul className="space-y-1">
            {report.strengths?.map((s: string, i: number) => (
              <li key={i} className="text-xs text-xuan-silver font-chinese flex items-start gap-1">
                <span className="text-emerald-400">•</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
          <div className="text-xs text-red-400 font-chinese mb-2">⚠️ 注意事项</div>
          <ul className="space-y-1">
            {report.cautions?.map((c: string, i: number) => (
              <li key={i} className="text-xs text-xuan-silver font-chinese flex items-start gap-1">
                <span className="text-red-400">•</span> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggestions */}
      <div className="p-4 bg-xuan-cyan/5 rounded-lg border border-xuan-cyan/20">
        <div className="text-xs text-xuan-cyan font-chinese mb-2">💡 建议</div>
        <ul className="space-y-1.5">
          {report.suggestions?.map((s: string, i: number) => (
            <li key={i} className="text-xs text-xuan-silver font-chinese flex items-start gap-2">
              <span className="text-xuan-cyan">{i + 1}.</span> {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Lucky Elements & Timing */}
      <div className="flex flex-wrap gap-3">
        {report.luckyElements && (
          <div className="flex-1 p-3 bg-xuan-dark rounded border border-xuan-border">
            <div className="text-xs text-xuan-gold font-chinese mb-1">🍀 幸运元素</div>
            <div className="space-y-0.5 text-xs">
              {report.luckyElements.colors && <div className="text-xuan-silver">色: {report.luckyElements.colors.join('、')}</div>}
              {report.luckyElements.numbers && <div className="text-xuan-silver">数: {report.luckyElements.numbers.join('、')}</div>}
              {report.luckyElements.directions && <div className="text-xuan-silver">方位: {report.luckyElements.directions.join('、')}</div>}
            </div>
          </div>
        )}
        {report.bestTiming && (
          <div className="flex-1 p-3 bg-xuan-dark rounded border border-xuan-border">
            <div className="text-xs text-xuan-gold font-chinese mb-1">⏰ 时机</div>
            <p className="text-xs text-xuan-silver">{report.bestTiming}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-xuan-black flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20 pb-4 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <span className="inline-block px-3 py-1 text-xs tracking-widest text-purple-400/70 font-chinese mb-4 border border-purple-400/20 rounded-full">AI驱动</span>
            <h1 className="text-2xl sm:text-3xl font-chinese font-bold text-gradient-gold mb-2">AI命理助手</h1>
            <p className="text-sm text-xuan-muted font-chinese">多维度命理数据 + 大语言模型 = 智能解读</p>
          </motion.div>

          {/* Category Pills */}
          <div className="flex gap-2 mb-4 justify-center flex-wrap">
            {[{ key:'bazi', label:'八字', icon:'☯' },{ key:'ziwei', label:'紫微', icon:'★' },{ key:'divination', label:'占卜', icon:'爻' }].map((c) => (
              <button key={c.key} onClick={() => setCategories((prev) =>
                prev.includes(c.key as any) ? prev.filter(p=>p!==c.key) : [...prev, c.key as any]
              )}
              className={`px-3 py-1.5 text-xs font-chinese rounded-full border transition-all ${
                categories.includes(c.key as any) ? 'border-purple-400 bg-purple-500/10 text-purple-400' : 'border-xuan-border text-xuan-muted hover:border-purple-400/30'
              }`}>{c.icon} {c.label}</button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[60vh]">
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 ${
                  m.role === 'user' ? 'bg-xuan-gold/10 border border-xuan-gold/30' : 'card-xuan'
                }`}>
                  {m.report ? renderReportCard(m.report) : (
                    <p className="text-sm text-xuan-silver font-chinese leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="card-xuan p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-sm text-xuan-muted font-chinese">
                    <span className="animate-pulse text-purple-400">●</span>
                    <span className="animate-pulse" style={{animationDelay:'0.2s'}}>●</span>
                    <span className="animate-pulse" style={{animationDelay:'0.4s'}}>●</span>
                    <span>AI分析中...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickQuestions.map((qq, i) => (
                <button key={i} onClick={() => sendMessage(qq.q, qq.cat as any)}
                  className="p-3 text-xs font-chinese card-xuan hover:border-purple-400/40 transition-all text-left">
                  {qq.q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="输入你的问题，AI将从命理角度为你解答..."
              className="flex-1 px-4 py-3 bg-xuan-dark border border-xuan-border rounded-xl text-sm text-white placeholder-xuan-muted focus:outline-none focus:border-purple-400/50 disabled:opacity-50" />
            <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
              className="px-5 py-3 bg-purple-500/20 border border-purple-400/40 text-purple-400 rounded-xl hover:bg-purple-500/30 disabled:opacity-30 transition-all font-chinese text-sm">
              {loading ? '...' : '发送'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
