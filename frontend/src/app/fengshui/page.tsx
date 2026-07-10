'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';
import { STAR_NAMES } from '@/lib/constants/fengshui';

type TabKey = 'compass' | 'bazhai' | 'feixing' | 'house';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'compass', label: '罗盘', icon: '🧭' },
  { key: 'bazhai', label: '八宅', icon: '宅' },
  { key: 'feixing', label: '飞星', icon: '★' },
  { key: 'house', label: '住宅', icon: '🏠' },
];

const starColors: Record<number, string> = {
  1: 'from-cyan-500/20 border-cyan-500/40 text-cyan-400',
  2: 'from-gray-500/20 border-gray-500/40 text-gray-400',
  3: 'from-emerald-500/20 border-emerald-500/40 text-emerald-400',
  4: 'from-green-500/20 border-green-500/40 text-green-400',
  5: 'from-yellow-500/20 border-yellow-500/40 text-yellow-400',
  6: 'from-slate-400/20 border-slate-400/40 text-slate-300',
  7: 'from-red-500/20 border-red-500/40 text-red-400',
  8: 'from-amber-500/20 border-amber-500/40 text-amber-400',
  9: 'from-purple-500/20 border-purple-500/40 text-purple-400',
};

export default function FengshuiPage() {
  const [tab, setTab] = useState<TabKey>('compass');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [compassData, setCompassData] = useState<any[]>([]);

  useEffect(() => { api.get('/api/fengshui/compass').then(r => setCompassData(r.data.mountains)).catch(() => {}); }, []);

  // Eight Mansion
  const [bazhai, setBazhai] = useState({ birthYear: 1990, gender: 'male' as 'male' | 'female' });
  const runBazhai = async () => { setLoading(true);
    try { const r = await api.post('/api/fengshui/eight-mansion', bazhai); setResult({ type:'bazhai', data: r.data }); }
    catch(e){} finally { setLoading(false); }
  };

  // Flying Stars
  const [fsYear, setFsYear] = useState(new Date().getFullYear());
  const runFeixing = async () => { setLoading(true);
    try { const r = await api.post('/api/fengshui/flying-stars', { year: Number(fsYear) }); setResult({ type:'feixing', data: r.data }); }
    catch(e){} finally { setLoading(false); }
  };

  // House Analysis
  const [house, setHouse] = useState({ year: new Date().getFullYear(), facing: '子' });
  const runHouse = async () => { setLoading(true);
    try { const r = await api.post('/api/fengshui/analyze', { year: Number(house.year), facing: house.facing }); setResult({ type:'house', data: r.data }); }
    catch(e){} finally { setLoading(false); }
  };

  const compassRadius = 140;

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs tracking-[0.3em] text-xuan-jade/70 font-chinese mb-4">风水系统</span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">风水堪舆</h1>
            <p className="text-xuan-muted font-chinese">罗盘 · 八宅 · 飞星 · 住宅分析</p>
          </motion.div>

          {/* Tabs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-4 gap-3 mb-8">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => { setTab(t.key); setResult(null); }}
                className={`p-4 rounded-xl border text-center transition-all ${
                  tab === t.key ? 'border-xuan-jade bg-xuan-jade/10 shadow-lg shadow-xuan-jade/10' : 'card-xuan hover:border-xuan-jade/30'
                }`}>
                <span className="text-2xl sm:text-3xl block mb-1">{t.icon}</span>
                <span className={`text-xs sm:text-sm font-chinese ${tab === t.key ? 'text-xuan-jade' : 'text-xuan-silver'}`}>{t.label}</span>
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {/* ========== COMPASS ========== */}
            {tab === 'compass' && (
              <motion.div key="compass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 flex flex-col items-center">
                  <h3 className="text-xl font-chinese font-bold text-xuan-gold mb-6">数字罗盘</h3>

                  {/* SVG Compass */}
                  <div className="relative" style={{ width: compassRadius * 2 + 60, height: compassRadius * 2 + 60 }}>
                    <svg width={compassRadius * 2 + 60} height={compassRadius * 2 + 60} viewBox={`0 0 ${compassRadius * 2 + 60} ${compassRadius * 2 + 60}`}>
                      <defs>
                        <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                      </defs>
                      <g transform={`translate(${compassRadius + 30}, ${compassRadius + 30})`}>
                        {/* Outer ring */}
                        <circle r={compassRadius + 15} fill="none" stroke="rgba(212,168,83,0.3)" strokeWidth="2" />
                        <circle r={compassRadius + 3} fill="none" stroke="rgba(212,168,83,0.5)" strokeWidth="1.5" />
                        <circle r={compassRadius - 20} fill="none" stroke="rgba(212,168,83,0.2)" strokeWidth="1" />
                        <circle r={compassRadius - 50} fill="rgba(10,10,15,0.9)" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />

                        {/* 24 Mountains */}
                        {compassData.map((m, i) => {
                          const rad = ((i * 15 - 90) * Math.PI) / 180;
                          const x1 = Math.cos(rad) * (compassRadius - 5);
                          const y1 = Math.sin(rad) * (compassRadius - 5);
                          const x2 = Math.cos(rad) * (compassRadius - 25);
                          const y2 = Math.sin(rad) * (compassRadius - 25);
                          const tx = Math.cos(rad) * (compassRadius - 40);
                          const ty = Math.sin(rad) * (compassRadius - 40);
                          const isCardinal = i % 6 === 0;
                          return (
                            <g key={i}>
                              <line x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke={isCardinal ? 'rgba(212,168,83,0.6)' : 'rgba(212,168,83,0.2)'}
                                strokeWidth={isCardinal ? 1.5 : 0.5} />
                              <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central"
                                fill={isCardinal ? '#d4a853' : 'rgba(156,163,175,0.7)'}
                                fontSize={isCardinal ? 11 : 8} fontFamily="serif"
                                transform={`rotate(${i * 15}) translate(0,${isCardinal ? 1 : 0})`}>{m.name}</text>
                            </g>
                          );
                        })}

                        {/* Center */}
                        <circle r={12} fill="rgba(212,168,83,0.1)" stroke="#d4a853" strokeWidth="1" />
                        <text x="0" y="-2" textAnchor="middle" dominantBaseline="central" fill="#d4a853" fontSize="12" fontFamily="serif">☯</text>

                        {/* Cross */}
                        <line x1={0} y1={-compassRadius + 50} x2={0} y2={compassRadius - 50} stroke="rgba(212,168,83,0.1)" strokeWidth="0.5" />
                        <line x1={-compassRadius + 50} y1={0} x2={compassRadius - 50} y2={0} stroke="rgba(212,168,83,0.1)" strokeWidth="0.5" />
                      </g>
                    </svg>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-xuan-muted font-chinese">二十四山罗盘 · 八卦方位 · 五行关系</p>
                    <p className="text-xs text-xuan-muted mt-1">鼠标拖动或触摸可旋转（演示版）</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========== BAZHAI ========== */}
            {tab === 'bazhai' && (
              <motion.div key="bazhai" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">出生年份</label>
                      <select value={bazhai.birthYear} onChange={e => setBazhai({...bazhai, birthYear: Number(e.target.value)})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {Array.from({length:100},(_,i)=>2024-i).map(y=><option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">性别</label>
                      <div className="flex gap-2">
                        {[{v:'male',l:'男'},{v:'female',l:'女'}].map(o=>(
                          <button key={o.v} onClick={()=>setBazhai({...bazhai,gender:o.v as any})}
                            className={`flex-1 py-3 rounded-lg text-sm border ${bazhai.gender===o.v?'border-xuan-jade bg-xuan-jade/10 text-xuan-jade':'border-xuan-border text-xuan-muted hover:border-xuan-jade/30'}`}>{o.l}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={runBazhai} disabled={loading} className="w-full btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                    {loading ? '计算中...' : '计算命卦'}
                  </button>
                </div>

                {result?.type === 'bazhai' && (
                  <div className="space-y-4">
                    <div className="card-xuan-gold p-6 text-center">
                      <div className="text-4xl font-chinese font-bold text-xuan-gold mb-2">{result.data.birthGua}</div>
                      <div className="text-sm text-xuan-muted">命卦 ({result.data.birthElement}) · {result.data.isEastFour ? '东四命' : '西四命'}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="card-xuan p-4 border border-emerald-500/30">
                        <h4 className="text-sm font-chinese font-bold text-emerald-400 mb-3">吉利方位</h4>
                        <div className="space-y-2">
                          {result.data.favorableDirections.map((d: any, i: number) => (
                            <div key={i} className="flex justify-between text-xs font-chinese py-1 border-b border-xuan-border">
                              <span className="text-xuan-gold">{d.direction}({d.shan})</span>
                              <span className="text-emerald-400">{d.rating}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="card-xuan p-4 border border-red-500/30">
                        <h4 className="text-sm font-chinese font-bold text-red-400 mb-3">不利方位</h4>
                        <div className="space-y-2">
                          {result.data.unfavorableDirections.map((d: any, i: number) => (
                            <div key={i} className="flex justify-between text-xs font-chinese py-1 border-b border-xuan-border">
                              <span className="text-xuan-muted">{d.direction}({d.shan})</span>
                              <span className="text-red-400">{d.rating}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ========== FEIXING ========== */}
            {tab === 'feixing' && (
              <motion.div key="feixing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 mb-6">
                  <div className="flex gap-4 mb-4 items-end">
                    <div className="flex-1">
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">年份</label>
                      <select value={fsYear} onChange={e => setFsYear(Number(e.target.value))}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {Array.from({length:30},(_,i)=>2024+i-5).map(y=><option key={y} value={y}>{y}年</option>)}
                      </select>
                    </div>
                    <button onClick={runFeixing} disabled={loading}
                      className="btn-gold px-6 py-3 font-chinese disabled:opacity-50">
                      {loading ? '...' : '推算'}
                    </button>
                  </div>
                </div>

                {result?.type === 'feixing' && (
                  <div className="space-y-4">
                    <div className="card-xuan p-4 flex flex-wrap gap-2 text-sm font-chinese">
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full">{result.data.year}年</span>
                      <span className="px-3 py-1 bg-xuan-gold/10 text-xuan-gold rounded-full">中宫: {STAR_NAMES[result.data.centerStar]?.name || result.data.centerStar}</span>
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full">财位: {result.data.wealthPosition}方</span>
                    </div>

                    {/* 9-Gong Fei Xing Grid */}
                    <div className="card-xuan-gold p-4 sm:p-6">
                      <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4 text-center">九宫飞星</h3>
                      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
                        {result.data.grid.map((g: any, i: number) => {
                          const starInfo = STAR_NAMES[g.star];
                          const colors = starColors[g.star] || '';
                          return (
                            <div key={i} className={`p-3 rounded-lg border bg-gradient-to-br ${colors} text-center`}>
                              <div className="text-xs text-xuan-muted mb-1">{['东南','南','西南','东','中','西','东北','北','西北'][i]}</div>
                              <div className="text-xl font-chinese font-bold text-white">{g.star}</div>
                              <div className="text-[10px] font-chinese mt-0.5">{starInfo?.name || g.name}</div>
                              <div className="text-[9px] font-chinese text-xuan-muted">{starInfo?.element}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ========== HOUSE ========== */}
            {tab === 'house' && (
              <motion.div key="house" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">年份</label>
                      <select value={house.year} onChange={e => setHouse({...house, year: Number(e.target.value)})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {Array.from({length:10},(_,i)=>2024+i).map(y=><option key={y} value={y}>{y}年</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">房屋坐向</label>
                      <select value={house.facing} onChange={e => setHouse({...house, facing: e.target.value})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥','癸','艮','甲','乙','巽','丙','丁','坤','庚','辛','乾','壬'].map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <button onClick={runHouse} disabled={loading} className="w-full btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                    {loading ? '分析中...' : '开始分析'}
                  </button>
                </div>

                {result?.type === 'house' && (
                  <div className="space-y-4">
                    <div className="card-xuan-gold p-4 text-sm font-chinese text-xuan-silver leading-relaxed">{result.data.summary}</div>

                    <div className="card-xuan-gold p-6">
                      <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">🏠 住宅标记</h3>
                      <div className="bg-xuan-dark rounded-lg p-8 text-center border border-xuan-border">
                        <div className="text-4xl mb-3">📍</div>
                        <p className="text-sm font-chinese text-xuan-muted">点击地图标记房屋位置</p>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                          <input type="text" placeholder="经度 (lon)" className="px-3 py-2 bg-xuan-black border border-xuan-border rounded text-white placeholder-xuan-muted text-center" />
                          <input type="text" placeholder="纬度 (lat)" className="px-3 py-2 bg-xuan-black border border-xuan-border rounded text-white placeholder-xuan-muted text-center" />
                        </div>
                        <button className="mt-4 btn-outline-gold px-6 py-2 text-sm font-chinese">标记位置</button>
                      </div>
                    </div>
                  </div>
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
