'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';
import { fengshuiCompass, fengshuiEightMansion, fengshuiFlyingStars, fengshuiYangHouse, fengshuiYinHouse } from '@/lib/engines/fengshui/calculate';
import { yearRangeDesc } from '@/lib/utils/year';
import { STAR_NAMES } from '@/lib/constants/fengshui';
import { ER_SHI_SI_SHAN } from '@/lib/engines/fengshui/constants';
import { BAZHAI_STARS, FEIXING_STARS, YANGZHAI_HOUSES, YINZHAI_TOPICS } from '@/lib/data/meanings/fengshui-meanings';

type TabKey = 'compass' | 'bazhai' | 'feixing' | 'yanghouse' | 'yinhouse';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'compass', label: '罗盘', icon: '🧭' },
  { key: 'bazhai', label: '八宅', icon: '宅' },
  { key: 'feixing', label: '飞星', icon: '★' },
  { key: 'yanghouse', label: '阳宅', icon: '☀' },
  { key: 'yinhouse', label: '阴宅', icon: '🌙' },
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

  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startAngleRef = useRef(0);
  const startRotationRef = useRef(0);
  const compassContainerRef = useRef<HTMLDivElement>(null);

  const [followMode, setFollowMode] = useState(false);
  const [followSupported, setFollowSupported] = useState(true);
  const [followMsg, setFollowMsg] = useState('');
  const followHeadingRef = useRef(0);

  useEffect(() => { try { const data: any = fengshuiCompass(); setCompassData(data?.mountains); } catch {} }, []);

  useEffect(() => {
    setFollowSupported(typeof window !== 'undefined' && 'DeviceOrientationEvent' in window);
  }, []);

  useEffect(() => {
    if (!followMode) return;
    const handler = (e: DeviceOrientationEvent) => {
      const anyE = e as any;
      let target: number | null = null;
      if (typeof anyE.webkitCompassHeading === 'number') target = anyE.webkitCompassHeading;
      else if (typeof e.alpha === 'number') target = (360 - e.alpha + 360) % 360;
      if (target === null) return;
      const prev = followHeadingRef.current;
      const delta = ((target - prev + 540) % 360) - 180;
      const next = (prev + delta * 0.2 + 360) % 360;
      followHeadingRef.current = next;
      rotationRef.current = next;
      setRotation(next);
    };
    window.addEventListener('deviceorientation', handler);
    return () => window.removeEventListener('deviceorientation', handler);
  }, [followMode]);

  const calcAngle = (clientX: number, clientY: number) => {
    const container = compassContainerRef.current;
    if (!container) return 0;
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  };

  const handleCompassPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (followMode) return;
    isDraggingRef.current = true;
    startAngleRef.current = calcAngle(e.clientX, e.clientY);
    startRotationRef.current = rotationRef.current;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    e.preventDefault();
  };

  const handleCompassPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || followMode) return;
    let delta = calcAngle(e.clientX, e.clientY) - startAngleRef.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const newRotation = ((startRotationRef.current + delta) % 360 + 360) % 360;
    rotationRef.current = newRotation;
    setRotation(newRotation);
  };

  const endCompassDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  };

  const toggleFollow = async () => {
    if (followMode) { setFollowMode(false); setFollowMsg('已停止跟随'); return; }
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) {
      setFollowSupported(false); setFollowMsg('当前设备不支持方向感应'); return;
    }
    try {
      const anyDOE = DeviceOrientationEvent as any;
      if (typeof anyDOE.requestPermission === 'function') {
        const res = await anyDOE.requestPermission();
        if (res !== 'granted') { setFollowMsg('未获得方向权限'); return; }
      }
    } catch { setFollowMsg('方向权限申请失败'); return; }
    followHeadingRef.current = rotationRef.current;
    setFollowMsg('');
    setFollowMode(true);
  };

  const [bazhai, setBazhai] = useState({ birthYear: 1990, gender: 'male' as 'male' | 'female' });
  const runBazhai = async () => { setLoading(true);
    try { const data = fengshuiEightMansion(bazhai); setResult({ type:'bazhai', data }); }
    catch(e){} finally { setLoading(false); }
  };

  const [fsYear, setFsYear] = useState(new Date().getFullYear());
  const runFeixing = async () => { setLoading(true);
    try { const data = fengshuiFlyingStars({ year: Number(fsYear) }); setResult({ type:'feixing', data }); }
    catch(e){} finally { setLoading(false); }
  };

  const [yangHouse, setYangHouse] = useState({ facing: '子', year: new Date().getFullYear() });
  const runYangHouse = async () => { setLoading(true);
    try { const data = fengshuiYangHouse({ facing: yangHouse.facing, year: Number(yangHouse.year) }); setResult({ type:'yanghouse', data }); }
    catch(e){} finally { setLoading(false); }
  };

  const [yinHouse, setYinHouse] = useState({ location: '山区', direction: '坐北朝南' });
  const runYinHouse = async () => { setLoading(true);
    try { const data = fengshuiYinHouse({ location: yinHouse.location, direction: yinHouse.direction }); setResult({ type:'yinhouse', data }); }
    catch(e){} finally { setLoading(false); }
  };

  const compassRadius = 140;
  const topMountainIndex = compassData.length ? Math.round(((360 - (rotation % 360)) % 360) / 15) % 24 : 0;

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs tracking-[0.3em] text-xuan-jade/70 font-chinese mb-4">风水系统</span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">风水堪舆</h1>
            <p className="text-xuan-muted font-chinese">罗盘 · 八宅 · 飞星 · 阳宅 · 阴宅</p>
          </motion.div>

          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-5 gap-3 mb-8">
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
            {tab === 'compass' && (
              <motion.div key="compass" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 flex flex-col items-center">
                  <h3 className="text-xl font-chinese font-bold text-xuan-gold mb-6">二十四山罗盘</h3>
                  <div
                    ref={compassContainerRef}
                    onPointerDown={handleCompassPointerDown}
                    onPointerMove={handleCompassPointerMove}
                    onPointerUp={endCompassDrag}
                    onPointerCancel={endCompassDrag}
                    className={`relative select-none ${followMode ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
                    style={{ width: compassRadius * 2 + 60, height: compassRadius * 2 + 60, touchAction: 'none' }}
                  >
                    <svg width={compassRadius * 2 + 60} height={compassRadius * 2 + 60} viewBox={`0 0 ${compassRadius * 2 + 60} ${compassRadius * 2 + 60}`} style={{ pointerEvents: 'none' }}>
                      <defs><filter id="glow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
                      <g transform={`translate(${compassRadius + 30}, 16)`}>
                        <polygon points="-12,0 12,0 0,18" fill="#d4a853" filter="url(#glow)" />
                        <line x1="-30" y1="18" x2="30" y2="18" stroke="#d4a853" strokeWidth="1.5" />
                      </g>
                      <g transform={`translate(${compassRadius + 30}, ${compassRadius + 30}) rotate(${rotation})`}>
                        <circle r={compassRadius + 15} fill="none" stroke="rgba(212,168,83,0.3)" strokeWidth="2" />
                        <circle r={compassRadius + 3} fill="none" stroke="rgba(212,168,83,0.5)" strokeWidth="1.5" />
                        <circle r={compassRadius - 20} fill="none" stroke="rgba(212,168,83,0.2)" strokeWidth="1" />
                        <circle r={compassRadius - 50} fill="rgba(10,10,15,0.9)" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
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
                              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isCardinal ? 'rgba(212,168,83,0.6)' : 'rgba(212,168,83,0.2)'} strokeWidth={isCardinal ? 1.5 : 0.5} />
                              <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central" fill={isCardinal ? '#d4a853' : 'rgba(156,163,175,0.7)'} fontSize={isCardinal ? 11 : 8} fontFamily="serif">{m.name}</text>
                            </g>
                          );
                        })}
                        <circle r={12} fill="rgba(212,168,83,0.1)" stroke="#d4a853" strokeWidth="1" />
                        <text x="0" y="-2" textAnchor="middle" dominantBaseline="central" fill="#d4a853" fontSize="12" fontFamily="serif">☯</text>
                        <line x1={0} y1={-compassRadius + 50} x2={0} y2={compassRadius - 50} stroke="rgba(212,168,83,0.1)" strokeWidth="0.5" />
                        <line x1={-compassRadius + 50} y1={0} x2={compassRadius - 50} y2={0} stroke="rgba(212,168,83,0.1)" strokeWidth="0.5" />
                      </g>
                    </svg>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-2xl font-chinese font-bold text-xuan-gold">
                      {Math.round(rotation)}° · {compassData[topMountainIndex]?.name ?? '—'}山
                    </div>
                    <div className="text-xs text-xuan-muted font-chinese">
                      {compassData[topMountainIndex]?.element ?? '—'} · 拖动罗盘调整朝向
                    </div>
                    <div className="mt-3 flex flex-col items-center gap-1">
                      <button type="button" onClick={toggleFollow} disabled={!followSupported}
                        className={`px-4 py-2 rounded-lg text-sm border font-chinese transition-all ${followMode ? 'border-xuan-jade bg-xuan-jade/10 text-xuan-jade' : 'border-xuan-border text-xuan-silver hover:border-xuan-jade/30'} ${!followSupported ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {followMode ? '停止跟随' : '跟随方向'}
                      </button>
                      <div className="text-[11px] font-chinese text-xuan-muted">
                        {!followSupported ? '当前设备不支持方向感应' : followMsg || (followMode ? '跟随设备方向中（已暂停拖动）' : '拖动罗盘或开启方向跟随')}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 w-full max-w-lg">
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
                      {compassData.map((m, i) => (
                        <div key={i} className="text-center p-1.5 bg-xuan-dark rounded border border-xuan-border">
                          <div className="text-xs font-chinese text-xuan-gold">{m.name}</div>
                          <div className="text-[10px] text-xuan-muted">{m.element}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === 'bazhai' && (
              <motion.div key="bazhai" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">出生年份</label>
                      <select value={bazhai.birthYear} onChange={e => setBazhai({...bazhai, birthYear: Number(e.target.value)})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {yearRangeDesc().map(y=><option key={y} value={y}>{y}</option>)}
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
                      <div className="text-[10px] text-xuan-muted mt-2">游星解说为模板化解读，仅供参考。</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="card-xuan p-4 border border-emerald-500/30">
                        <h4 className="text-sm font-chinese font-bold text-emerald-400 mb-3">吉利方位</h4>
                        <div className="space-y-2">
                          {result.data.favorableDirections.map((d: any, i: number) => {
                            const m = BAZHAI_STARS[String(d.rating).replace(/\(.*\)$/, '')];
                            return (
                              <div key={i} title={m ? `${m.detail}\n布局：${m.layout}` : ''} className="py-2 border-b border-xuan-border">
                                <div className="flex justify-between text-xs font-chinese">
                                  <span className="text-xuan-gold">{d.direction}({d.shan})</span>
                                  <span className="text-emerald-400">{d.rating}</span>
                                </div>
                                {m && <div className="text-[10px] text-xuan-muted mt-1 leading-snug">{m.brief}</div>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="card-xuan p-4 border border-red-500/30">
                        <h4 className="text-sm font-chinese font-bold text-red-400 mb-3">不利方位</h4>
                        <div className="space-y-2">
                          {result.data.unfavorableDirections.map((d: any, i: number) => {
                            const m = BAZHAI_STARS[String(d.rating).replace(/\(.*\)$/, '')];
                            return (
                              <div key={i} title={m ? `${m.detail}\n布局：${m.layout}` : ''} className="py-2 border-b border-xuan-border">
                                <div className="flex justify-between text-xs font-chinese">
                                  <span className="text-xuan-muted">{d.direction}({d.shan})</span>
                                  <span className="text-red-400">{d.rating}</span>
                                </div>
                                {m && <div className="text-[10px] text-xuan-muted mt-1 leading-snug">{m.brief}</div>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    {result.data.analysis && (
                      <div className="card-xuan-gold p-6">
                        <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">详细分析</h3>
                        <div className="text-sm font-chinese text-xuan-silver leading-relaxed whitespace-pre-wrap">
                          {result.data.analysis}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'feixing' && (
              <motion.div key="feixing" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 mb-6">
                  <div className="flex gap-4 mb-4 items-end">
                    <div className="flex-1">
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">年份</label>
                      <select value={fsYear} onChange={e => setFsYear(Number(e.target.value))}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {yearRangeDesc().map(y=><option key={y} value={y}>{y}年</option>)}
                      </select>
                    </div>
                    <button onClick={runFeixing} disabled={loading} className="btn-gold px-6 py-3 font-chinese disabled:opacity-50">
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
                    {(() => {
                      const cm = FEIXING_STARS[(STAR_NAMES[result.data.centerStar]?.name || '').slice(0, 2)];
                      return cm ? (
                        <div className="card-xuan p-3 text-xs font-chinese text-xuan-silver leading-relaxed">
                          中宫点评：{cm.nature}｜{cm.brief}
                        </div>
                      ) : null;
                    })()}
                    <div className="card-xuan-gold p-4 sm:p-6">
                      <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4 text-center">九宫飞星</h3>
                      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
                        {result.data.grid.map((g: any, i: number) => {
                          const starInfo = STAR_NAMES[g.star];
                          const colors = starColors[g.star] || '';
                          const m = FEIXING_STARS[(starInfo?.name || g.name || '').slice(0, 2)];
                          return (
                            <div key={i} title={m ? `${m.nature}｜${m.detail}` : ''} className={`p-3 rounded-lg border bg-gradient-to-br ${colors} text-center`}>
                              <div className="text-xs text-xuan-muted mb-1">{['东南','南','西南','东','中','西','东北','北','西北'][i]}</div>
                              <div className="text-xl font-chinese font-bold text-white">{g.star}</div>
                              <div className="text-[10px] font-chinese mt-0.5">{starInfo?.name || g.name}</div>
                              <div className="text-[9px] font-chinese text-xuan-muted">{starInfo?.element}</div>
                              {(g.note || starInfo?.note) && <div className="text-[9px] font-chinese text-xuan-gold/80 mt-0.5">{g.note || starInfo?.note}</div>}
                              {m && <div className="text-[9px] font-chinese text-xuan-muted mt-0.5 leading-snug">{m.brief}</div>}
                              {m && <div className="text-[9px] font-chinese text-xuan-gold/80 mt-0.5">{m.nature}</div>}
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 text-[10px] text-xuan-muted font-chinese text-center">飞星解说为模板化解读，仅供参考。</div>
                    </div>
                    {result.data.analysis && (
                      <div className="card-xuan-gold p-6">
                        <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">详细分析</h3>
                        <div className="text-sm font-chinese text-xuan-silver leading-relaxed whitespace-pre-wrap">
                          {result.data.analysis}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'yanghouse' && (
              <motion.div key="yanghouse" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">房屋坐向</label>
                      <select value={yangHouse.facing} onChange={e => setYangHouse({...yangHouse, facing: e.target.value})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {ER_SHI_SI_SHAN.map(s=><option key={s} value={s}>{s}山</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">入住年份</label>
                      <select value={yangHouse.year} onChange={e => setYangHouse({...yangHouse, year: Number(e.target.value)})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {yearRangeDesc().map(y=><option key={y} value={y}>{y}年</option>)}
                      </select>
                    </div>
                  </div>
                  <button onClick={runYangHouse} disabled={loading} className="w-full btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                    {loading ? '分析中...' : '开始阳宅分析'}
                  </button>
                </div>
                {result?.type === 'yanghouse' && (
                  <div className="space-y-4">
                    <div className="card-xuan-gold p-6">
                      <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">阳宅风水分析</h3>
                      <div className="text-sm font-chinese text-xuan-silver leading-relaxed whitespace-pre-wrap">
                        {result.data.summary}
                      </div>
                    </div>
                    {result.data.sittingGua && (() => {
                      const gua = result.data.sittingGua;
                      const h = YANGZHAI_HOUSES[gua];
                      const baz = result.data.bazhai;
                      return (
                        <>
                          <div className="card-xuan-gold p-6">
                            <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">宅型：{gua}宅（{h?.group || '—'}）</h4>
                            {h && <>
                              <p className="text-sm font-chinese text-xuan-silver leading-relaxed">{h.brief}</p>
                              <p className="text-xs font-chinese text-xuan-silver leading-relaxed mt-2">{h.detail}</p>
                              <p className="text-xs font-chinese text-xuan-muted leading-relaxed mt-2">门主灶三要：{h.tips}</p>
                            </>}
                          </div>
                          {baz && (
                            <div className="card-xuan p-4">
                              <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">八方游星（按{gua}宅）</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[...baz.favorableDirections, ...baz.unfavorableDirections].map((d: any, i: number) => {
                                  const m = BAZHAI_STARS[String(d.rating).replace(/\(.*\)$/, '')];
                                  return (
                                    <div key={i} title={m ? `${m.detail}\n布局：${m.layout}` : ''} className="p-2 bg-xuan-dark rounded border border-xuan-border">
                                      <div className="flex justify-between text-xs font-chinese">
                                        <span className="text-xuan-silver">{d.direction}({d.shan})</span>
                                        <span className={String(d.rating).includes('吉') ? 'text-emerald-400' : 'text-red-400'}>{d.rating}</span>
                                      </div>
                                      {m && <div className="text-[10px] text-xuan-muted mt-1 leading-snug">{m.brief}</div>}
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-3 text-[10px] text-xuan-muted font-chinese text-center">阳宅与游星解说为模板化解读，仅供参考。</div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                    {result.data.keyPoints && (
                      <div className="card-xuan p-4">
                        <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">装修建议要点</h4>
                        <div className="space-y-2">
                          {result.data.keyPoints.map((kp: string, i: number) => (
                            <div key={i} className="text-xs font-chinese text-xuan-silver bg-xuan-dark p-3 rounded border border-xuan-border">• {kp}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'yinhouse' && (
              <motion.div key="yinhouse" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">地形类型</label>
                      <select value={yinHouse.location} onChange={e => setYinHouse({...yinHouse, location: e.target.value})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {[{v:'山区',l:'山区'},{v:'平原',l:'平原'},{v:'水边',l:'水边'}].map(l=><option key={l.v} value={l.v}>{l.l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">坐向</label>
                      <select value={yinHouse.direction} onChange={e => setYinHouse({...yinHouse, direction: e.target.value})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {['坐北朝南','坐南朝北','坐东朝西','坐西朝东','坐西北朝东南','坐西南朝东北','坐东北朝西南','坐东南朝西北'].map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <button onClick={runYinHouse} disabled={loading} className="w-full btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                    {loading ? '分析中...' : '开始阴宅分析'}
                  </button>
                </div>
                {result?.type === 'yinhouse' && (
                  <div className="space-y-4">
                    <div className="card-xuan-gold p-6">
                      <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">阴宅风水分析</h3>
                      <div className="text-sm font-chinese text-xuan-silver leading-relaxed whitespace-pre-wrap">
                        {result.data.summary}
                      </div>
                    </div>
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-chinese text-amber-300">
                      原则性解读，不能替代实地勘测。
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['龙','穴','砂','水','向','明堂','水口'].map((k) => {
                        const t = YINZHAI_TOPICS[k];
                        if (!t) return null;
                        return (
                          <div key={k} className="card-xuan p-4">
                            <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-2">{k}</h4>
                            <p className="text-xs font-chinese text-xuan-silver leading-relaxed">{t.brief}</p>
                            <p className="text-[11px] font-chinese text-xuan-silver leading-relaxed mt-1">{t.detail}</p>
                            <p className="text-[10px] font-chinese text-xuan-muted leading-relaxed mt-2">评判要点：{t.keyPoints}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-[10px] text-xuan-muted font-chinese text-center">以上为原则性、模板化解读，仅供参考，不能替代实地勘测。</div>
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
