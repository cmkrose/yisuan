'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

type TabKey = 'pillars' | 'analysis' | 'charts' | 'dayun';

const ELEMENT_COLORS: Record<string, string> = { 木: '#22c55e', 火: '#ef4444', 土: '#eab308', 金: '#94a3b8', 水: '#3b82f6' };

export default function BaziPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('analysis');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: '', gender: 'male' as 'male' | 'female',
    birthYear: 1995, birthMonth: 8, birthDay: 22, birthHour: 6,
    birthPlace: '',
  });

  const calculate = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/api/bazi/calculate', form);
      if (res.data?.error) {
        setError('排盘失败：' + res.data.error);
        return;
      }
      setResult(res.data);
      setActiveTab('analysis');
    } catch (e: any) { setError('请求失败：' + (e.message || '未知错误')); }
    finally { setLoading(false); }
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
    pdf.save(`八字命盘_${form.name || '命盘'}_${form.birthYear}年.pdf`);
  };

  const toggleSection = (s: string) => setExpandedSection(expandedSection === s ? null : s);

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'pillars', label: '四柱排盘', icon: '☰' },
    { key: 'analysis', label: '详细分析', icon: '文' },
    { key: 'charts', label: '图表展示', icon: '📊' },
    { key: 'dayun', label: '大运流年', icon: '运' },
  ];

  const sections = [
    { key: 'pillars', title: '四柱信息', data: result?.analysis?.detailedAnalysis?.pillars },
    { key: 'dayMaster', title: '日主分析', data: result?.analysis?.detailedAnalysis?.dayMaster },
    { key: 'pattern', title: '格局分析', data: result?.analysis?.detailedAnalysis?.pattern },
    { key: 'favorableUnfavorable', title: '喜用神与忌神', data: result?.analysis?.detailedAnalysis?.favorableUnfavorable },
    { key: 'wuxingBalance', title: '五行旺衰', data: result?.analysis?.detailedAnalysis?.wuxingBalance },
    { key: 'personality', title: '性格分析', data: result?.analysis?.detailedAnalysis?.personality },
    { key: 'career', title: '事业分析', data: result?.analysis?.detailedAnalysis?.career },
    { key: 'wealth', title: '财运分析', data: result?.analysis?.detailedAnalysis?.wealth },
    { key: 'marriage', title: '婚姻分析', data: result?.analysis?.detailedAnalysis?.marriage },
    { key: 'health', title: '健康分析', data: result?.analysis?.detailedAnalysis?.health },
    { key: 'dayun', title: '大运分析', data: result?.analysis?.detailedAnalysis?.dayun },
    { key: 'liunian', title: '流年分析', data: result?.analysis?.detailedAnalysis?.liunian },
    { key: 'strengths', title: '命局优点', data: result?.analysis?.detailedAnalysis?.strengths },
    { key: 'weaknesses', title: '命局不足', data: result?.analysis?.detailedAnalysis?.weaknesses },
    { key: 'overallSummary', title: '综合评述', data: result?.analysis?.detailedAnalysis?.overallSummary },
  ];

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs tracking-[0.3em] text-xuan-cyan/70 font-chinese mb-4">八字命理系统</span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">专业八字排盘 V2</h1>
            <p className="text-xuan-muted font-chinese">四柱八字 · 五行分析 · 命运解读</p>
          </motion.div>

          {/* Input Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card-xuan-gold p-6 sm:p-8 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs text-xuan-muted font-chinese mb-1 block">姓名</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white" placeholder="选填" />
              </div>
              <div>
                <label className="text-xs text-xuan-muted font-chinese mb-1 block">性别</label>
                <div className="flex gap-2">
                  {[{v:'male',l:'男'},{v:'female',l:'女'}].map(o=>(
                    <button key={o.v} onClick={()=>setForm({...form,gender:o.v as any})}
                      className={`flex-1 py-3 rounded-lg text-sm border ${form.gender===o.v?'border-xuan-cyan bg-xuan-cyan/10 text-xuan-cyan':'border-xuan-border text-xuan-muted hover:border-xuan-cyan/30'}`}>{o.l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-xuan-muted font-chinese mb-1 block">年份</label>
                <select value={form.birthYear} onChange={e => setForm({...form, birthYear: Number(e.target.value)})}
                  className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                  {Array.from({length:100},(_,i)=>2024-i).map(y=><option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-xuan-muted font-chinese mb-1 block">月份</label>
                <select value={form.birthMonth} onChange={e => setForm({...form, birthMonth: Number(e.target.value)})}
                  className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                  {Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}月</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-xuan-muted font-chinese mb-1 block">日期</label>
                <select value={form.birthDay} onChange={e => setForm({...form, birthDay: Number(e.target.value)})}
                  className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                  {Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}日</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-xuan-muted font-chinese mb-1 block">时辰</label>
                <select value={form.birthHour} onChange={e => setForm({...form, birthHour: Number(e.target.value)})}
                  className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                  {Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{h}时</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={calculate} disabled={loading}
                className="flex-1 btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                {loading ? '排盘中...' : '开始排盘'}
              </button>
              {result && !error && (
                <button onClick={exportPDF}
                  className="px-6 py-4 border border-xuan-gold/30 text-xuan-gold rounded-lg hover:bg-xuan-gold/10 transition-all font-chinese text-sm">
                  导出PDF
                </button>
              )}
            </div>
            {error && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 font-chinese">
                {error}
              </div>
            )}
          </motion.div>

          {result && (
            <div ref={reportRef}>
              {/* Tabs */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="grid grid-cols-4 gap-3 mb-8">
                {tabs.map((t) => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      activeTab === t.key ? 'border-xuan-cyan bg-xuan-cyan/10 shadow-lg shadow-xuan-cyan/10' : 'card-xuan hover:border-xuan-cyan/30'
                    }`}>
                    <span className="text-2xl block mb-1">{t.icon}</span>
                    <span className={`text-xs sm:text-sm font-chinese ${activeTab === t.key ? 'text-xuan-cyan' : 'text-xuan-silver'}`}>{t.label}</span>
                  </button>
                ))}
              </motion.div>

              <AnimatePresence mode="wait">
                {/* PILLARS TAB */}
                {activeTab === 'pillars' && (
                  <motion.div key="pillars" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="card-xuan-gold p-6 mb-6">
                      <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-2 text-center">四柱排盘</h3>
                      <p className="text-xs text-xuan-muted text-center mb-4">日主：{result.bazi.dayMaster}（{result.bazi.dayMasterElement}）· {result.analysis.dayMasterAnalysis.strength}</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[['年柱', result.bazi.year], ['月柱', result.bazi.month], ['日柱', result.bazi.day], ['时柱', result.bazi.hour]].map(([label, p]: any) => (
                          <div key={label} className="text-center p-3 bg-xuan-dark rounded-lg border border-xuan-border">
                            <div className="text-xs text-xuan-muted mb-1 font-chinese">{label}</div>
                            <div className="text-lg font-chinese font-bold text-xuan-gold">{p.stem}{p.branch}</div>
                            <div className="text-[10px] text-xuan-muted">{p.stemElement}{p.branchElement} · {p.stemYinYang}{p.branchYinYang}</div>
                            <div className="text-[10px] text-xuan-cyan mt-1">{p.shishen || '日主'}</div>
                            <div className="text-[10px] text-xuan-muted mt-0.5">纳音：{p.nayin}</div>
                            <div className="text-[10px] text-xuan-muted">
                              藏干：{p.cangGan.map((c: any) => c.stem).join(' ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Five Elements Summary */}
                    <div className="card-xuan p-4">
                      <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">五行力量分布</h4>
                      <div className="space-y-2">
                        {Object.entries(result.analysis.dayMasterAnalysis.elementCounts).map(([el, val]: any) => (
                          <div key={el} className="flex items-center gap-2">
                            <span className="text-sm font-chinese w-8" style={{color: ELEMENT_COLORS[el]}}>{el}</span>
                            <div className="flex-1 h-3 bg-xuan-dark rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((val / 8) * 100, 100)}%`, backgroundColor: ELEMENT_COLORS[el] }} />
                            </div>
                            <span className="text-xs text-xuan-muted w-10 text-right">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ANALYSIS TAB */}
                {activeTab === 'analysis' && (
                  <motion.div key="analysis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="space-y-6">
                      {sections.map((s) => (
                        <div key={s.key} className="card-xuan-gold p-5">
                          <h4 className="text-base font-chinese font-bold text-xuan-gold mb-3 border-b border-xuan-border pb-2">{s.title}</h4>
                          {s.data ? (
                            <div className="text-sm font-chinese text-xuan-silver leading-relaxed whitespace-pre-wrap">
                              {s.data}
                            </div>
                          ) : (
                            <div className="text-sm text-xuan-muted">暂无数据</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* CHARTS TAB */}
                {activeTab === 'charts' && (
                  <motion.div key="charts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Pie Chart - Element Distribution */}
                      <div className="card-xuan-gold p-6">
                        <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-4 text-center">五行占比图</h4>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie data={result.analysis.chartData.elementDistribution} dataKey="value" nameKey="name"
                              cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                              {result.analysis.chartData.elementDistribution.map((entry: any, i: number) => (
                                <Cell key={i} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Bar Chart - Element Strength */}
                      <div className="card-xuan-gold p-6">
                        <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-4 text-center">五行强弱图</h4>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={result.analysis.chartData.elementDistribution}>
                            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              {result.analysis.chartData.elementDistribution.map((entry: any, i: number) => (
                                <Cell key={i} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Radar Chart - Element Balance */}
                      <div className="card-xuan-gold p-6">
                        <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-4 text-center">五行平衡图</h4>
                        <ResponsiveContainer width="100%" height={250}>
                          <RadarChart data={result.analysis.chartData.elementDistribution}>
                            <PolarGrid stroke="rgba(212,168,83,0.2)" />
                            <PolarAngleAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <PolarRadiusAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
                            <Radar name="五行" dataKey="value" stroke="#d4a853" fill="#d4a853" fillOpacity={0.3} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Shishen Distribution */}
                      <div className="card-xuan-gold p-6">
                        <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-4 text-center">十神分布图</h4>
                        {result.analysis.chartData.shishenDistribution.length > 0 ? (
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={result.analysis.chartData.shishenDistribution} layout="vertical">
                              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                              <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af', fontSize: 11 }} width={50} />
                              <Tooltip />
                              <Bar dataKey="value" fill="#d4a853" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="text-center text-xuan-muted text-sm py-8">日主本身无十神分布</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* DAYUN TAB */}
                {activeTab === 'dayun' && (
                  <motion.div key="dayun" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="space-y-4">
                      {/* DaYun Grid */}
                      {result.analysis.dayun.map((decade: any[], idx: number) => (
                        <div key={idx} className="card-xuan-gold p-4">
                          <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">
                            第{idx + 1}大运（{decade[0].age}-{decade[9].age}岁）
                          </h4>
                          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1">
                            {decade.map((y: any) => (
                              <div key={y.age} className={`text-center p-1.5 rounded text-xs ${y.isGood ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                                <div className="text-xuan-muted">{y.age}岁</div>
                                <div className="font-chinese font-bold text-white">{y.stem}{y.branch}</div>
                                <div className="text-[10px] text-xuan-muted">{y.element}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* LiuNian */}
                      <div className="card-xuan-gold p-4">
                        <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">流年运势（近十年）</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {result.analysis.liunian.map((l: any) => (
                            <div key={l.year} className="text-center p-3 bg-xuan-dark rounded-lg border border-xuan-border">
                              <div className="text-xs text-xuan-muted">{l.year}年</div>
                              <div className="text-lg font-chinese font-bold text-xuan-gold">{l.stem}{l.branch}</div>
                              <div className="text-[10px] text-xuan-cyan">{l.shishen}</div>
                              <div className="text-[10px] text-xuan-muted">{l.element}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
