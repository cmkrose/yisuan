'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';

export default function NamePage() {
  const [form, setForm] = useState({ surname: '', givenName: '', gender: 'male' as 'male' | 'female' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState('');

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

  const wugeOrder = ['tianGe','renGe','diGe','waiGe','zongGe'] as const;

  const genderBtn = (v: typeof form.gender, l: string) => (
    <button type="button" onClick={() => { setForm({ ...form, gender: v }); setResult(null); }}
      className={`flex-1 py-2.5 rounded-lg text-sm border transition-all ${
        form.gender === v ? 'border-xuan-gold bg-xuan-gold/10 text-xuan-gold' : 'border-xuan-border text-xuan-muted hover:border-xuan-gold/30'
      }`}>{l}</button>
  );

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
                <div className="flex gap-2">{genderBtn('male','男')}{genderBtn('female','女')}</div>
              </div>
              {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 font-chinese">{error}</div>}
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="flex-1 btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                  {loading ? '分析中...' : '开始分析'}
                </button>
                <button type="button" onClick={handleSuggest}
                  className="btn-outline-gold px-6 py-4 text-sm font-chinese">改名建议</button>
              </div>
            </form>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="space-y-6">
                {/* Save button */}
                <div className="flex justify-end">
                  <button onClick={handleSave} className="btn-outline-gold px-6 py-2.5 text-sm font-chinese">保存到我的命盘</button>
                </div>

                {/* Score Card */}
                <div className="card-xuan-gold p-6 sm:p-8 text-center">
                  <div className={`text-6xl font-chinese font-bold mb-3 ${
                    result.rating === '大吉' ? 'text-emerald-400' :
                    result.rating === '吉' ? 'text-xuan-gold' :
                    result.rating === '中吉' ? 'text-amber-400' : 'text-red-400'
                  }`}>{result.overallScore}</div>
                  <div className="text-xl font-chinese font-bold text-white mb-1">{result.rating}</div>
                  <div className="text-sm text-xuan-muted font-chinese">{result.fullName} 综合评分</div>
                  <div className="flex justify-center gap-3 mt-4">
                    {result.lucky?.numbers?.map((n: number) => (
                      <span key={n} className="px-3 py-1 text-xs font-chinese bg-xuan-gold/10 text-xuan-gold rounded-full">幸运数字 {n}</span>
                    ))}
                    {result.lucky?.colors?.map((c: string) => (
                      <span key={c} className="px-3 py-1 text-xs font-chinese bg-xuan-gold/10 text-xuan-gold rounded-full">{c}</span>
                    ))}
                  </div>
                </div>

                {/* Five Grids */}
                <div className="card-xuan-gold p-6 sm:p-8">
                  <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-6">五格剖象</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {wugeOrder.map((key) => {
                      const g = result.wuge[key];
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

                {/* Sancai + Wuxing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="card-xuan-gold p-6">
                    <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">三才配置</h3>
                    <div className="flex items-center gap-3 mb-3">
                      {['天','人','地'].map((label, i) => {
                        const el = i === 0 ? result.sancai.heaven : i === 1 ? result.sancai.person : result.sancai.earth;
                        const elColors: Record<string,string> = { 木:'text-emerald-400', 火:'text-red-400', 土:'text-amber-400', 金:'text-yellow-300', 水:'text-cyan-400' };
                        return (
                          <span key={label} className={`px-3 py-2 text-sm font-chinese border rounded-lg ${elColors[el] || 'text-xuan-gold'} border-current/30 bg-current/5`}>
                            {label}:{el}
                          </span>
                        );
                      })}
                    </div>
                    <div className="text-sm font-chinese text-xuan-muted">{result.sancai.config}</div>
                    <div className={`mt-2 text-sm font-chinese ${result.sancai.isAuspicious ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.sancai.meaning}
                    </div>
                  </div>

                  <div className="card-xuan-gold p-6">
                    <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">五行分析</h3>
                    <div className="text-sm font-chinese text-xuan-silver mb-3">{result.wuxingAnalysis.balance}</div>
                    <div className="space-y-1.5">
                      {result.wuxingAnalysis.details.map((d: any) => (
                        <div key={d.grid} className="flex items-center justify-between text-xs font-chinese">
                          <span className="text-xuan-muted">{d.grid}</span>
                          <span className="text-xuan-gold">{d.element}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="card-xuan-gold p-6">
                  <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">分析建议</h3>
                  <div className="space-y-2">
                    {result.suggestions.map((s: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-xuan-gold mt-0.5">•</span>
                        <span className="text-sm font-chinese text-xuan-silver">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name Suggestions */}
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
