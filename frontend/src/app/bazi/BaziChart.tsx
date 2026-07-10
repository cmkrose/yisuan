'use client';

import React from 'react';
import { motion } from 'framer-motion';

const elementColors: Record<string, string> = {
  木: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
  火: 'bg-red-500/20 border-red-500/40 text-red-400',
  土: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
  金: 'bg-yellow-300/20 border-yellow-300/40 text-yellow-300',
  水: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
};

export default function BaziChart({ bazi, input }: { bazi: any; input: any }) {
  const pillars = [
    { label: '年柱', key: 'year', data: bazi.year },
    { label: '月柱', key: 'month', data: bazi.month },
    { label: '日柱', key: 'day', data: bazi.day },
    { label: '时柱', key: 'hour', data: bazi.hour },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-xuan-gold p-6 sm:p-8"
    >
      <h2 className="text-xl font-chinese font-bold text-xuan-gold mb-6 flex items-center gap-2">
        <span>☯</span> 八字命盘
      </h2>

      {/* Info Badge */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 text-xs font-chinese bg-xuan-gold/10 text-xuan-gold rounded-full">
          {input.name || '未命名'}
        </span>
        <span className="px-3 py-1 text-xs font-chinese bg-xuan-dark text-xuan-silver border border-xuan-border rounded-full">
          {input.gender === 'male' ? '男' : '女'}
        </span>
        <span className="px-3 py-1 text-xs font-chinese bg-xuan-dark text-xuan-silver border border-xuan-border rounded-full">
          {input.birthYear}年{input.birthMonth}月{input.birthDay}日 {input.birthHourName}
        </span>
        <span className="px-3 py-1 text-xs font-chinese bg-xuan-dark text-xuan-gold border border-xuan-gold/30 rounded-full">
          日主：{bazi.dayMaster}({bazi.dayMasterElement})
        </span>
      </div>

      {/* Four Pillars Grid */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {pillars.map((pillar) => (
          <div key={pillar.key}>
            <div className="text-center text-xs font-chinese text-xuan-muted mb-2">
              {pillar.label}
            </div>
            <div className="space-y-2">
              {/* Stem */}
              <div className={`p-3 rounded-lg border text-center transition-all ${
                elementColors[pillar.data.stemElement] || 'border-xuan-border'
              }`}>
                <div className="text-2xl sm:text-3xl font-chinese font-bold mb-0.5">
                  {pillar.data.stem}
                </div>
                <div className="text-[10px] font-chinese">
                  {pillar.data.stemYinYang}{pillar.data.stemElement}
                </div>
              </div>
              {/* Branch */}
              <div className={`p-3 rounded-lg border text-center transition-all ${
                elementColors[pillar.data.branchElement] || 'border-xuan-border'
              }`}>
                <div className="text-2xl sm:text-3xl font-chinese font-bold mb-0.5">
                  {pillar.data.branch}
                </div>
                <div className="text-[10px] font-chinese">
                  {pillar.data.branchYinYang}{pillar.data.branchElement}
                </div>
              </div>
              {/* ShiShen */}
              <div className="text-center">
                <span className="inline-block px-2 py-0.5 text-[10px] font-chinese rounded bg-xuan-gold/10 text-xuan-gold">
                  {pillar.data.shishen}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nayin & CangGan */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-chinese">
        {pillars.map((pillar) => (
          <div key={`n-${pillar.key}`} className="p-3 bg-xuan-dark rounded-lg border border-xuan-border">
            <div className="text-xuan-muted mb-1">纳音/藏干</div>
            <div className="text-xuan-gold">{pillar.data.nayin}</div>
            <div className="text-xuan-silver mt-1">
              {pillar.data.cangGan.map((cg: any) => cg.stem).join(' ')}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
