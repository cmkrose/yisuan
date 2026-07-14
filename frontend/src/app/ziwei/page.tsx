'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';

type TabKey = 'chart' | 'stars' | 'dayun' | 'detailed' | 'overview';

const starColors: Record<string, string> = {
  紫微: 'text-purple-400', 天府: 'text-purple-300', 天机: 'text-emerald-400',
  太阳: 'text-amber-400', 武曲: 'text-yellow-300', 天同: 'text-cyan-400',
  廉贞: 'text-red-400', 太阴: 'text-blue-300', 贪狼: 'text-emerald-300',
  巨门: 'text-yellow-400', 天相: 'text-cyan-300', 天梁: 'text-amber-300',
  七杀: 'text-red-300', 破军: 'text-orange-400',
};

const brightnessLevels: Record<string, string> = {
  庙: 'text-emerald-400', 旺: 'text-emerald-300', 得: 'text-lime-400',
  利: 'text-yellow-400', 平: 'text-xuan-silver', 不: 'text-amber-400', 陷: 'text-red-400',
};

const layoutPositions: [number, number, number][] = [
  [0, 0, 10], [1, 0, 1], [2, 0, 0],
  [0, 1, 9], [2, 1, 2],
  [0, 2, 8], [1, 2, 3], [2, 2, 4],
  [0, 3, 7], [1, 3, 6], [2, 3, 5],
];

const palaceNames = ['命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄', '迁移', '交友', '田宅', '事业', '福德', '父母'];

const overviewCategories = [
  { key: 'career', title: '事业分析', icon: '💼' },
  { key: 'marriage', title: '婚姻感情', icon: '💍' },
  { key: 'wealth', title: '财运分析', icon: '💰' },
  { key: 'health', title: '健康分析', icon: '🏥' },
];

export default function ZiweiPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('detailed');
  const [form, setForm] = useState({
    birthYear: 1990, birthMonth: 1, birthDay: 1, birthHour: 8, gender: 'male' as 'male' | 'female',
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'chart', label: '命盘', icon: '☰' },
    { key: 'stars', label: '星曜', icon: '⭐' },
    { key: 'dayun', label: '大运', icon: '运' },
    { key: 'detailed', label: '详细分析', icon: '文' },
    { key: 'overview', label: '综合分析', icon: '📊' },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await api.post('/api/ziwei/calculate', {
        birthYear: Number(form.birthYear), birthMonth: Number(form.birthMonth),
        birthDay: Number(form.birthDay), birthHour: Number(form.birthHour),
        gender: form.gender,
      });
      if (res.data?.error) { setError('排盘失败：' + res.data.error); return; }
      setResult(res.data);
      setActiveTab('detailed');
    } catch (err: any) { setError(err.response?.data?.message || '排盘失败'); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!localStorage.getItem('token')) { alert('请先登录'); return; }
    try {
      await api.post('/api/ziwei/save', form);
      alert('命盘已保存');
    } catch (err: any) { alert('保存失败'); }
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
    pdf.save(`紫微命盘_${form.birthYear}年${form.birthMonth}月.pdf`);
  };

  const renderPalace = (palace: any) => {
    if (!palace) return null;
    return (
      <div className={`p-2 rounded-lg border text-center h-full flex flex-col ${
        palace.isBodyPalace ? 'border-purple-400/50 bg-purple-500/5' :
        palace.name === '命宫' ? 'border-xuan-gold/40 bg-xuan-gold/5' :
        'border-xuan-border bg-xuan-dark/50'
      }`}>
        <div className={`text-[10px] sm:text-xs font-chinese mb-1 ${
          palace.name === '命宫' ? 'text-xuan-gold' : 'text-xuan-silver'
        }`}>
          {palace.name}
          {palace.isBodyPalace && <span className="text-purple-400 ml-1">身</span>}
        </div>
        <div className="text-[9px] sm:text-[10px] text-xuan-muted mb-0.5">{palace.stem}{palace.branch}</div>
        <div className="flex-1 space-y-0.5 overflow-hidden">
          {palace.majorStars.map((s: any, i: number) => (
            <div key={i} className="flex items-center gap-1 justify-center">
              <span className={`text-[10px] sm:text-xs font-chinese font-bold ${starColors[s.name] || 'text-xuan-silver'}`}>
                {s.name}
              </span>
              <span className={`text-[8px] ${brightnessLevels[s.brightness] || 'text-xuan-muted'}`}>
                {s.brightness}
              </span>
            </div>
          ))}
          {palace.minorStars.filter((s: any) => ['文昌', '文曲', '左辅', '右弼', '天魁', '天钺', '禄存', '天马'].includes(s.name)).map((s: any, i: number) => (
            <div key={`a-${i}`} className="text-[9px] sm:text-[10px] text-emerald-400/70 font-chinese">{s.name}</div>
          ))}
          {palace.minorStars.filter((s: any) => ['擎羊', '陀罗', '火星', '铃星', '地空', '地劫'].includes(s.name)).map((s: any, i: number) => (
            <div key={`b-${i}`} className="text-[9px] sm:text-[10px] text-red-400/70 font-chinese">{s.name}</div>
          ))}
        </div>
        {palace.majorLimit && (
          <div className="text-[8px] text-xuan-muted mt-1 border-t border-xuan-border pt-0.5">
            {palace.majorLimit.startAge}-{palace.majorLimit.endAge}岁
          </div>
        )}
      </div>
    );
  };

  const detailedSections = result?.analysis?.palaceAnalysis
    ? Object.entries(result.analysis.palaceAnalysis).map(([name, content]: any) => ({
        key: name,
        title: `${name}宫详解`,
        content: typeof content === 'string' ? content : '',
      }))
    : [];

  const overviewData = {
    career: result?.analysis?.career || '',
    marriage: result?.analysis?.marriage || '',
    wealth: result?.analysis?.wealth || '',
    health: result?.analysis?.health || '',
    overview: result?.analysis?.overview || '',
  };

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs tracking-[0.3em] text-purple-400/70 font-chinese mb-4">命理系统</span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">紫微斗数</h1>
            <p className="text-xuan-muted font-chinese">十二宫位 · 十四主星 · 辅曜煞曜 · 大限流年</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card-xuan-gold p-6 sm:p-8 mb-10">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-chinese text-xuan-muted mb-1">年</label>
                  <select value={form.birthYear} onChange={(e) => setForm({ ...form, birthYear: Number(e.target.value) })}
                    className="w-full px-2 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white focus:border-purple-400/50">
                    {Array.from({ length: 100 }, (_, i) => 2024 - i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-chinese text-xuan-muted mb-1">月</label>
                  <select value={form.birthMonth} onChange={(e) => setForm({ ...form, birthMonth: Number(e.target.value) })}
                    className="w-full px-2 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}月</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-chinese text-xuan-muted mb-1">日</label>
                  <select value={form.birthDay} onChange={(e) => setForm({ ...form, birthDay: Number(e.target.value) })}
                    className="w-full px-2 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}日</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-chinese text-xuan-muted mb-1">时间</label>
                  <select value={form.birthHour} onChange={(e) => setForm({ ...form, birthHour: Number(e.target.value) })}
                    className="w-full px-2 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                    {Array.from({ length: 24 }, (_, i) => i).map(h => <option key={h} value={h}>{h}:00</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-chinese text-xuan-muted mb-1">性别</label>
                  <div className="flex gap-1">
                    {[{ v: 'male', l: '男' }, { v: 'female', l: '女' }].map(o => (
                      <button key={o.v} type="button" onClick={() => setForm({ ...form, gender: o.v as any })}
                        className={`flex-1 py-2.5 rounded-lg text-sm border ${form.gender === o.v ? 'border-purple-400 bg-purple-400/10 text-purple-400' : 'border-xuan-border text-xuan-muted hover:border-purple-400/30'}`}>{o.l}</button>
                    ))}
                  </div>
                </div>
              </div>
              {error && <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">{error}</div>}
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="flex-1 btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                  {loading ? '排盘中...' : '开始排盘'}
                </button>
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
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" ref={reportRef}>
                <div className="flex justify-end gap-3">
                  <button onClick={handleSave} className="btn-outline-gold px-6 py-2.5 text-sm font-chinese">保存到我的命盘</button>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="grid grid-cols-5 gap-3 mb-8">
                  {tabs.map((t) => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        activeTab === t.key ? 'border-purple-400 bg-purple-400/10 shadow-lg shadow-purple-400/10' : 'card-xuan hover:border-purple-400/30'
                      }`}>
                      <span className="text-2xl block mb-1">{t.icon}</span>
                      <span className={`text-xs sm:text-sm font-chinese ${activeTab === t.key ? 'text-purple-400' : 'text-xuan-silver'}`}>{t.label}</span>
                    </button>
                  ))}
                </motion.div>

                <AnimatePresence mode="wait">
                  {activeTab === 'chart' && (
                    <motion.div key="chart" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="card-xuan-gold p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-chinese font-bold text-xuan-gold">紫微命盘</h2>
                          <span className="text-xs font-chinese text-xuan-muted">{result.fiveElementBureau} · 身宫:{result.bodyPalace}</span>
                        </div>
                        {result.siHuaStars && (
                          <div className="grid grid-cols-4 gap-2 mb-4">
                            <div className="text-center p-2 bg-green-500/10 rounded border border-green-500/20"><div className="text-xs text-green-400">化禄</div><div className="text-sm font-chinese text-white">{result.siHuaStars.禄}</div></div>
                            <div className="text-center p-2 bg-purple-500/10 rounded border border-purple-500/20"><div className="text-xs text-purple-400">化权</div><div className="text-sm font-chinese text-white">{result.siHuaStars.权}</div></div>
                            <div className="text-center p-2 bg-blue-500/10 rounded border border-blue-500/20"><div className="text-xs text-blue-400">化科</div><div className="text-sm font-chinese text-white">{result.siHuaStars.科}</div></div>
                            <div className="text-center p-2 bg-red-500/10 rounded border border-red-500/20"><div className="text-xs text-red-400">化忌</div><div className="text-sm font-chinese text-white">{result.siHuaStars.忌}</div></div>
                          </div>
                        )}
                        <div className="hidden sm:grid grid-cols-3 gap-2">
                          {layoutPositions.map(([col, row, idx], i) => {
                            const palace = idx >= 0 ? result.palaces[idx] : null;
                            if (idx === -1) return (
                              <div key="center" className="flex items-center justify-center p-4 bg-xuan-dark rounded-lg border border-purple-400/20">
                                <div className="text-center">
                                  <div className="text-3xl font-chinese text-purple-400/50 mb-2">☯</div>
                                  <div className="text-xs text-xuan-muted">{result.fiveElementBureau}</div>
                                  {result.currentCycle && (
                                    <div className="text-xs text-purple-400 mt-1">
                                      当前大限: {result.currentCycle.palace}({result.currentCycle.startAge}-{result.currentCycle.endAge}岁)
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                            return <div key={idx}>{renderPalace(palace)}</div>;
                          })}
                        </div>
                        <div className="sm:hidden grid grid-cols-3 gap-1">
                          {layoutPositions.map(([col, row, idx]) => {
                            if (idx === -1) return (
                              <div key="center" className="flex items-center justify-center p-2 bg-xuan-dark rounded border border-purple-400/20">
                                <div className="text-center">
                                  <div className="text-xl font-chinese text-purple-400/50">☯</div>
                                  <div className="text-[10px] text-xuan-muted">{result.fiveElementBureau}</div>
                                </div>
                              </div>
                            );
                            return <div key={idx}>{renderPalace(result.palaces[idx])}</div>;
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'stars' && (
                    <motion.div key="stars" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="card-xuan-gold p-6">
                        <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">星曜总览</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {result.palaces.filter((p: any) => p.majorStars.length > 0).map((p: any) => (
                            <div key={p.name} className="p-3 bg-xuan-dark rounded-lg border border-xuan-border">
                              <div className="text-xs font-chinese text-xuan-gold mb-2">{p.name}宫</div>
                              <div className="space-y-1">
                                {p.majorStars.map((s: any, i: number) => (
                                  <div key={i} className="flex items-center justify-between">
                                    <span className={`text-sm font-chinese font-bold ${starColors[s.name] || 'text-xuan-silver'}`}>{s.name}</span>
                                    <span className={`text-xs ${brightnessLevels[s.brightness] || 'text-xuan-muted'}`}>{s.brightness}</span>
                                  </div>
                                ))}
                              </div>
                              {p.minorStars.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-xuan-border">
                                  <div className="flex flex-wrap gap-1">
                                    {p.minorStars.map((s: any, i: number) => (
                                      <span key={i} className={`text-[10px] font-chinese px-1.5 py-0.5 rounded ${
                                        ['擎羊', '陀罗', '火星', '铃星', '地空', '地劫'].includes(s.name)
                                          ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'
                                      }`}>{s.name}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'dayun' && (
                    <motion.div key="dayun" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="card-xuan-gold p-6">
                        <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">大限排盘</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {result.majorCycles.map((mc: any, i: number) => (
                            <div key={i} className={`p-2 rounded-lg text-center text-xs border ${
                              result.currentCycle?.palace === mc.palace ? 'border-purple-400 bg-purple-400/10' : 'border-xuan-border bg-xuan-dark'
                            }`}>
                              <div className={`font-chinese font-bold ${result.currentCycle?.palace === mc.palace ? 'text-purple-400' : 'text-xuan-gold'}`}>
                                {mc.palace}
                              </div>
                              <div className="text-[10px] text-xuan-muted">{mc.startAge}-{mc.endAge}岁</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'detailed' && (
                    <motion.div key="detailed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="space-y-3">
                        {detailedSections.map((s: any) => (
                          <div key={s.key} className="card-xuan-gold p-4">
                            <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-2">{s.title}</h4>
                            <div className="text-sm font-chinese text-xuan-silver leading-relaxed whitespace-pre-wrap">
                              {s.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="space-y-3">
                        {overviewData.overview && (
                          <div className="card-xuan-gold p-4">
                            <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-2">命盘总览</h4>
                            <div className="text-sm font-chinese text-xuan-silver leading-relaxed whitespace-pre-wrap">
                              {overviewData.overview}
                            </div>
                          </div>
                        )}
                        {overviewCategories.map((cat) => {
                          const content = (overviewData as any)[cat.key];
                          if (!content) return null;
                          return (
                            <div key={cat.key} className="card-xuan-gold p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span>{cat.icon}</span>
                                <h4 className="text-sm font-chinese font-bold text-xuan-gold">{cat.title}</h4>
                              </div>
                              <div className="text-sm font-chinese text-xuan-silver leading-relaxed whitespace-pre-wrap">
                                {content}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </main>
  );
}
