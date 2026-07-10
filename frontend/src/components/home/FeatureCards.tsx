'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  {
    title: '命理系统',
    subtitle: '命理预测',
    icon: '☯',
    href: '/bazi',
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30 hover:border-amber-500/60',
    items: [
      { name: '八字排盘', href: '/bazi', icon: '☰' },
      { name: '紫微斗数', href: '/ziwei', icon: '★' },
      { name: '姓名学', href: '/name', icon: '名' },
      { name: '择日', href: '/zeri', icon: '历' },
    ],
  },
  {
    title: '占卜系统',
    subtitle: '占卜预测',
    icon: '☳',
    href: '/divination',
    color: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-500/30 hover:border-cyan-500/60',
    items: [
      { name: '六爻占卜', href: '/divination/liuyao', icon: '爻' },
      { name: '梅花易数', href: '/divination/meihua', icon: '梅' },
      { name: '奇门遁甲', href: '/divination/qimen', icon: '门' },
    ],
  },
  {
    title: '风水系统',
    subtitle: '环境风水',
    icon: '☴',
    href: '/fengshui',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
    items: [
      { name: '八宅风水', href: '/fengshui/bazhai', icon: '宅' },
      { name: '玄空飞星', href: '/fengshui/feixing', icon: '星' },
      { name: '罗盘分析', href: '/fengshui/compass', icon: '盘' },
    ],
  },
  {
    title: 'AI分析系统',
    subtitle: '智能分析',
    icon: '🤖',
    href: '/ai-analysis',
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30 hover:border-purple-500/60',
    items: [
      { name: '智能解读', href: '/ai-analysis', icon: 'AI' },
      { name: '综合报告', href: '/ai-analysis/report', icon: '报' },
      { name: '个性化建议', href: '/ai-analysis/advice', icon: '议' },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function FeatureCards() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="inline-block text-xs tracking-[0.3em] text-xuan-gold/70 font-chinese mb-4">
          功能模块
        </span>
        <h2 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">
          四大核心系统
        </h2>
        <p className="text-xuan-muted font-chinese max-w-xl mx-auto">
          融合传统智慧与现代科技，为您提供全方位的玄学分析服务
        </p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.title}
            variants={itemVariants}
            className={`card-xuan-gold p-6 sm:p-8 ${category.borderColor} group`}
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h3 className="text-xl font-chinese font-bold text-xuan-gold">
                      {category.title}
                    </h3>
                    <p className="text-xs text-xuan-muted font-chinese">
                      {category.subtitle}
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href={category.href}
                className="px-3 py-1.5 text-xs font-chinese text-xuan-gold border border-xuan-gold/30 rounded-full hover:bg-xuan-gold/10 transition-colors"
              >
                查看全部
              </Link>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {category.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative p-4 rounded-lg bg-gradient-to-br ${category.color} border border-transparent hover:border-xuan-gold/20 transition-all duration-300 group/item`}
                >
                  <div className="text-center">
                    <span className="inline-block w-10 h-10 leading-10 text-lg font-chinese text-xuan-gold bg-xuan-black/50 rounded-lg mb-2 group-hover/item:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <p className="text-sm font-chinese text-xuan-silver group-hover/item:text-xuan-gold transition-colors">
                      {item.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-xuan-gold/20 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-xuan-gold/20 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
