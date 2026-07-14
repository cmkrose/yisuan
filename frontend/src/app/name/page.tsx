'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';

const analysisSections = [
  { key: 'wuge', title: '五格分析', icon: '五' },
  { key: 'sancai', title: '三才配置', icon: '三' },
  { key: 'kangxi', title: '康熙笔画', icon: '笔' },
  { key: 'wuxing', title: '五行属性', icon: '行' },
  { key: 'yinlv', title: '音律分析', icon: '音' },
  { key: 'ziyi', title: '字义分析', icon: '义' },
  { key: 'proscons', title: '姓名优缺点', icon: '评' },
  { key: 'xingge', title: '性格分析', icon: '性' },
  { key: 'shiye', title: '事业分析', icon: '事' },
  { key: 'caiyun', title: '财运分析', icon: '财' },
  { key: 'hunyin', title: '婚姻分析', icon: '婚' },
  { key: 'gainame', title: '改名建议', icon: '改' },
];

export default function NamePage() {
  const [form, setForm] = useState({ surname: '', givenName: '', gender: 'male' as 'male' | 'female' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.surname || !form.givenName) { setError('请输入姓名'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/name-analysis/analyze', form);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || '分析失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggest = async () => {
    if (!form.surname) { setError('请输入姓氏'); return; }
    try {
      const res = await api.post('/api/name-analysis/suggest', { surname: form.surname, gender: form.gender });
      setSuggestions(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || '获取建议失败');
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) { alert('请先登录后保存'); return; }
    try {
      await api.post('/api/name-analysis/save', form);
      alert('分析结果已保存到个人中心');
    } catch (err: any) { alert(err.response?.data?.message || '保存失败'); }
  };

  const exportPDF = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    const el = reportRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#0a0a0f' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    let heightLeft = pdfHeight;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();
    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }
    pdf.save(`姓名分析_${form.surname}${form.givenName}.pdf`);
  };

  const toggleSection = (s: string) => setExpandedSection(expandedSection === s ? null : s);

  const wugeOrder = ['tianGe', 'renGe', 'diGe', 'waiGe', 'zongGe'] as const;

  const genderBtn = (v: typeof form.gender, l: string) => (
    <button type="button" onClick={() => { setForm({ ...form, gender: v }); setResult(null); }}
      className={`flex-1 py-2.5 rounded-lg text-sm border transition-all ${
        form.gender === v ? 'border-xuan-gold bg-xuan-gold/10 text-xuan-gold' : 'border-xuan-border text-xuan-muted hover:border-xuan-gold/30'
      }`}>{l}</button>
  );

  const getSectionContent = (key: string): string => {
    if (!result) return '';
    const a = result.analysis || {};
    const ev = result.evaluation || {};
    switch (key) {
      case 'wuge':
        return wugeOrder.map(k => {
          const g = (a.wuge || {})[k];
          if (!g) return '';
          return `【${g.name}】${g.strokes}画 · 五行属${g.wuxing}\n含义：${g.meaning}\n吉凶：${g.isAuspicious ? '吉' : '凶'}`;
        }).filter(Boolean).join('\n\n') || '暂无数据';
      case 'sancai':
        return a.sancai ? `【三才配置】${a.sancai.config}\n天格:${a.sancai.heaven} · 人格:${a.sancai.person} · 地格:${a.sancai.earth}\n\n${a.sancai.meaning}` : '暂无数据';
      case 'kangxi':
        return `【康熙笔画】\n${(a.kangxiStrokes || []).map((ks: any) => `「${ks.char}」：${ks.strokes}画（五行${ks.wuxing}）`).join('\n') || '暂无数据'}`;
      case 'wuxing':
        return a.wuxing ? `【五行属性】\n${(a.wuxing.details || []).map((d: any) => `${d.grid}：${d.element}`).join('\n')}\n\n五行平衡：${a.wuxing.balance || '暂无数据'}` : '暂无数据';
      case 'yinlv':
        return `【音律分析】\n${a.yinlv || '暂无数据'}`;
      case 'ziyi':
        return `【字义分析】\n${a.ziyi?.overall || '暂无数据'}`;
      case 'proscons':
        return `【姓名优缺点】\n优点：\n${(ev.pros || []).map((p: string) => `✓ ${p}`).join('\n') || '暂无数据'}\n\n不足：\n${(ev.cons || []).map((c: string) => `✗ ${c}`).join('\n') || '暂无数据'}\n\n潜在问题：\n${(ev.potentialIssues || []).map((i: string) => `⚠ ${i}`).join('\n') || '暂无'}`;
      case 'xingge':
        return `【性格分析】\n综合五格三才和五行属性分析，${ev.overallScore ? `姓名总评分${ev.overallScore}分（${ev.rating}）。` : ''}${(ev.pros || []).slice(0, 3).join('；')}。`;
      case 'shiye':
        return `【事业分析】\n姓名数理对事业的影响主要体现在人格与外格的互动。${(ev.pros || []).find((p: string) => p.includes('事业') || p.includes('工作')) || '根据姓名综合分析，事业发展方向与个人的五行属性密切相关。'}`;
      case 'caiyun':
        return `【财运分析】\n姓名中的财富信息主要体现在总格与人格的关系上。${(ev.pros || []).find((p: string) => p.includes('财') || p.includes('富')) || '财运与个人的努力和机遇密切相关，姓名数理可以提供有益的参考。'}`;
      case 'hunyin':
        return `【婚姻分析】\n姓名对婚姻的影响主要体现在人格与地格的搭配。${(ev.pros || []).find((p: string) => p.includes('婚') || p.includes('感情')) || '婚姻幸福需要双方共同努力，姓名分析可以提供参考方向。'}`;
      case 'gainame':
        return result.suggestions?.length ? result.suggestions.map((s: any) => `【推荐】${s.name}\n建议原因：${s.reason}\n改善方面：${s.improvement}\n评分：${s.score}分`).join('\n\n') : '暂无改名建议';
      default:
        return '';
    }
  };

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center mb-10">
            <span className="inline-block text-xs tracking-[0.3em] text-xuan-gold/70 font-chinese mb-4">姓名学</span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">姓名分析</h1>
            <p className="text-xuan-muted font-chinese">五格剖象法 · 三才配置 · 五行分析 · 综合评分</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card-xuan-gold p-6 sm:p-8 mb-10">
            <form onSubmit={handleAnalyze} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-chinese text-xuan-muted mb-1.5">姓氏</label>
                  <input type="text" value={form.surname}
                    onChange={(e) => { setForm({ ...form, surname: e.target.value }); setResult(null); }}
                    placeholder="请输入姓氏" className="w-full px-4 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-white placeholder-xuan-muted focus:outline-none focus:border-xuan-gold/50" />
                </div>
                <div>
                  <label className="block text-xs font-chinese text-xuan-muted mb-1.5">名字</label>
                  <input type="text" value={form.givenName}
                    onChange={(e) => { setForm({ ...form, givenName: e.target.value }); setResult(null); }}
                    placeholder="请输入名字" className="w-full px-4 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-white placeholder-xuan-muted focus:outline-none focus:border-xuan-gold/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-chinese text-xuan-muted mb-1.5">性别</label>
                <div className="flex gap-2">{genderBtn('male', '男')}{genderBtn('female', '女')}</div>
              </div>
              {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 font-chinese">{error}</div>}
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="flex-1 btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                  {loading ? '分析中...' : '开始分析'}
                </button>
                <button type="button" onClick={handleSuggest}
                  className="btn-outline-gold px-6 py-4 text-sm font-chinese">改名建议</button>
                {result && (
                  <button type="button" onClick={exportPDF}
                    className="px-6 py-4 border border-xuan-gold/30 text-xuan-gold rounded-lg hover:bg-xuan-gold/10 transition-all font-chinese text-sm">
                    导出PDF
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="space-y-6" ref={reportRef}>
                <div className="flex justify-end">
                  <button onClick={handleSave} className="btn-outline-gold px-6 py-2.5 text-sm font-chinese">保存到我的命盘</button>
                </div>

                <div className="card-xuan-gold p-6 sm:p-8 text-center">
                  <div className={`text-6xl font-chinese font-bold mb-3 ${
                    result.evaluation?.rating === '大吉' ? 'text-emerald-400' :
                    result.evaluation?.rating === '吉' ? 'text-xuan-gold' :
                    result.evaluation?.rating === '中吉' ? 'text-amber-400' : 'text-red-400'
                  }`}>{result.evaluation?.overallScore}</div>
                  <div className="text-xl font-chinese font-bold text-white mb-1">{result.evaluation?.rating}</div>
                  <div className="text-sm text-xuan-muted font-chinese">{result.analysis?.fullName} 综合评分</div>
                  <div className="flex justify-center gap-3 mt-4">
                    {(result.evaluation?.lucky?.numbers || []).map((n: number) => (
                      <span key={n} className="px-3 py-1 text-xs font-chinese bg-xuan-gold/10 text-xuan-gold rounded-full">幸运数字 {n}</span>
                    ))}
                    {(result.evaluation?.lucky?.colors || []).map((c: string) => (
                      <span key={c} className="px-3 py-1 text-xs font-chinese bg-xuan-gold/10 text-xuan-gold rounded-full">{c}</span>
                    ))}
                  </div>
                </div>

                <div className="card-xuan-gold p-6 sm:p-8">
                  <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-6">五格剖象</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {wugeOrder.map((key) => {
                      const g = (result.analysis?.wuge || {})[key];
                      if (!g) return null;
                      return (
                        <div key={key} className={`p-4 rounded-lg border text-center transition-all ${
                          g.isAuspicious ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'
                        }`}>
                          <div className="text-xs font-chinese text-xuan-muted mb-1">{g.name}</div>
                          <div className={`text-2xl font-chinese font-bold mb-1 ${g.isAuspicious ? 'text-emerald-400' : 'text-red-400'}`}>
                            {g.strokes}
                          </div>
                          <div className="text-xs font-chinese text-xuan-gold mb-1">{g.wuxing}</div>
                          <div className={`text-[10px] font-chinese ${g.isAuspicious ? 'text-xuan-silver' : 'text-red-400/70'}`}>
                            {g.meaning}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="card-xuan-gold p-6">
                    <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">三才配置</h3>
                    <div className="flex items-center gap-3 mb-3">
                      {['天', '人', '地'].map((label, i) => {
                        const el = i === 0 ? result.analysis?.sancai?.heaven : i === 1 ? result.analysis?.sancai?.person : result.analysis?.sancai?.earth;
                        const elColors: Record<string, string> = { 木: 'text-emerald-400', 火: 'text-red-400', 土: 'text-amber-400', 金: 'text-yellow-300', 水: 'text-cyan-400' };
                        return (
                          <span key={label} className={`px-3 py-2 text-sm font-chinese border rounded-lg ${elColors[el] || 'text-xuan-gold'} border-current/30 bg-current/5`}>
                            {label}:{el}
                          </span>
                        );
                      })}
                    </div>
                    <div className="text-sm font-chinese text-xuan-muted">{result.analysis?.sancai?.config}</div>
                    <div className={`mt-2 text-sm font-chinese ${result.analysis?.sancai?.isAuspicious ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.analysis?.sancai?.meaning}
                    </div>
                  </div>

                  <div className="card-xuan-gold p-6">
                    <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">五行分析</h3>
                    <div className="text-sm font-chinese text-xuan-silver mb-3">{result.analysis?.wuxing?.balance}</div>
                    <div className="space-y-1.5">
                      {(result.analysis?.wuxing?.details || []).map((d: any) => (
                        <div key={d.grid} className="flex items-center justify-between text-xs font-chinese">
                          <span className="text-xuan-muted">{d.grid}</span>
                          <span className="text-xuan-gold">{d.element}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {analysisSections.map((s) => (
                    <div key={s.key} className="card-xuan-gold overflow-hidden">
                      <button onClick={() => toggleSection(s.key)}
                        className="w-full p-4 flex items-center justify-between hover:bg-xuan-gold/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-xuan-gold/10 text-xuan-gold font-chinese text-sm">{s.icon}</span>
                          <h4 className="text-sm font-chinese font-bold text-xuan-gold">{s.title}</h4>
                        </div>
                        <svg className={`w-4 h-4 text-xuan-gold transition-transform ${expandedSection === s.key ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedSection === s.key && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          className="px-4 pb-4">
                          <div className="text-sm font-chinese text-xuan-silver leading-relaxed whitespace-pre-wrap border-t border-xuan-border pt-3">
                            {getSectionContent(s.key)}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="mt-8 card-xuan-gold p-6">
                <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">改名建议</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {suggestions.map((s, i) => (
                    <div key={i} className="p-4 bg-xuan-dark rounded-lg border border-xuan-border text-center hover:border-xuan-gold/40 transition-all cursor-pointer"
                      onClick={() => {
                        const fullName = s.name;
                        setForm({ ...form, surname: fullName[0], givenName: fullName.slice(1) });
                        setSuggestions([]);
                      }}>
                      <div className="text-lg font-chinese font-bold text-white mb-1">{s.name}</div>
                      <span className="text-xs font-chinese text-xuan-gold">评分 {s.score}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </main>
  );
}
