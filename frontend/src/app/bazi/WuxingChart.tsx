'use client';

import React from 'react';
import { motion } from 'framer-motion';

const elementMeta: Record<string, { color: string; icon: string; label: string }> = {
  木: { color: 'bg-emerald-500', icon: '🌳', label: '木' },
  火: { color: 'bg-red-500', icon: '🔥', label: '火' },
  土: { color: 'bg-amber-500', icon: '⛰️', label: '土' },
  金: { color: 'bg-yellow-400', icon: '⚜️', label: '金' },
  水: { color: 'bg-cyan-500', icon: '💧', label: '水' },
};

export default function WuxingChart({ analysis }: { analysis: any }) {
  const { dayMasterAnalysis } = analysis;
  const counts = dayMasterAnalysis.elementCounts || {};
  const total = Object.values(counts).reduce((s: number, v: any) => s + Number(v), 0) || 1;

  const sorted = Object.entries(counts)
    .map(([el, count]) => ({ element: el, count: Number(count) }))
    .sort((a, b) => b.count - a.count);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-xuan-gold p-6 sm:p-8"
    >
      <h2 className="text-xl font-chinese font-bold text-xuan-gold mb-6 flex items-center gap-2">
        <span>⭐</span> 五行分布
      </h2>

      {/* Bar Chart */}
      <div className="space-y-4">
        {sorted.map(({ element, count }, index) => {
          const meta = elementMeta[element] || { color: 'bg-gray-500', icon: '?', label: element };
          const pct = Math.round((count / total) * 100);
          return (
            <motion.div
              key={element}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm w-6">{meta.icon}</span>
                <span className="text-sm font-chinese text-xuan-silver w-8">{meta.label}</span>
                <span className="text-xs text-xuan-muted w-12 text-right">{count}</span>
                <span className="text-xs text-xuan-muted w-10 text-right">{pct}%</span>
              </div>
              <div className="h-3 bg-xuan-dark rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${meta.color}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total bar */}
      <div className="mt-4 h-2 bg-xuan-dark rounded-full overflow-hidden flex">
        {sorted.map(({ element, count }) => {
          const meta = elementMeta[element] || { color: 'bg-gray-500', icon: '?', label: element };
          const pct = Math.round((count / total) * 100);
          return (
            <motion.div
              key={`t-${element}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className={`h-full ${meta.color}`}
            />
          );
        })}
      </div>

      {/* Day Master Highlight */}
      <div className="mt-6 p-4 bg-xuan-dark rounded-lg border border-xuan-gold/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">☯</span>
            <div>
              <div className="text-sm font-chinese text-xuan-silver">日主</div>
              <div className="text-xs text-xuan-muted">
                {dayMasterAnalysis.dayMaster}({dayMasterAnalysis.element})
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-chinese font-bold ${
              ['极强','强'].includes(dayMasterAnalysis.strength) ? 'text-red-400' :
              ['极弱','弱'].includes(dayMasterAnalysis.strength) ? 'text-cyan-400' :
              'text-xuan-gold'
            }`}>
              {dayMasterAnalysis.strength}
            </div>
            <div className="text-xs text-xuan-muted">评分: {dayMasterAnalysis.score}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
