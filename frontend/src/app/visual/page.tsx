'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';

export default function VisualAnalysisPage() {
  const [tab, setTab] = useState<'face'|'palm'>('face');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'face' ? '/api/visual/face' : '/api/visual/palm';
      const res = await api.post(endpoint);
      setResult(res.data);
    } catch(e){} finally { setLoading(false); }
  };

  const renderFaceReport = (r: any) => (
    <div className="space-y-5">
      {/* Score */}
      <div className="card-xuan-gold p-6 text-center">
        <div className={`text-5xl font-chinese font-bold ${r.overallScore >= 85 ? 'text-emerald-400' : r.overallScore >= 70 ? 'text-xuan-gold' : 'text-amber-400'}`}>
          {r.overallScore}
        </div>
        <div className="text-sm text-xuan-muted font-chinese mt-2">综合面相评分</div>
        <div className="text-xs text-xuan-muted mt-1">{r.faceShape.name} | {r.faceShape.fortune}</div>
      </div>

      {/* Face Shape + Overall */}
      <div className="card-xuan p-4 text-sm font-chinese text-xuan-silver leading-relaxed bg-gradient-to-r from-xuan-gold/5 to-transparent border border-xuan-gold/20">
        <span className="text-xuan-gold font-bold">总论：</span>{r.overallFortune}
      </div>

      {/* Five Features Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { key:'forehead', icon:'额', label:'天庭', d:r.forehead },
          { key:'eyebrows', icon:'眉', label:'眉毛', d:r.eyebrows },
          { key:'eyes', icon:'眼', label:'眼睛', d:r.eyes },
          { key:'nose', icon:'鼻', label:'鼻子', d:r.nose },
          { key:'mouth', icon:'口', label:'嘴巴', d:r.mouth },
          { key:'ears', icon:'耳', label:'耳朵', d:r.ears },
        ].map(({ key, icon, label, d }) => (
          <div key={key} className="card-xuan p-3 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-sm font-chinese font-bold text-xuan-gold">{d.name}</div>
            <div className="text-[10px] text-xuan-muted mt-1">{d.desc}</div>
            <div className={`text-xs font-chinese mt-1 ${d.score >= 85 ? 'text-emerald-400' : d.score >= 70 ? 'text-xuan-gold' : 'text-amber-400'}`}>
              {d.score}分
            </div>
          </div>
        ))}
      </div>

      {/* Chin */}
      <div className="card-xuan p-3 text-center">
        <div className="text-sm font-chinese text-xuan-gold">下巴 - {r.chin.name}</div>
        <div className="text-xs text-xuan-muted">{r.chin.desc}</div>
      </div>

      {/* 12 Palaces */}
      <div className="card-xuan-gold p-4">
        <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4 text-center">面相十二宫</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {r.twelvePalaces.map((p: any, i: number) => (
            <div key={i} className="p-2 bg-xuan-dark rounded border border-xuan-border text-center">
              <div className="text-xs font-chinese text-xuan-gold font-bold">{p.name}</div>
              <div className="text-[9px] text-xuan-muted">{p.position}</div>
              <div className={`text-[10px] font-chinese ${p.score >= 80 ? 'text-emerald-400' : p.score >= 65 ? 'text-xuan-gold' : 'text-amber-400'}`}>
                {p.score}分
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fortunes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label:'事业运势', val:r.careerFortune, color:'text-purple-400', bg:'bg-purple-500/5', border:'border-purple-500/20' },
          { label:'财富运势', val:r.wealthFortune, color:'text-amber-400', bg:'bg-amber-500/5', border:'border-amber-500/20' },
          { label:'感情运势', val:r.loveFortune, color:'text-rose-400', bg:'bg-rose-500/5', border:'border-rose-500/20' },
        ].map((c) => (
          <div key={c.label} className={`p-4 rounded-lg border ${c.bg} ${c.border}`}>
            <div className={`text-sm font-chinese font-bold ${c.color} mb-2`}>{c.label}</div>
            <p className="text-xs text-xuan-silver font-chinese">{c.val}</p>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <div className="card-xuan p-4">
        <div className="text-sm font-chinese text-xuan-gold mb-2">💡 改善建议</div>
        <div className="space-y-1.5">
          {r.suggestions.map((s: string, i: number) => (
            <div key={i} className="text-xs text-xuan-silver font-chinese flex items-start gap-2">
              <span className="text-xuan-gold">{i+1}.</span> {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPalmReport = (r: any) => (
    <div className="space-y-5">
      <div className="card-xuan-gold p-6 text-center">
        <div className={`text-5xl font-chinese font-bold ${r.overallScore >= 80 ? 'text-emerald-400' : r.overallScore >= 65 ? 'text-xuan-gold' : 'text-amber-400'}`}>
          {r.overallScore}
        </div>
        <div className="text-sm text-xuan-muted font-chinese mt-2">综合手相评分</div>
      </div>

      <div className="card-xuan p-4 text-sm font-chinese text-xuan-silver leading-relaxed bg-gradient-to-r from-xuan-gold/5 to-transparent border border-xuan-gold/20">
        <span className="text-xuan-gold font-bold">总论：</span>{r.overallFortune}
      </div>

      {/* Four Main Lines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key:'life', icon:'❤️', label:'生命线', d:r.lifeLine, extra:r.lifeLine.ageHint },
          { key:'wisdom', icon:'🧠', label:'智慧线', d:r.wisdomLine, extra:r.wisdomLine.traits },
          { key:'emotion', icon:'💕', label:'感情线', d:r.emotionLine, extra:r.emotionLine.relationship },
          { key:'career', icon:'💼', label:'事业线', d:r.careerLine, extra:r.careerLine.direction },
        ].map(({ key, icon, label, d, extra }) => (
          <div key={key} className="card-xuan p-4 border hover:border-xuan-gold/30 transition-all">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{icon}</span>
              <div className="flex-1">
                <div className="text-sm font-chinese font-bold text-xuan-gold mb-1">{label}</div>
                <div className="text-xs text-white font-chinese">{d.name}</div>
                <div className="text-[10px] text-xuan-muted mb-2">{d.desc}</div>
                <div className={`inline-block px-2 py-0.5 text-[10px] font-chinese rounded-full ${d.quality==='优秀'||d.quality==='良好'?'bg-emerald-500/10 text-emerald-400':d.quality==='普通'||d.quality==='理性'?'bg-xuan-gold/10 text-xuan-gold':'bg-amber-500/10 text-amber-400'}`}>
                  {d.quality} · {d.score}分
                </div>
                <div className="mt-2 text-[10px] text-xuan-muted font-chinese italic">{extra}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Marriage + Success */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-xuan p-4 text-center">
          <div className="text-xs text-xuan-muted font-chinese mb-1">婚姻线</div>
          <div className="text-base font-chinese font-bold text-xuan-gold">{r.marriageLine.count}条</div>
          <div className="text-xs text-xuan-muted">{r.marriageLine.desc}</div>
        </div>
        <div className="card-xuan p-4 text-center">
          <div className="text-xs text-xuan-muted font-chinese mb-1">成功线</div>
          <div className="text-base font-chinese font-bold text-xuan-gold">{r.successLine.quality}</div>
          <div className="text-xs text-xuan-muted">{r.successLine.desc}</div>
        </div>
      </div>

      {/* 7 Mounts */}
      <div className="card-xuan-gold p-4">
        <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4 text-center">掌丘分析</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {r.mounts.map((m: any, i: number) => (
            <div key={i} className="p-2 bg-xuan-dark rounded border border-xuan-border text-center">
              <div className="text-xs font-chinese text-xuan-gold font-bold">{m.name}</div>
              <div className="text-[10px] text-xuan-muted">{m.quality}</div>
              <div className="text-[9px] text-xuan-muted mt-0.5">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-xuan p-4">
        <div className="text-sm font-chinese text-xuan-gold mb-2">💡 改善建议</div>
        <div className="space-y-1.5">
          {r.suggestions.map((s: string, i: number) => (
            <div key={i} className="text-xs text-xuan-silver font-chinese flex items-start gap-2">
              <span className="text-xuan-gold">{i+1}.</span> {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs tracking-[0.3em] text-rose-400/70 font-chinese mb-4">AI视觉分析</span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">面相手相</h1>
            <p className="text-xuan-muted font-chinese">上传照片，AI为您解读面相十二宫与手相纹路</p>
            <p className="text-xs text-xuan-muted font-chinese mt-2 italic">* 本功能为传统文化娱乐工具，分析结果仅供消遣参考</p>
          </motion.div>

          {/* Tab */}
          <div className="flex gap-2 mb-6">
            {[
              { key:'face', label:'面相分析', icon:'😊' },
              { key:'palm', label:'手相分析', icon:'🖐' },
            ].map((t) => (
              <button key={t.key} onClick={() => { setTab(t.key as any); setResult(null); }}
                className={`flex-1 py-4 rounded-xl border text-center transition-all ${
                  tab === t.key ? 'border-rose-400 bg-rose-500/10 shadow-lg shadow-rose-500/10' : 'card-xuan hover:border-rose-400/30'
                }`}>
                <span className="text-3xl block mb-1">{t.icon}</span>
                <span className={`text-sm font-chinese ${tab===t.key?'text-rose-400':'text-xuan-silver'}`}>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Upload */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="card-xuan-gold p-6 sm:p-8 mb-8 text-center">
            <div className="mb-6">
              {image ? (
                <div className="relative inline-block">
                  <img src={image} alt="uploaded" className="max-h-48 rounded-lg border border-xuan-gold/30" />
                  <button onClick={() => setImage(null)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-xuan-dark/80 text-xs text-xuan-silver">✕</button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="inline-flex flex-col items-center p-8 border-2 border-dashed border-xuan-gold/30 rounded-xl hover:border-xuan-gold/60 transition-colors">
                    <span className="text-5xl mb-3">📸</span>
                    <span className="text-sm font-chinese text-xuan-gold mb-1">点击上传照片</span>
                    <span className="text-xs text-xuan-muted">支持 JPG/PNG，{tab==='face'?'建议正面清晰面部照片':'建议掌纹清晰照片'}</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
              )}
            </div>
            <button onClick={runAnalysis} disabled={loading}
              className="btn-gold px-10 py-4 text-lg font-chinese disabled:opacity-50">
              {loading ? 'AI分析中...' : `开始${tab==='face'?'面相':'手相'}分析`}
            </button>
            <p className="text-xs text-xuan-muted font-chinese mt-4">
              * 分析基于传统{tab==='face'?'面相学':'手相学'}理论，采用传统规则引擎分析
            </p>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
                {tab === 'face' ? renderFaceReport(result) : renderPalmReport(result)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </main>
  );
}
