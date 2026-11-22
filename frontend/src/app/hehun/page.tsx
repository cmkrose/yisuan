'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { calculateHehun } from '@/lib/engines/hehun';
import { yearRangeDesc } from '@/lib/utils/year';

interface Person {
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
}

const initialA: Person = { name: '男方', gender: 'male', birthYear: 1990, birthMonth: 5, birthDay: 15, birthHour: 10 };
const initialB: Person = { name: '女方', gender: 'female', birthYear: 1992, birthMonth: 8, birthDay: 20, birthHour: 12 };

function PersonForm({ title, value, onChange }: { title: string; value: Person; onChange: (p: Person) => void }) {
  const set = (patch: Partial<Person>) => onChange({ ...value, ...patch });
  return (
    <div className="card-xuan-gold p-5 sm:p-6">
      <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="col-span-2 sm:col-span-3">
          <label className="text-xs text-xuan-muted font-chinese mb-1 block">姓名</label>
          <input type="text" value={value.name} onChange={(e) => set({ name: e.target.value })}
            className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white" />
        </div>
        <div>
          <label className="text-xs text-xuan-muted font-chinese mb-1 block">性别</label>
          <select value={value.gender} onChange={(e) => set({ gender: e.target.value as 'male' | 'female' })}
            className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-xuan-muted font-chinese mb-1 block">年</label>
          <select value={value.birthYear} onChange={(e) => set({ birthYear: Number(e.target.value) })}
            className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
            {yearRangeDesc().map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-xuan-muted font-chinese mb-1 block">月</label>
          <select value={value.birthMonth} onChange={(e) => set({ birthMonth: Number(e.target.value) })}
            className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{m}月</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-xuan-muted font-chinese mb-1 block">日</label>
          <select value={value.birthDay} onChange={(e) => set({ birthDay: Number(e.target.value) })}
            className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}日</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-xuan-muted font-chinese mb-1 block">时</label>
          <select value={value.birthHour} onChange={(e) => set({ birthHour: Number(e.target.value) })}
            className="w-full px-3 py-2.5 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white">
            {Array.from({ length: 24 }, (_, i) => i).map((h) => <option key={h} value={h}>{h}时</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function HehunPage() {
  const [a, setA] = useState<Person>(initialA);
  const [b, setB] = useState<Person>(initialB);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const run = () => {
    setError('');
    try {
      setResult(calculateHehun(a as any, b as any));
    } catch (e: any) {
      setError('分析失败：' + (e?.message || '未知错误'));
    }
  };

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block text-xs tracking-[0.3em] text-xuan-gold/70 font-chinese mb-3">八字合婚</span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-3">双人合婚分析</h1>
            <p className="text-xuan-muted font-chinese">按日主生克、夫妻宫合冲、五行与喜用互补、生肖关系分项加权，结果仅供参考</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <PersonForm title="甲方" value={a} onChange={setA} />
            <PersonForm title="乙方" value={b} onChange={setB} />
          </div>

          <button onClick={run} className="w-full btn-gold py-4 text-lg font-chinese mb-8">开始合婚</button>
          {error && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 font-chinese">{error}</div>}

          {result && (
            <div className="space-y-6">
              <div className="card-xuan-gold p-6 text-center">
                <div className="text-5xl font-chinese font-bold text-gradient-gold mb-2">{result.totalScore}</div>
                <div className="text-xuan-gold font-chinese text-lg mb-2">{result.verdict}</div>
                <p className="text-sm text-xuan-silver font-chinese leading-relaxed">{result.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[result.a, result.b].map((p: any, i: number) => (
                  <div key={i} className="card-xuan p-4 text-sm font-chinese text-xuan-silver">
                    <div className="text-xuan-gold font-bold mb-1">{p.name}（{p.gender === 'male' ? '男' : '女'}）</div>
                    <div>四柱：{p.pillars}</div>
                    <div>日主：{p.dayMaster}（{p.element}）· {p.strength}</div>
                    <div>喜用：{p.favorable.join('、')}</div>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-chinese font-bold text-xuan-gold">分项明细（五项加权）</h3>
              <div className="space-y-3">
                {result.dimensions.map((d: any) => (
                  <div key={d.key} className="card-xuan p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-chinese font-bold text-xuan-gold">{d.name}（权重{Math.round(d.weight * 100)}%）</span>
                      <span className="text-sm font-chinese text-xuan-cyan">{d.relation} · {d.score}分</span>
                    </div>
                    <div className="h-2 bg-xuan-dark rounded-full overflow-hidden mb-2">
                      <div className="h-full rounded-full" style={{ width: `${d.score}%`, backgroundColor: d.score >= 80 ? '#22c55e' : d.score >= 60 ? '#eab308' : '#ef4444' }} />
                    </div>
                    <p className="text-xs text-xuan-muted font-chinese leading-relaxed">{d.detail}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-xuan-muted font-chinese text-center">注：合婚结论基于固定规则表加权，不同流派口径有别，仅供参考，不构成决策依据。</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
