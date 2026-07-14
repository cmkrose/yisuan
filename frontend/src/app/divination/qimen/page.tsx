'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';

type TabKey = 'qimen' | 'liuren' | 'taiyi';

const tabs: { key: TabKey; label: string; icon: string; desc: string }[] = [
  { key: 'qimen', label: '奇门遁甲', icon: '门', desc: '九宫八门 · 九星八神 · 天地人三盘' },
  { key: 'liuren', label: '大六壬', icon: '壬', desc: '四课三传 · 十二天将 · 六亲' },
  { key: 'taiyi', label: '太乙神数', icon: '乙', desc: '太乙巡宫 · 君基臣基 · 计神' },
];

const directionLabels: Record<string, string> = {
  1:'坎(北)',2:'坤(西南)',3:'震(东)',4:'巽(东南)',5:'中(中)',6:'乾(西北)',7:'兑(西)',8:'艮(东北)',9:'离(南)',
};

const bgForElement: Record<string, string> = {
  水:'from-cyan-900/30 to-blue-900/20 border-cyan-500/40',
  火:'from-red-900/30 to-orange-900/20 border-red-500/40',
  木:'from-emerald-900/30 to-green-900/20 border-emerald-500/40',
  金:'from-yellow-900/30 to-amber-900/20 border-yellow-500/40',
  土:'from-amber-900/30 to-orange-900/20 border-amber-500/40',
};

const purposeOptions = [
  { v: 'career', l: '事业' },
  { v: 'wealth', l: '财运' },
  { v: 'marriage', l: '婚姻' },
  { v: 'health', l: '健康' },
  { v: 'general', l: '综合' },
];

export default function SanshiPage() {
  const [tab, setTab] = useState<TabKey>('qimen');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const [qm, setQm] = useState({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(), hour: now.getHours() });
  const [qmBirth, setQmBirth] = useState({ birthYear: 1990, birthMonth: 1, birthDay: 1, birthHour: 12 });
  const [qmGender, setQmGender] = useState<'male' | 'female'>('male');
  const [qmLocation, setQmLocation] = useState('');
  const [qmPurpose, setQmPurpose] = useState('general');

  const runQimen = async () => { setLoading(true);
    try {
      const r = await api.post('/api/sanshi/qimen', {
        year: Number(qm.year), month: Number(qm.month), day: Number(qm.day), hour: Number(qm.hour),
        birthYear: Number(qmBirth.birthYear), birthMonth: Number(qmBirth.birthMonth),
        birthDay: Number(qmBirth.birthDay), birthHour: Number(qmBirth.birthHour),
        gender: qmGender,
        location: qmLocation,
        purpose: qmPurpose,
      });
      setResult({ type: 'qimen', data: r.data });
    } catch(e){} finally { setLoading(false); }
  };

  const [lr, setLr] = useState({ month: now.getMonth() + 1, hour: now.getHours() });

  const runLiuren = async () => { setLoading(true);
    try { const r = await api.post('/api/sanshi/liuren', { month: Number(lr.month), hour: Number(lr.hour) });
      setResult({ type: 'liuren', data: r.data }); } catch(e){} finally { setLoading(false); }
  };

  const renderQimenPalace = (p: any, idx: number) => {
    const el = p.wuxing;
    const bgClass = bgForElement[el] || 'border-xuan-border';
    return (
      <div key={idx} className={`p-2 sm:p-3 rounded-lg border bg-gradient-to-br ${bgClass} text-center relative overflow-hidden ${
        p.isZhiFu ? 'ring-1 ring-xuan-gold shadow-gold-sm' : ''
      }`}>
        {p.isZhiFu && <div className="absolute top-0 right-0 w-0 h-0 border-l-[12px] border-b-[12px] border-l-transparent border-b-xuan-gold" />}
        <div className="text-[9px] sm:text-[10px] font-chinese text-xuan-muted mb-0.5">{directionLabels[p.number]}</div>
        <div className={`text-lg sm:text-xl font-chinese font-bold mb-0.5 ${p.isZhiFu ? 'text-xuan-gold' : 'text-white'}`}>
          {p.number}
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] sm:text-xs font-chinese text-xuan-gold">{p.men}门</div>
          <div className="text-[9px] sm:text-[10px] font-chinese text-purple-400">{p.xing}</div>
          <div className="text-[9px] sm:text-[10px] font-chinese text-xuan-cyan">{p.shen}</div>
          <div className="flex justify-center gap-1 text-[9px] sm:text-[10px]">
            <span className="text-emerald-400">{p.tianPan}</span>
            <span className="text-xuan-muted">/</span>
            <span className="text-amber-400">{p.diPan}</span>
          </div>
          <div className="text-[8px] font-chinese text-xuan-muted">{p.wuxing}</div>
        </div>
      </div>
    );
  };

  const genOptions = (count: number, suffix: string) =>
    Array.from({ length: count }, (_, i) => i + 1).map((v) => <option key={v} value={v}>{v}{suffix}</option>);

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs tracking-[0.3em] text-purple-400/70 font-chinese mb-4">高级预测</span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">三式预测</h1>
            <p className="text-xuan-muted font-chinese">太乙神数 · 奇门遁甲 · 大六壬 · 古老帝王三式</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3 mb-8">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => { setTab(t.key); setResult(null); }}
                className={`p-4 sm:p-6 rounded-xl border text-center transition-all ${
                  tab === t.key ? 'border-purple-400 bg-purple-500/10 shadow-lg shadow-purple-500/10' :
                  t.key === 'taiyi' ? 'card-xuan opacity-50 cursor-not-allowed' : 'card-xuan hover:border-purple-400/30'
                  }`}>
                <span className="text-3xl sm:text-4xl block mb-2">{t.icon}</span>
                <h3 className={`text-sm sm:text-base font-chinese font-bold mb-1 ${tab === t.key ? 'text-purple-400' : 'text-xuan-silver'}`}>
                  {t.label}
                </h3>
                <p className="text-[10px] sm:text-xs font-chinese text-xuan-muted hidden sm:block">{t.desc}</p>
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {tab === 'qimen' && (
              <motion.div key="qimen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 mb-8">
                  <h3 className="text-sm font-chinese font-bold text-xuan-gold mb-4">排盘时间</h3>
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    <div><label className="text-xs text-xuan-muted font-chinese mb-1 block">年</label>
                      <select value={qm.year} onChange={(e) => setQm({...qm, year: Number(e.target.value)})}
                        className="w-full px-2 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {Array.from({ length: 30 }, (_, i) => 2024 - i + 5).map(y => <option key={y} value={y}>{y}</option>)}
                      </select></div>
                    <div><label className="text-xs text-xuan-muted font-chinese mb-1 block">月</label>
                      <select value={qm.month} onChange={(e) => setQm({...qm, month: Number(e.target.value)})}
                        className="w-full px-2 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">{genOptions(12,'月')}</select></div>
                    <div><label className="text-xs text-xuan-muted font-chinese mb-1 block">日</label>
                      <select value={qm.day} onChange={(e) => setQm({...qm, day: Number(e.target.value)})}
                        className="w-full px-2 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">{genOptions(31,'日')}</select></div>
                    <div><label className="text-xs text-xuan-muted font-chinese mb-1 block">时</label>
                      <select value={qm.hour} onChange={(e) => setQm({...qm, hour: Number(e.target.value)})}
                        className="w-full px-2 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {Array.from({ length: 24 }, (_, i) => i).map(h => <option key={h} value={h}>{String(h).padStart(2,'0')}:00</option>)}
                      </select></div>
                  </div>

                  <h3 className="text-sm font-chinese font-bold text-xuan-gold mb-4">个人信息</h3>
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div><label className="text-xs text-xuan-muted font-chinese mb-1 block">出生年份</label>
                      <select value={qmBirth.birthYear} onChange={(e) => setQmBirth({...qmBirth, birthYear: Number(e.target.value)})}
                        className="w-full px-2 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {Array.from({ length: 101 }, (_, i) => 1924 + i).map(y => <option key={y} value={y}>{y}年</option>)}
                      </select></div>
                    <div><label className="text-xs text-xuan-muted font-chinese mb-1 block">出生月份</label>
                      <select value={qmBirth.birthMonth} onChange={(e) => setQmBirth({...qmBirth, birthMonth: Number(e.target.value)})}
                        className="w-full px-2 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">{genOptions(12,'月')}</select></div>
                    <div><label className="text-xs text-xuan-muted font-chinese mb-1 block">出生日期</label>
                      <select value={qmBirth.birthDay} onChange={(e) => setQmBirth({...qmBirth, birthDay: Number(e.target.value)})}
                        className="w-full px-2 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">{genOptions(31,'日')}</select></div>
                    <div><label className="text-xs text-xuan-muted font-chinese mb-1 block">出生时辰</label>
                      <select value={qmBirth.birthHour} onChange={(e) => setQmBirth({...qmBirth, birthHour: Number(e.target.value)})}
                        className="w-full px-2 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {Array.from({ length: 24 }, (_, i) => i).map(h => <option key={h} value={h}>{String(h).padStart(2,'0')}:00</option>)}
                      </select></div>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs text-xuan-muted font-chinese mb-1 block">性别</label>
                    <div className="flex gap-2">
                      {[{v:'male' as const,l:'男'},{v:'female' as const,l:'女'}].map(o=>(
                        <button key={o.v} onClick={()=>setQmGender(o.v)}
                          className={`flex-1 py-2.5 rounded-lg text-sm border font-chinese ${qmGender===o.v?'border-purple-400 bg-purple-500/10 text-purple-400':'border-xuan-border text-xuan-muted hover:border-purple-400/30'}`}>{o.l}</button>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-sm font-chinese font-bold text-xuan-gold mb-4">预测参数</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">当前地址/方位</label>
                      <input type="text" value={qmLocation} onChange={(e) => setQmLocation(e.target.value)}
                        placeholder="如：北京、东南方"
                        className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white placeholder-xuan-muted" />
                    </div>
                    <div>
                      <label className="text-xs text-xuan-muted font-chinese mb-1 block">预测事项</label>
                      <select value={qmPurpose} onChange={(e) => setQmPurpose(e.target.value)}
                        className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {purposeOptions.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                      </select>
                    </div>
                  </div>

                  <button onClick={runQimen} disabled={loading}
                    className="w-full btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                    {loading ? '排盘中...' : '开始排盘'}
                  </button>
                </div>

                {result?.type === 'qimen' && (
                  <div className="space-y-4">
                    <div className="card-xuan p-4 flex flex-wrap gap-3 text-sm font-chinese">
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full">
                        {result.data.yangDun ? '阳遁' : '阴遁'}{result.data.juShu}局
                      </span>
                      <span className="px-3 py-1 bg-xuan-gold/10 text-xuan-gold rounded-full">{result.data.yuan}</span>
                      <span className="px-3 py-1 bg-xuan-dark text-xuan-muted rounded-full border border-xuan-border">
                        {result.data.timeInfo.year}年{result.data.timeInfo.month}月{result.data.timeInfo.day}日 {result.data.timeInfo.shiChen}时
                      </span>
                    </div>

                    <div className="card-xuan-gold p-4 sm:p-6">
                      <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4 text-center">奇门九宫格</h3>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg mx-auto">
                        {result.data.palaces.map((p: any, i: number) => renderQimenPalace(p, i))}
                      </div>
                    </div>

                    <div className="card-xuan p-4">
                      <div className="flex flex-wrap gap-3 text-xs font-chinese">
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-xuan-gold/30" /><span className="text-xuan-gold">八门</span></div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-500/30" /><span className="text-purple-400">九星</span></div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-xuan-cyan/30" /><span className="text-xuan-cyan">八神</span></div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/30" /><span className="text-emerald-400">天盘</span></div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/30" /><span className="text-amber-400">地盘</span></div>
                      </div>
                    </div>

                    {result.data.analysis && (
                      <div className="card-xuan-gold p-4 sm:p-6 mt-4">
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

            {tab === 'liuren' && (
              <motion.div key="liuren" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card-xuan-gold p-6 sm:p-8 mb-8">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs text-xuan-muted font-chinese mb-1 block">月份</label>
                      <select value={lr.month} onChange={(e) => setLr({...lr, month: Number(e.target.value)})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">{genOptions(12,'月')}</select></div>
                    <div><label className="text-xs text-xuan-muted font-chinese mb-1 block">时辰</label>
                      <select value={lr.hour} onChange={(e) => setLr({...lr, hour: Number(e.target.value)})}
                        className="w-full px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                        {Array.from({ length: 24 }, (_, i) => i).map(h => <option key={h} value={h}>{String(h).padStart(2,'0')}:00</option>)}
                      </select></div>
                  </div>
                  <button onClick={runLiuren} disabled={loading}
                    className="w-full btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                    {loading ? '推算中...' : '开始推算'}
                  </button>
                </div>

                {result?.type === 'liuren' && (
                  <div className="space-y-6">
                    <div className="card-xuan-gold p-6">
                      <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">四课</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {result.data.lessons.map((les: any, i: number) => (
                          <div key={i} className="p-3 bg-xuan-dark rounded-lg border border-xuan-border text-center">
                            <div className="text-xs text-xuan-muted mb-1">{les.position}</div>
                            <div className="text-lg font-chinese font-bold text-white">{les.stem}{les.branch}</div>
                            <div className="text-xs text-xuan-gold">{les.element}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-4 text-xs font-chinese">
                        <span className="px-2 py-1 bg-xuan-gold/10 text-xuan-gold rounded">月将: {result.data.monthGeneral}</span>
                        <span className="px-2 py-1 bg-xuan-cyan/10 text-xuan-cyan rounded">时: {result.data.hourGeneral}</span>
                      </div>
                    </div>

                    <div className="card-xuan-gold p-6">
                      <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">三传</h3>
                      <div className="flex items-center gap-2 mb-4">
                        {result.data.chuan.map((c: any, i: number) => (
                          <React.Fragment key={i}>
                            <div className="flex-1 p-3 bg-xuan-dark rounded-lg border border-xuan-cyan/30 text-center">
                              <div className="text-xs text-xuan-muted mb-1">{c.sequence}</div>
                              <div className="text-base font-chinese font-bold text-xuan-cyan">{c.stem}{c.branch}</div>
                              <div className="text-xs text-xuan-muted">{c.name}</div>
                            </div>
                            {i < 2 && <span className="text-xuan-gold text-xl">→</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="card-xuan-gold p-6">
                      <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">十二天将</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {result.data.twelveGenerals.map((g: any, i: number) => (
                          <div key={i} className="p-2 bg-xuan-dark rounded border border-xuan-border text-center">
                            <div className="text-[10px] font-chinese text-xuan-gold mb-0.5">{g.name}</div>
                            <div className="text-xs text-xuan-silver">{g.branch}</div>
                            <div className="text-[9px] text-xuan-muted">{g.direction}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card-xuan-gold p-4 text-sm font-chinese text-xuan-silver leading-relaxed">
                      {result.data.interpretation}
                    </div>

                    {result.data.analysis && (
                      <div className="card-xuan-gold p-4 mt-3">
                        <h4 className="text-base font-chinese font-bold text-xuan-gold mb-3">详细分析</h4>
                        <div className="text-sm font-chinese text-xuan-silver leading-relaxed whitespace-pre-wrap">
                          {result.data.analysis}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'taiyi' && (
              <motion.div key="taiyi" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="card-xuan-gold p-12 text-center">
                  <div className="text-6xl font-chinese font-bold text-xuan-muted mb-4">太乙</div>
                  <h3 className="text-xl font-chinese font-bold text-xuan-gold mb-2">太乙神数</h3>
                  <p className="text-xuan-muted font-chinese">太乙巡宫 · 君基臣基 · 计神 · 文昌 · 始击</p>
                  <div className="mt-6 p-4 bg-xuan-dark rounded-lg inline-block">
                    <span className="text-sm text-xuan-muted font-chinese">模块开发中，敬请期待...</span>
                  </div>
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
