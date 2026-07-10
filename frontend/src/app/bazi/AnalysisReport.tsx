'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AnalysisReport({ analysis, bazi }: { analysis: any; bazi: any }) {
  const { dayMasterAnalysis, pattern, dayun, liunian, summary } = analysis;
  const [cycleIdx, setCycleIdx] = useState(0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-xuan-gold p-6 sm:p-8"
      >
        <h2 className="text-xl font-chinese font-bold text-xuan-gold mb-4 flex items-center gap-2">
          <span>📋</span> 分析综述
        </h2>
        <p className="text-sm sm:text-base text-xuan-silver font-chinese leading-relaxed">{summary}</p>
      </motion.div>

      {/* Day Master + Pattern + Gods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {/* Pattern */}
        <div className="card-xuan-gold p-6">
          <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">格局判断</h3>
          <div className="text-center py-4">
            <div className="text-2xl font-chinese font-bold text-xuan-gold mb-2">{pattern.name}</div>
            <div className="text-sm text-xuan-muted font-chinese">{pattern.description}</div>
          </div>
        </div>

        {/* Favorable & Unfavorable */}
        <div className="card-xuan-gold p-6">
          <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-4">喜用神 / 忌神</h3>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-xuan-muted font-chinese">喜用神（有利）</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {dayMasterAnalysis.favorableGods.map((g: string) => (
                  <span key={g} className="px-2 py-0.5 text-xs font-chinese rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-xuan-muted font-chinese">忌神（不利）</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {dayMasterAnalysis.unfavorableGods.map((g: string) => (
                  <span key={g} className="px-2 py-0.5 text-xs font-chinese rounded bg-red-500/10 text-red-400 border border-red-500/30">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dayun */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-xuan-gold p-6 sm:p-8"
      >
        <h2 className="text-xl font-chinese font-bold text-xuan-gold mb-1 flex items-center gap-2">
          <span>📅</span> 大运排盘
        </h2>
        <p className="text-xs text-xuan-muted font-chinese mb-6">
          每十年一大运，展示各运程天干地支及吉凶
        </p>

        {/* Cycle Selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {dayun.map((decade: any[], idx: number) => (
            <button
              key={idx}
              onClick={() => setCycleIdx(idx)}
              className={`px-4 py-2 text-xs font-chinese rounded-lg border transition-all ${
                cycleIdx === idx
                  ? 'border-xuan-gold bg-xuan-gold/10 text-xuan-gold'
                  : 'border-xuan-border text-xuan-muted hover:border-xuan-gold/30'
              }`}
            >
              {decade[0]?.age}-{decade[9]?.age}岁
            </button>
          ))}
        </div>

        {/* Current Cycle Detail */}
        {dayun[cycleIdx] && (
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {dayun[cycleIdx].map((year: any, idx: number) => (
              <div
                key={idx}
                className={`p-2 rounded text-center text-[10px] sm:text-xs font-chinese border transition-all ${
                  year.isGood
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                    : 'border-red-500/20 bg-red-500/5 text-red-400'
                }`}
              >
                <div className="font-bold mb-0.5">{year.age}岁</div>
                <div>{year.stem}{year.branch}</div>
                <div className="opacity-70">{year.element}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Liunian */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card-xuan-gold p-6 sm:p-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-chinese font-bold text-xuan-gold flex items-center gap-2">
            <span>🔮</span> 流年运势
          </h2>
          <span className="text-xs text-xuan-muted font-chinese">未来10年</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {liunian.map((ln: any) => (
            <div key={ln.year} className="p-3 bg-xuan-dark rounded-lg border border-xuan-border text-center">
              <div className="text-sm font-chinese font-bold text-white mb-1">{ln.year}年</div>
              <div className="text-lg font-chinese text-xuan-gold mb-1">{ln.stem}</div>
              <span className={`inline-block px-2 py-0.5 text-[10px] font-chinese rounded-full ${
                ['比肩','劫财','正印','偏印'].includes(ln.shishen)
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {ln.shishen}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
