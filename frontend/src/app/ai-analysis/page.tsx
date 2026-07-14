'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  report?: any;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

const quickQuestions = [
  { q: '我最近的事业运势如何？', cat: ['bazi', 'ziwei'] as ('bazi' | 'ziwei' | 'divination')[] },
  { q: '今年的财运怎么样？', cat: ['bazi', 'divination'] as ('bazi' | 'ziwei' | 'divination')[] },
  { q: '婚姻感情什么时候有转机？', cat: ['bazi', 'ziwei'] as ('bazi' | 'ziwei' | 'divination')[] },
  { q: '帮我做一次综合命理分析', cat: ['bazi', 'ziwei', 'divination'] as ('bazi' | 'ziwei' | 'divination')[] },
  { q: '最近适合投资吗？', cat: ['bazi', 'divination'] as ('bazi' | 'ziwei' | 'divination')[] },
  { q: '身体健康方面有什么要注意？', cat: ['bazi', 'ziwei'] as ('bazi' | 'ziwei' | 'divination')[] },
];

export default function AiConsultantPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是易算AI命理助手。我可以结合八字、紫微、占卜等多维度数据为你做综合命理分析。请输入你的问题，或点击下方快捷提问。', timestamp: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<('bazi' | 'ziwei' | 'divination')[]>(['bazi', 'ziwei']);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ai-conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
        if (parsed.length > 0) {
          setCurrentConvId(parsed[0].id);
          setMessages(parsed[0].messages);
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ai-conversations', JSON.stringify(conversations));
  }, [conversations]);

  const createNewConversation = useCallback(() => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: '新对话',
      messages: [{ role: 'assistant', content: '你好！我是易算AI命理助手。我可以结合八字、紫微、占卜等多维度数据为你做综合命理分析。请输入你的问题，或点击下方快捷提问。', timestamp: Date.now() }],
      createdAt: Date.now(),
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConvId(newConv.id);
    setMessages(newConv.messages);
  }, []);

  const switchConversation = (convId: string) => {
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      setCurrentConvId(convId);
      setMessages(conv.messages);
    }
    setSidebarOpen(false);
  };

  const deleteConversation = (convId: string) => {
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== convId);
      if (currentConvId === convId && updated.length > 0) {
        setCurrentConvId(updated[0].id);
        setMessages(updated[0].messages);
      } else if (updated.length === 0) {
        createNewConversation();
      }
      return updated;
    });
  };

  const updateConversationMessages = (convId: string, newMessages: Message[]) => {
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c;
      const firstUserMsg = newMessages.find(m => m.role === 'user');
      const title = firstUserMsg ? firstUserMsg.content.substring(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '') : c.title;
      return { ...c, messages: newMessages, title };
    }));
  };

  const sendMessage = async (question: string, cats?: ('bazi' | 'ziwei' | 'divination')[]) => {
    if (!question.trim() || loading) return;
    const catsToUse = cats || categories;

    const userMsg: Message = { role: 'user', content: question, timestamp: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    const convId = currentConvId;
    if (convId) {
      updateConversationMessages(convId, newMessages);
    }

    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      let baziData = null, ziweiData = null, divData = null;

      if (token && catsToUse.includes('bazi')) {
        try { const r = await api.get('/api/users/charts'); baziData = r.data.find((c: any) => c.chartType === 'bazi')?.chartData; } catch (e) {}
      }
      if (token && catsToUse.includes('ziwei')) {
        try { const r = await api.get('/api/users/charts'); ziweiData = r.data.find((c: any) => c.chartType === 'ziwei')?.chartData; } catch (e) {}
      }
      if (token && catsToUse.includes('divination')) {
        try { divData = (await api.post('/api/divination/liuyao')).data; } catch (e) {}
      }

      const conversationHistory = newMessages.filter(m => m.role === 'user').slice(0, -1).map(m => ({
        role: 'user' as const,
        content: m.content,
      }));

      const res = await api.post('/api/ai-consultant/analyze', {
        question,
        categories: catsToUse,
        baziData,
        ziweiData,
        divinationData: divData,
        conversationHistory,
      });

      const assistantMsg: Message = { role: 'assistant', content: '', report: res.data, timestamp: Date.now() };
      const updatedMessages = [...newMessages, assistantMsg];
      setMessages(updatedMessages);
      if (convId) {
        updateConversationMessages(convId, updatedMessages);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || '分析请求失败，请稍后重试';
      const errorMsg: Message = { role: 'assistant', content: errMsg, timestamp: Date.now() };
      const updatedMessages = [...newMessages, errorMsg];
      setMessages(updatedMessages);
      if (convId) {
        updateConversationMessages(convId, updatedMessages);
      }
    } finally {
      setLoading(false);
    }
  };

  const regenerateResponse = async (msgIndex: number) => {
    if (loading) return;
    const userMsg = messages[msgIndex - 1];
    if (!userMsg || userMsg.role !== 'user') return;

    const newMessages = messages.slice(0, msgIndex);
    setMessages(newMessages);
    setLoading(true);

    const convId = currentConvId;

    try {
      const token = localStorage.getItem('token');
      let baziData = null, ziweiData = null, divData = null;

      if (token && categories.includes('bazi')) {
        try { const r = await api.get('/api/users/charts'); baziData = r.data.find((c: any) => c.chartType === 'bazi')?.chartData; } catch (e) {}
      }
      if (token && categories.includes('ziwei')) {
        try { const r = await api.get('/api/users/charts'); ziweiData = r.data.find((c: any) => c.chartType === 'ziwei')?.chartData; } catch (e) {}
      }
      if (token && categories.includes('divination')) {
        try { divData = (await api.post('/api/divination/liuyao')).data; } catch (e) {}
      }

      const conversationHistory = newMessages.filter(m => m.role === 'user').map(m => ({
        role: 'user' as const,
        content: m.content,
      }));

      const res = await api.post('/api/ai-consultant/analyze', {
        question: userMsg.content,
        categories,
        baziData,
        ziweiData,
        divinationData: divData,
        conversationHistory,
      });

      const assistantMsg: Message = { role: 'assistant', content: '', report: res.data, timestamp: Date.now() };
      const updatedMessages = [...newMessages, assistantMsg];
      setMessages(updatedMessages);
      if (convId) {
        updateConversationMessages(convId, updatedMessages);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || '重新分析失败，请稍后重试';
      const errorMsg: Message = { role: 'assistant', content: errMsg, timestamp: Date.now() };
      const updatedMessages = [...newMessages, errorMsg];
      setMessages(updatedMessages);
      if (convId) {
        updateConversationMessages(convId, updatedMessages);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const renderReportCard = (report: any) => (
    <div className="space-y-4">
      <div className="p-4 bg-xuan-gold/5 rounded-lg border border-xuan-gold/20">
        <div className="text-xs text-xuan-gold font-chinese mb-2">综合解读</div>
        <p className="text-sm text-xuan-silver font-chinese leading-relaxed">{report.overview}</p>
      </div>
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
      {report.overallAnalysis && (
        <div className="p-3 bg-xuan-gold/5 rounded border border-xuan-gold/20">
          <div className="text-xs text-xuan-gold font-chinese mb-1">整体分析</div>
          <p className="text-xs text-xuan-silver font-chinese leading-relaxed">{report.overallAnalysis}</p>
        </div>
      )}
      {report.causeAnalysis && (
        <div className="p-3 bg-blue-500/5 rounded border border-blue-500/20">
          <div className="text-xs text-blue-400 font-chinese mb-1">原因分析</div>
          <p className="text-xs text-xuan-silver font-chinese leading-relaxed">{report.causeAnalysis}</p>
        </div>
      )}
      {report.futureTrend && (
        <div className="p-3 bg-purple-500/5 rounded border border-purple-500/20">
          <div className="text-xs text-purple-400 font-chinese mb-1">未来趋势</div>
          <p className="text-xs text-xuan-silver font-chinese leading-relaxed">{report.futureTrend}</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
          <div className="text-xs text-emerald-400 font-chinese mb-2">优势</div>
          <ul className="space-y-1">
            {report.strengths?.map((s: string, i: number) => (
              <li key={i} className="text-xs text-xuan-silver font-chinese flex items-start gap-1">
                <span className="text-emerald-400">•</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
          <div className="text-xs text-red-400 font-chinese mb-2">注意事项</div>
          <ul className="space-y-1">
            {report.cautions?.map((c: string, i: number) => (
              <li key={i} className="text-xs text-xuan-silver font-chinese flex items-start gap-1">
                <span className="text-red-400">•</span> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="p-4 bg-xuan-cyan/5 rounded-lg border border-xuan-cyan/20">
        <div className="text-xs text-xuan-cyan font-chinese mb-2">建议</div>
        <ul className="space-y-1.5">
          {report.suggestions?.map((s: string, i: number) => (
            <li key={i} className="text-xs text-xuan-silver font-chinese flex items-start gap-2">
              <span className="text-xuan-cyan">{i + 1}.</span> {s}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-3">
        {report.luckyElements && (
          <div className="flex-1 p-3 bg-xuan-dark rounded border border-xuan-border">
            <div className="text-xs text-xuan-gold font-chinese mb-1">幸运元素</div>
            <div className="space-y-0.5 text-xs">
              {report.luckyElements.colors && <div className="text-xuan-silver">色: {report.luckyElements.colors.join('、')}</div>}
              {report.luckyElements.numbers && <div className="text-xuan-silver">数: {report.luckyElements.numbers.join('、')}</div>}
              {report.luckyElements.directions && <div className="text-xuan-silver">方位: {report.luckyElements.directions.join('、')}</div>}
            </div>
          </div>
        )}
        {report.bestTiming && (
          <div className="flex-1 p-3 bg-xuan-dark rounded border border-xuan-border">
            <div className="text-xs text-xuan-gold font-chinese mb-1">时机</div>
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
        <div className="max-w-6xl mx-auto w-full flex-1 flex">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 w-full">
            <span className="inline-block px-3 py-1 text-xs tracking-widest text-purple-400/70 font-chinese mb-4 border border-purple-400/20 rounded-full">AI驱动</span>
            <h1 className="text-2xl sm:text-3xl font-chinese font-bold text-gradient-gold mb-2">AI命理助手</h1>
            <p className="text-sm text-xuan-muted font-chinese">多维度命理数据 + 大语言模型 = 智能解读</p>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto w-full flex-1 flex gap-4 min-h-0">
          <div className={`w-64 flex-shrink-0 card-xuan-gold p-4 flex flex-col ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-chinese font-bold text-xuan-gold">历史对话</span>
              <button onClick={createNewConversation} className="text-xs font-chinese text-xuan-cyan hover:text-xuan-gold transition-colors">
                + 新对话
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.map(conv => (
                <div key={conv.id} onClick={() => switchConversation(conv.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all group ${
                    currentConvId === conv.id ? 'border-xuan-gold bg-xuan-gold/10' : 'border-xuan-border hover:border-xuan-gold/30'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-chinese text-xuan-silver truncate">{conv.title}</span>
                    <button onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                      className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-300 transition-all">
                      ×
                    </button>
                  </div>
                  <span className="text-[10px] font-chinese text-xuan-muted">
                    {conv.messages.length}条消息 · {new Date(conv.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              ))}
              {conversations.length === 0 && (
                <div className="text-center py-8 text-xs text-xuan-muted font-chinese">暂无历史对话</div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden mb-2 px-3 py-1.5 text-xs font-chinese text-xuan-gold border border-xuan-gold/30 rounded hover:bg-xuan-gold/10 self-start">
              {sidebarOpen ? '关闭侧栏' : '历史对话'}
            </button>

            <div className="flex gap-2 mb-3 justify-center flex-wrap">
              {[{ key: 'bazi', label: '八字', icon: '☯' }, { key: 'ziwei', label: '紫微', icon: '★' }, { key: 'divination', label: '占卜', icon: '爻' }].map((c) => (
                <button key={c.key} onClick={() => setCategories((prev) =>
                  prev.includes(c.key as any) ? prev.filter(p => p !== c.key) : [...prev, c.key as any]
                )}
                  className={`px-3 py-1.5 text-xs font-chinese rounded-full border transition-all ${
                    categories.includes(c.key as any) ? 'border-purple-400 bg-purple-500/10 text-purple-400' : 'border-xuan-border text-xuan-muted hover:border-purple-400/30'
                  }`}>{c.icon} {c.label}</button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 card-xuan-gold min-h-0">
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 ${
                    m.role === 'user' ? 'bg-xuan-gold/10 border border-xuan-gold/30' : 'card-xuan'
                  }`}>
                    {m.report ? (
                      <div>
                        {renderReportCard(m.report)}
                        {m.role === 'assistant' && (
                          <div className="mt-3 pt-2 border-t border-xuan-border flex items-center justify-between">
                            <span className="text-[10px] text-xuan-muted font-chinese">{formatTime(m.timestamp)}</span>
                            <button onClick={() => regenerateResponse(i)} disabled={loading}
                              className="text-[10px] font-chinese text-xuan-cyan hover:text-xuan-gold transition-colors disabled:opacity-30">
                              ↻ 重新生成
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-xuan-silver font-chinese leading-relaxed whitespace-pre-wrap">{m.content}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-xuan-muted font-chinese">{formatTime(m.timestamp)}</span>
                          {m.role === 'assistant' && i > 0 && (
                            <button onClick={() => regenerateResponse(i)} disabled={loading}
                              className="text-[10px] font-chinese text-xuan-cyan hover:text-xuan-gold transition-colors disabled:opacity-30">
                              ↻ 重新生成
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="card-xuan p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-sm text-xuan-muted font-chinese">
                      <span className="animate-pulse text-purple-400">●</span>
                      <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</span>
                      <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</span>
                      <span>AI分析中...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {messages.length <= 1 && (
              <div className="mb-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickQuestions.map((qq, i) => (
                  <button key={i} onClick={() => sendMessage(qq.q, qq.cat as any)}
                    className="p-3 text-xs font-chinese card-xuan hover:border-purple-400/40 transition-all text-left">
                    {qq.q}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
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
      </div>
      <Footer />
    </main>
  );
}
