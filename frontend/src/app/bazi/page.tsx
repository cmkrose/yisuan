'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';
import BaziChart from './BaziChart';
import WuxingChart from './WuxingChart';
import AnalysisReport from './AnalysisReport';

interface BaziFormData {
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  birthPlace: string;
}

const defaultForm: BaziFormData = {
  name: '',
  gender: 'male',
  birthYear: 1990,
  birthMonth: 1,
  birthDay: 1,
  birthHour: 8,
  birthMinute: 0,
  birthPlace: '',
};

export default function BaziPage() {
  const [form, setForm] = useState<BaziFormData>(defaultForm);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/bazi/calculate', {
        name: form.name,
        gender: form.gender,
        birthYear: Number(form.birthYear),
        birthMonth: Number(form.birthMonth),
        birthDay: Number(form.birthDay),
        birthHour: Number(form.birthHour),
        birthPlace: form.birthPlace,
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || '排盘失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) { alert('请先登录后保存'); return; }
    setSaving(true);
    try {
      await api.post('/api/bazi/save', {
        name: form.name,
        gender: form.gender,
        birthYear: Number(form.birthYear),
        birthMonth: Number(form.birthMonth),
        birthDay: Number(form.birthDay),
        birthHour: Number(form.birthHour),
        birthPlace: form.birthPlace,
      });
      alert('命盘已保存到个人中心');
    } catch (err: any) {
      alert(err.response?.data?.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof BaziFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (result) setResult(null);
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const yearOptions = Array.from({ length: 120 }, (_, i) => new Date().getFullYear() - i);

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <span className="inline-block text-xs tracking-[0.3em] text-xuan-gold/70 font-chinese mb-4">
              命理系统
            </span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">
              八字排盘
            </h1>
            <p className="text-xuan-muted font-chinese">
              输入出生信息，精准排出四柱八字，解读命理玄机
            </p>
          </motion.div>

          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card-xuan-gold p-6 sm:p-8 mb-10"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-chinese text-xuan-muted mb-1.5">姓名</label>
                  <input
                    type="text" value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="输入姓名" className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white placeholder-xuan-muted focus:outline-none focus:border-xuan-gold/50" />
                </div>
                <div>
                  <label className="block text-xs font-chinese text-xuan-muted mb-1.5">性别</label>
                  <div className="flex gap-2">
                    {[{ v:'male', l:'男' },{ v:'female', l:'女' }].map((o) => (
                      <button key={o.v} type="button"
                        onClick={() => update('gender', o.v)}
                        className={`flex-1 py-2.5 rounded-lg text-sm border transition-all ${
                          form.gender === o.v ? 'border-xuan-gold bg-xuan-gold/10 text-xuan-gold' : 'border-xuan-border text-xuan-muted hover:border-xuan-gold/30'
                        }`}>{o.l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-chinese text-xuan-muted mb-1.5">出生时间</label>
                  <select value={form.birthHour}
                    onChange={(e) => update('birthHour', Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white focus:outline-none focus:border-xuan-gold/50">
                    {hourOptions.map((h) => (
                      <option key={h} value={h}>{String(h).padStart(2,'0')}:00</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-chinese text-xuan-muted mb-1.5">出生地</label>
                  <input type="text" value={form.birthPlace}
                    onChange={(e) => update('birthPlace', e.target.value)}
                    placeholder="选填" className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white placeholder-xuan-muted focus:outline-none focus:border-xuan-gold/50" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-chinese text-xuan-muted mb-1.5">年</label>
                  <select value={form.birthYear}
                    onChange={(e) => update('birthYear', Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white focus:outline-none focus:border-xuan-gold/50">
                    {yearOptions.map((y) => <option key={y} value={y}>{y}年</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-chinese text-xuan-muted mb-1.5">月</label>
                  <select value={form.birthMonth}
                    onChange={(e) => update('birthMonth', Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white focus:outline-none focus:border-xuan-gold/50">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{m}月</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-chinese text-xuan-muted mb-1.5">日</label>
                  <select value={form.birthDay}
                    onChange={(e) => update('birthDay', Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white focus:outline-none focus:border-xuan-gold/50">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}日</option>)}
                  </select>
                </div>
              </div>

              {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 font-chinese">{error}</div>}

              <button type="submit" disabled={loading}
                className="w-full btn-gold py-4 text-lg font-chinese disabled:opacity-50">
                {loading ? '排盘中...' : '开始排盘'}
              </button>
            </form>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Save Button */}
                <div className="flex justify-end">
                  <button onClick={handleSave} disabled={saving}
                    className="btn-outline-gold px-6 py-2.5 text-sm font-chinese disabled:opacity-50">
                    {saving ? '保存中...' : '保存到我的命盘'}
                  </button>
                </div>

                {/* Bazi Chart */}
                <BaziChart bazi={result.bazi} input={result.input} />

                {/* Wuxing Chart */}
                <WuxingChart analysis={result.analysis} />

                {/* Analysis Report */}
                <AnalysisReport analysis={result.analysis} bazi={result.bazi} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </main>
  );
}
