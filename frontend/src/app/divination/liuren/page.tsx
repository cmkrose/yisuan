'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { sanshiLiuren } from '@/lib/engines/sanshi/calculate';
import { yearRangeDesc } from '@/lib/utils/year';
import { LIUREN_GENERALS, LIUREN_PATTERNS, LIUREN_MONTH_GENERALS } from '@/lib/data/meanings/liuren-meanings';

const defaultForm = () => {
  const n = new Date();
  return { year: n.getFullYear(), month: n.getMonth() + 1, day: n.getDate(), hour: n.getHours() };
};

export default function LiurenPage() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    try {
      setResult(sanshiLiuren(form));
    } catch (e) {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = new Date(form.year, form.month, 0).getDate();
  const patternInfo = result ? LIUREN_PATTERNS[result.pattern] : null;
  const monthGeneralInfo = result ? LIUREN_MONTH_GENERALS[result.monthGeneral?.name] : null;
  const chuanGenerals: string[] = result ? Array.from(new Set((result.chuan || []).map((c: any) => c.general).filter(Boolean))) : [];

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs tracking-[0.3em] text-purple-400/70 font-chinese mb-4">式占预测</span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">大六壬</h1>
            <p className="text-xuan-muted font-chinese">月将加时 · 四课三传 · 九宗门 · 十二天将</p>
          </motion.div>

          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} className="card-xuan-gold p-6 sm:p-8 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="text-xs text-xuan-muted font-chinese mb-1 block">年</label>
                <select value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                  {yearRangeDesc().map((y) => <option key={y} value={y}>{y}年</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-xuan-muted font-chinese mb-1 block">月</label>
                <select value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{m}月</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-xuan-muted font-chinese mb-1 block">日</label>
                <select value={form.day} onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}日</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-xuan-muted font-chinese mb-1 block">时</label>
                <select value={form.hour} onChange={(e) => setForm({ ...form, hour: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
                  {Array.from({ length: 24 }, (_, i) => i).map((h) => <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>)}
                </select>
              </div>
            </div>
            <button onClick={run} disabled={loading} className="w-full btn-gold py-4 text-lg font-chinese disabled:opacity-50">
              {loading ? '推算中...' : '开始起课'}
            </button>
          </motion.div>

          {result && (
            <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="card-xuan-gold p-6">
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-chinese">
                  <span className="px-3 py-1 bg-xuan-gold/10 text-xuan-gold rounded-full">日干支 {result.dayGanZhi}</span>
                  <span className="px-3 py-1 bg-xuan-cyan/10 text-xuan-cyan rounded-full">月将 {result.monthGeneral.name}（{result.monthGeneral.branch}）</span>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full">{result.pattern}</span>
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full">贵人 {result.generalStart.gui}（{result.generalStart.dayNight}）{result.generalStart.forward ? '顺' : '逆'}布</span>
                  <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full">旬空 {result.xunKong.branches.join('、')}</span>
                </div>
                <p className="text-xs text-xuan-muted font-chinese text-center mt-3">{result.interpretation}</p>
              </div>

              <div className="card-xuan-gold p-4 sm:p-6">
                <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4 text-center">天地盘 · 十二天将</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {result.plate.map((cell: any) => (
                    <div key={cell.earth} className="p-2 rounded-lg border border-xuan-border bg-xuan-dark text-center">
                      <div className="text-[10px] text-xuan-muted font-chinese">地盘 {cell.earth}</div>
                      <div className="text-lg font-chinese font-bold text-xuan-gold">{cell.heaven}</div>
                      <div className="text-[11px] font-chinese text-purple-300">{cell.general}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card-xuan-gold p-4">
                  <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">四课</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {result.lessons.map((l: any) => (
                      <div key={l.label} className="p-2 rounded bg-xuan-dark border border-xuan-border text-center">
                        <div className="text-[10px] text-xuan-muted font-chinese">{l.label}</div>
                        <div className="text-sm font-chinese text-xuan-silver">{l.lower} → <span className="text-xuan-gold">{l.upper}</span></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-xuan-gold p-4">
                  <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">三传</h4>
                  <div className="space-y-2">
                    {result.chuan.map((c: any) => (
                      <div key={c.sequence} className="p-2 rounded bg-xuan-dark border border-xuan-cyan/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-xuan-muted font-chinese">{c.sequence}</span>
                          <span className="text-sm font-chinese font-bold text-xuan-cyan">{c.branch}</span>
                          <span className="text-[11px] font-chinese text-xuan-silver">{c.liuqin} · {c.general}</span>
                        </div>
                        {LIUREN_GENERALS[c.general]?.brief && (
                          <div className="text-[10px] text-xuan-muted font-chinese mt-1 leading-snug">{LIUREN_GENERALS[c.general].brief}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card-xuan-gold p-6">
                <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-2">课体 · {result.pattern}</h4>
                {patternInfo ? (
                  <>
                    <div className="text-[11px] font-chinese text-xuan-cyan mb-1">{patternInfo.method} · {patternInfo.nature}</div>
                    <p className="text-sm font-chinese text-xuan-silver leading-relaxed">{patternInfo.brief}</p>
                    <p className="text-xs font-chinese text-xuan-muted leading-relaxed mt-2">{patternInfo.detail}</p>
                  </>
                ) : (
                  <p className="text-xs font-chinese text-xuan-muted">暂无该课体解说。</p>
                )}
              </div>

              <div className="card-xuan-gold p-6">
                <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-2">月将 · {result.monthGeneral.name}</h4>
                {monthGeneralInfo ? (
                  <>
                    <div className="text-[11px] font-chinese text-xuan-cyan mb-1">{monthGeneralInfo.solarTerm} · 乘 {result.monthGeneral.branch}，加 {result.monthGeneral.sitsOn} 时</div>
                    <p className="text-sm font-chinese text-xuan-silver leading-relaxed">{monthGeneralInfo.brief}</p>
                  </>
                ) : (
                  <p className="text-xs font-chinese text-xuan-muted">{result.monthGeneral.name}（{result.monthGeneral.branch}）加 {result.monthGeneral.sitsOn} 时。</p>
                )}
              </div>

              {chuanGenerals.length > 0 && (
                <div className="card-xuan-gold p-6">
                  <h4 className="text-sm font-chinese font-bold text-xuan-gold mb-3">三传天将解说</h4>
                  <div className="space-y-3">
                    {chuanGenerals.map((g) => {
                      const m = LIUREN_GENERALS[g];
                      if (!m) return null;
                      return (
                        <div key={g} className="p-3 bg-xuan-dark rounded-lg border border-xuan-border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-chinese font-bold text-purple-300">{g}</span>
                            <span className="text-[10px] font-chinese text-xuan-muted">{m.element} · {m.nature}</span>
                          </div>
                          <p className="text-xs font-chinese text-xuan-silver leading-relaxed">{m.brief}</p>
                          <p className="text-[11px] font-chinese text-xuan-muted leading-relaxed mt-1">{m.detail}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="text-center text-[10px] text-xuan-muted font-chinese">六壬课盘为算法排盘，解说为模板化解读，仅供参考。</div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
