'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';

type TabKey = 'liuyao' | 'meihua' | 'xiaoliuren';

const tabs: { key: TabKey; label: string; icon: string; desc: string }[] = [
  { key: 'liuyao', label: '六爻纳甲', icon: '爻', desc: '铜钱起卦 · 六十四卦 · 六亲六神' },
  { key: 'meihua', label: '梅花易数', icon: '梅', desc: '时间起卦 · 数字起卦 · 体用分析' },
  { key: 'xiaoliuren', label: '小六壬', icon: '☯', desc: '掌诀推算 · 大安留连 · 速喜赤口' },
];

export default function DivinationPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('liuyao');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Six Yao
  const castLiuyao = async () => { setLoading(true);
    const res = await api.post('/api/divination/liuyao'); setResult({ type:'liuyao', data: res.data }); setLoading(false); };

  // Meihua
  const [meihuaMethod, setMeihuaMethod] = useState<'time' | 'number' | 'name'>('time');
  const [meihuaNums, setMeihuaNums] = useState('1,2,3');
  const [meihuaName, setMeihuaName] = useState('');

  const castMeihua = async () => {
    setLoading(true);
    try {
      let res;
      if (meihuaMethod === 'time') res = await api.post('/api/divination/meihua/time');
      else if (meihuaMethod === 'number') {
        const nums = meihuaNums.split(',').map(Number).filter(n => !isNaN(n));
        res = await api.post('/api/divination/meihua/number', { numbers: nums });
      } else {
        res = await api.post('/api/divination/meihua/name', { name: meihuaName || '易' });
      }
      setResult({ type: 'meihua', data: res.data });
    } catch (e) {} finally { setLoading(false); }
  };

  // Xiao Liu Ren
  const [xlrMode, setXlrMode] = useState<'time' | 'random'>('time');
  const [xlrMonth, setXlrMonth] = useState(new Date().getMonth() + 1);
  const [xlrDay, setXlrDay] = useState(new Date().getDate());
  const [xlrHour, setXlrHour] = useState(new Date().getHours());

  const castXiaoliuren = async () => {
    setLoading(true);
    try {
      let res;
      if (xlrMode === 'time') res = await api.post('/api/divination/xiaoliuren', { month: xlrMonth, day: xlrDay, hour: xlrHour });
      else res = await api.post('/api/divination/xiaoliuren/random');
      setResult({ type: 'xiaoliuren', data: res.data });
    } catch (e) {} finally { setLoading(false); }
  };

  const elementColors: Record<string, { bg: string; border: string; text: string }> = {
    大安: { bg:'bg-emerald-500/5', border:'border-emerald-500/30', text:'text-emerald-400' },
    留连: { bg:'bg-amber-500/5', border:'border-amber-500/30', text:'text-amber-400' },
    速喜: { bg:'bg-red-500/5', border:'border-red-500/30', text:'text-red-400' },
    赤口: { bg:'bg-orange-500/5', border:'border-orange-500/30', text:'text-orange-400' },
    小吉: { bg:'bg-green-500/5', border:'border-green-500/30', text:'text-green-400' },
    空亡: { bg:'bg-gray-500/5', border:'border-gray-500/30', text:'text-gray-400' },
  };

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs tracking-[0.3em] text-xuan-cyan/70 font-chinese mb-4">占卜系统</span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">传统占卜</h1>
            <p className="text-xuan-muted font-chinese">古老占卜技艺，为您揭示未来趋势</p>
          </motion.div>

          {/* Tab Selector */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3 mb-8">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key); setResult(null); }}
                className={`p-4 sm:p-6 rounded-xl border text-center transition-all ${
                  activeTab === tab.key
                    ? 'border-xuan-cyan bg-xuan-cyan/10 shadow-lg shadow-xuan-cyan/10'
                    : 'card-xuan hover:border-xuan-cyan/30'
                }`}>
                <span className="text-3xl sm:text-4xl block mb-2">{tab.icon}</span>
                <h3 className={`text-sm sm:text-base font-chinese font-bold mb-1 ${activeTab === tab.key ? 'text-xuan-cyan' : 'text-xuan-silver'}`}>
                  {tab.label}
                </h3>
                <p className="text-[10px] sm:text-xs font-chinese text-xuan-muted hidden sm:block">{tab.desc}</p>
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {/* ========== LIUYAO ========== */}
            {activeTab === 'liuyao' && (
              <motion.div key="liuyao" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 text-center">
                  <div className="text-6xl font-chinese mb-4">☰</div>
                  <h3 className="text-xl font-chinese font-bold text-xuan-gold mb-2">六爻纳甲起卦</h3>
                  <p className="text-sm text-xuan-muted font-chinese mb-6">心中默念所问之事，点击起卦</p>
                  <button onClick={castLiuyao} disabled={loading}
                    className="btn-gold px-10 py-4 text-lg font-chinese disabled:opacity-50">
                    {loading ? '起卦中...' : '开始起卦'}
                  </button>
                </div>

                {result?.type === 'liuyao' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-6 card-xuan-gold p-6">
                    <div className="text-center mb-4">
                      <span className="text-4xl font-chinese">{result.data.symbol}</span>
                      <h3 className="text-xl font-chinese font-bold text-xuan-gold mt-2">{result.data.hexagramName}</h3>
                      <p className="text-sm text-xuan-muted">{result.data.meaning}</p>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      {result.data.lines.map((l: any, i: number) => {
                        const isMoving = l.moving;
                        const isYang = l.value === 1;
                        return (
                          <div key={i} className={`flex items-center gap-3 p-2 rounded ${isMoving ? 'bg-xuan-gold/10' : ''}`}>
                            <span className="text-xs text-xuan-muted w-6 text-center">{6 - i}</span>
                            <span className={`text-lg font-chinese ${isYang ? 'text-white' : 'text-xuan-muted'}`}>
                              {isYang ? '━━━━━' : '━━ ═━'}
                            </span>
                            {isMoving && <span className="text-xs text-xuan-gold">动</span>}
                            <span className="text-xs text-xuan-muted ml-auto">{l.liuqin}</span>
                            <span className="text-[10px] text-xuan-muted">{['初','二','三','四','五','上'][i]}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-chinese">
                      <span className="px-2 py-1 bg-xuan-gold/10 text-xuan-gold rounded">世爻: 第{result.data.shiyao}爻</span>
                      <span className="px-2 py-1 bg-xuan-cyan/10 text-xuan-cyan rounded">应爻: 第{result.data.yingyao}爻</span>
                      {result.data.liushen?.map((s: string) => (
                        <span key={s} className="px-2 py-1 bg-xuan-dark text-xuan-muted border border-xuan-border rounded">{s}</span>
                      ))}
                    </div>
                    {result.data.changedHexagram && (
                      <div className="mt-4 p-3 bg-xuan-dark rounded text-center">
                        <span className="text-sm text-xuan-muted">变卦 → </span>
                        <span className="text-lg font-chinese text-xuan-cyan">{result.data.changedHexagram.symbol}</span>
                        <span className="text-sm font-chinese text-xuan-gold ml-1">{result.data.changedHexagram.name}</span>
                      </div>
                    )}
                    <div className="mt-4 p-4 bg-xuan-dark rounded-lg text-sm font-chinese text-xuan-silver leading-relaxed">
                      {result.data.interpretation}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ========== MEIHUA ========== */}
            {activeTab === 'meihua' && (
              <motion.div key="meihua" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8">
                  <div className="flex gap-2 mb-6">
                    {[{ v:'time',l:'时间起卦' },{ v:'number',l:'数字起卦' },{ v:'name',l:'姓名起卦' }].map((m) => (
                      <button key={m.v} onClick={() => setMeihuaMethod(m.v as any)}
                        className={`flex-1 py-2.5 text-sm font-chinese rounded-lg border transition-all ${
                          meihuaMethod === m.v ? 'border-xuan-cyan bg-xuan-cyan/10 text-xuan-cyan' : 'border-xuan-border text-xuan-muted hover:border-xuan-cyan/30'
                        }`}>{m.l}</button>
                    ))}
                  </div>
                  {meihuaMethod === 'number' && (
                    <div className="mb-4">
                      <label className="block text-xs font-chinese text-xuan-muted mb-1.5">输入3个数字（逗号分隔）</label>
                      <input type="text" value={meihuaNums} onChange={(e) => setMeihuaNums(e.target.value)}
                        className="w-full px-4 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-white text-sm focus:border-xuan-cyan/50" />
                    </div>
                  )}
                  {meihuaMethod === 'name' && (
                    <div className="mb-4">
                      <label className="block text-xs font-chinese text-xuan-muted mb-1.5">输入汉字</label>
                      <input type="text" value={meihuaName} onChange={(e) => setMeihuaName(e.target.value)} placeholder="输入任意汉字"
                        className="w-full px-4 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-white text-sm focus:border-xuan-cyan/50" />
                    </div>
                  )}
                  <button onClick={castMeihua} disabled={loading}
                    className="w-full btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                    {loading ? '起卦中...' : '开始起卦'}
                  </button>
                </div>

                {result?.type === 'meihua' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-4">
                    <div className="card-xuan-gold p-6 text-center">
                      <span className="text-4xl font-chinese block mb-2">{result.data.symbol}</span>
                      <h3 className="text-xl font-chinese font-bold text-xuan-gold">{result.data.hexagramName}</h3>
                      <p className="text-xs text-xuan-muted mt-1">动爻: 第{result.data.movingYao}爻 · {result.data.method}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="card-xuan p-4 text-center">
                        <div className="text-xs text-xuan-muted mb-1">上卦（用）</div>
                        <div className="text-lg font-chinese font-bold text-xuan-cyan">{result.data.upperGua.name}</div>
                        <div className="text-xs text-xuan-muted">{result.data.upperGua.element}</div>
                      </div>
                      <div className="card-xuan p-4 text-center">
                        <div className="text-xs text-xuan-muted mb-1">下卦（体）</div>
                        <div className="text-lg font-chinese font-bold text-xuan-gold">{result.data.lowerGua.name}</div>
                        <div className="text-xs text-xuan-muted">{result.data.lowerGua.element}</div>
                      </div>
                    </div>
                    <div className={`card-xuan p-4 text-center border ${
                      result.data.bodyYongRelation === '比和' || result.data.bodyYongRelation === '受生' ? 'border-emerald-500/40' :
                      result.data.bodyYongRelation === '受克' ? 'border-red-500/40' : 'border-amber-500/40'
                    }`}>
                      <span className="text-sm font-chinese text-xuan-muted">体用关系: </span>
                      <span className="text-lg font-chinese font-bold text-xuan-gold">{result.data.bodyYongRelation}</span>
                    </div>
                    <div className="card-xuan-gold p-4 text-sm font-chinese text-xuan-silver leading-relaxed">
                      {result.data.interpretation}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ========== XIAOLIUREN ========== */}
            {activeTab === 'xiaoliuren' && (
              <motion.div key="xiaoliuren" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8">
                  <div className="flex gap-2 mb-6">
                    {[{ v:'time',l:'时辰推算' },{ v:'random',l:'随机占卜' }].map((m) => (
                      <button key={m.v} onClick={() => setXlrMode(m.v as any)}
                        className={`flex-1 py-2.5 text-sm font-chinese rounded-lg border transition-all ${
                          xlrMode === m.v ? 'border-xuan-cyan bg-xuan-cyan/10 text-xuan-cyan' : 'border-xuan-border text-xuan-muted hover:border-xuan-cyan/30'
                        }`}>{m.l}</button>
                    ))}
                  </div>
                  {xlrMode === 'time' && (
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <label className="block text-xs font-chinese text-xuan-muted mb-1">月</label>
                        <select value={xlrMonth} onChange={(e) => setXlrMonth(Number(e.target.value))}
                          className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                          {Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}月</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-chinese text-xuan-muted mb-1">日</label>
                        <select value={xlrDay} onChange={(e) => setXlrDay(Number(e.target.value))}
                          className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                          {Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}日</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-chinese text-xuan-muted mb-1">时</label>
                        <select value={xlrHour} onChange={(e) => setXlrHour(Number(e.target.value))}
                          className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                          {Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{h}时</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                  <button onClick={castXiaoliuren} disabled={loading}
                    className="w-full btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                    {loading ? '推算中...' : '开始推算'}
                  </button>
                </div>

                {result?.type === 'xiaoliuren' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-4">
                    {/* 6 Positions */}
                    <div className="grid grid-cols-6 gap-1.5">
                      {['大安','留连','速喜','赤口','小吉','空亡'].map((pos) => {
                        const colors = elementColors[pos] || elementColors['大安'];
                        const isActive = result.data.name === pos;
                        return (
                          <div key={pos} className={`p-3 rounded-lg border text-center transition-all ${
                            isActive ? `${colors.border} ${colors.bg} scale-105 shadow-lg` : 'border-xuan-border opacity-50'
                          }`}>
                            <div className={`text-xs sm:text-sm font-chinese font-bold ${isActive ? colors.text : 'text-xuan-muted'}`}>
                              {pos}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className={`card-xuan p-6 text-center border-2 ${elementColors[result.data.name]?.border || 'border-xuan-cyan/40'} ${elementColors[result.data.name]?.bg || ''}`}>
                      <div className={`text-5xl font-chinese font-bold mb-3 ${elementColors[result.data.name]?.text || 'text-xuan-cyan'}`}>
                        {result.data.name}
                      </div>
                      <div className="text-xl font-chinese font-bold text-white mb-2">{result.data.fortune}</div>
                      <div className="text-sm font-chinese text-xuan-silver mb-4">{result.data.direction}</div>
                      <div className="p-4 bg-xuan-dark rounded-lg text-sm font-chinese text-xuan-silver leading-relaxed mb-3">
                        {result.data.meaning}
                      </div>
                      <div className="text-sm font-chinese text-xuan-gold italic">
                        "{result.data.suggestion}"
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </main>
  );
}
