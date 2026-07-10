'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';

type Purpose = 'wedding' | 'business' | 'moving' | 'construction';

const purposes: { key: Purpose; label: string; icon: string; desc: string }[] = [
  { key: 'wedding', label: '婚嫁择日', icon: '婚', desc: '嫁娶 纳采 订婚' },
  { key: 'business', label: '开业择日', icon: '开', desc: '开业 开市 交易' },
  { key: 'moving', label: '搬家择日', icon: '迁', desc: '入宅 迁徙 移徙' },
  { key: 'construction', label: '动土择日', icon: '动', desc: '动土 修造 起基' },
];

const weekNames = ['日','一','二','三','四','五','六'];

export default function ZeriPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [purpose, setPurpose] = useState<Purpose>('wedding');
  const [days, setDays] = useState<any[]>([]);
  const [selectedDays, setSelectedDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'calendar' | 'select'>('calendar');

  const loadCalendar = async () => {
    setLoading(true);
    try {
      const r = await api.post('/api/zeri/calendar', { year, month });
      setDays(r.data);
    } catch(e){} finally { setLoading(false); }
  };

  const loadSelect = async () => {
    setLoading(true);
    try {
      const r = await api.post('/api/zeri/select', { year, month, purpose });
      setSelectedDays(r.data);
    } catch(e){} finally { setLoading(false); }
  };

  useEffect(() => { loadCalendar(); }, [year, month]);
  useEffect(() => { if (mode === 'select') loadSelect(); }, [year, month, purpose, mode]);

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonth = () => { if (month === 1) { setYear(year-1); setMonth(12); } else setMonth(month-1); };
  const nextMonth = () => { if (month === 12) { setYear(year+1); setMonth(1); } else setMonth(month+1); };

  const renderCalendarGrid = () => {
    const selectedSet = new Set(selectedDays.map(d => d.date));
    const cells: React.ReactNode[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} className="h-10"/>);
    for (let d = 0; d < Math.min(daysInMonth, days.length); d++) {
      const dayInfo = days[d];
      const isSelected = selectedSet.has(dayInfo.date);
      const isHuangdao = dayInfo.isHuangdao;
      const isToday = dayInfo.date === `${year}-${String(month).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
      cells.push(
        <div key={dayInfo.date}
          className={`h-10 sm:h-12 rounded text-center text-xs sm:text-sm flex flex-col items-center justify-center cursor-pointer border transition-all ${
            isToday ? 'ring-1 ring-xuan-gold' : ''
          } ${
            isSelected ? 'bg-xuan-gold/20 border-xuan-gold text-xuan-gold font-bold' :
            isHuangdao ? 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50' :
            'bg-red-500/5 border-xuan-border hover:border-red-500/30'
          }`}
          title={`${dayInfo.jianchu} ${dayInfo.dayType} ${dayInfo.ershiba}`}>
          <span className="text-xs">{d + 1}</span>
          <span className={`text-[8px] leading-tight ${isHuangdao ? 'text-emerald-400' : 'text-red-400'}`}>
            {dayInfo.jianchu}
          </span>
        </div>
      );
    }
    return cells;
  };

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs tracking-[0.3em] text-xuan-red/70 font-chinese mb-4">择日系统</span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">黄道择日</h1>
            <p className="text-xuan-muted font-chinese">黄道吉日 · 建除十二神 · 二十八宿 · 冲煞宜忌</p>
          </motion.div>

          {/* Mode Switch */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setMode('calendar')}
              className={`flex-1 py-3 text-sm font-chinese rounded-lg border transition-all ${mode==='calendar'?'border-xuan-gold bg-xuan-gold/10 text-xuan-gold':'card-xuan text-xuan-muted hover:border-xuan-gold/30'}`}>
              月历视图
            </button>
            <button onClick={() => setMode('select')}
              className={`flex-1 py-3 text-sm font-chinese rounded-lg border transition-all ${mode==='select'?'border-xuan-gold bg-xuan-gold/10 text-xuan-gold':'card-xuan text-xuan-muted hover:border-xuan-gold/30'}`}>
              择日推荐
            </button>
          </div>

          {/* Purpose Selector (in select mode) */}
          {mode === 'select' && (
            <div className="grid grid-cols-4 gap-2 mb-6">
              {purposes.map((p) => (
                <button key={p.key} onClick={() => setPurpose(p.key)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    purpose === p.key ? 'border-xuan-red bg-xuan-red/10 shadow-lg' : 'card-xuan hover:border-xuan-red/30'
                  }`}>
                  <span className="text-xl block mb-1">{p.icon}</span>
                  <span className={`text-xs font-chinese ${purpose===p.key?'text-xuan-red':'text-xuan-silver'}`}>{p.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="px-3 py-1.5 text-sm font-chinese text-xuan-gold border border-xuan-gold/30 rounded hover:bg-xuan-gold/10">◀ 上月</button>
            <div className="text-lg font-chinese font-bold text-xuan-gold">{year}年{month}月</div>
            <button onClick={nextMonth} className="px-3 py-1.5 text-sm font-chinese text-xuan-gold border border-xuan-gold/30 rounded hover:bg-xuan-gold/10">下月 ▶</button>
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 mb-1">
            {weekNames.map((w) => (
              <div key={w} className="text-center text-xs font-chinese text-xuan-muted py-1">{w}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <motion.div key={`${year}-${month}-${mode}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-7 gap-0.5 sm:gap-1 card-xuan-gold p-3 sm:p-4">
            {renderCalendarGrid()}
          </motion.div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 text-xs font-chinese">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-500/40" /><span className="text-emerald-400">黄道吉日</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-500/30" /><span className="text-red-400">黑道日</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded ring-1 ring-xuan-gold" /><span className="text-xuan-gold">今日</span>
            </div>
          </div>

          {/* Selected Days List */}
          {mode === 'select' && selectedDays.length > 0 && (
            <div className="mt-8 card-xuan-gold p-6">
              <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">
                {purposes.find(p=>p.key===purpose)?.label} · {selectedDays.length}个吉日
              </h3>
              <div className="space-y-3">
                {selectedDays.slice(0, 10).map((d: any) => (
                  <div key={d.date} className="flex items-center justify-between p-3 bg-xuan-dark rounded-lg border border-emerald-500/20">
                    <div>
                      <span className="text-sm font-chinese font-bold text-xuan-gold">{d.date}</span>
                      <span className="text-xs text-xuan-muted ml-2">{d.dayStem}{d.dayBranch}日</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-chinese">
                      <span className="text-emerald-400">{d.jianchu}</span>
                      <span className="text-xuan-cyan">{d.ershiba}</span>
                      <span className="text-red-400">冲{d.chongAnimal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Yi Ji Legend */}
          <div className="mt-6 card-xuan p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-chinese">
              {purposes.map((p) => (
                <div key={p.key} className="text-center">
                  <span className="text-xuan-gold font-bold">{p.label}</span>
                  <div className="mt-1 space-y-0.5">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-emerald-400">宜:</span>
                      <span className="text-xuan-silver">{
                        p.key==='wedding'?'嫁娶纳采':p.key==='business'?'开业开市':p.key==='moving'?'入宅迁徙':'动土修造'
                      }</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-red-400">忌:</span>
                      <span className="text-xuan-muted">{
                        p.key==='wedding'?'破土安葬':p.key==='business'?'嫁娶入宅':p.key==='moving'?'出行远游':'安床祈福'
                      }</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
