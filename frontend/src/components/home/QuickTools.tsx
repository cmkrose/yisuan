'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const quickTools = [
  {
    name: '八字排盘',
    description: '输入出生信息，查看详细命理分析',
    icon: '☰',
    href: '/bazi',
    color: 'text-amber-400',
  },
  {
    name: '紫微斗数',
    description: '十二宫位排盘，四化星曜分析',
    icon: '★',
    href: '/ziwei',
    color: 'text-purple-400',
  },
  {
    name: '姓名测试',
    description: '五格三才分析，改名建议',
    icon: '名',
    href: '/name',
    color: 'text-cyan-400',
  },
  {
    name: '今日黄历',
    description: '查看每日宜忌、吉凶',
    icon: '历',
    href: '/zeri',
    color: 'text-emerald-400',
  },
  {
    name: '奇门遁甲',
    description: '九宫八门，局势分析',
    icon: '门',
    href: '/divination/qimen',
    color: 'text-blue-400',
  },
  {
    name: '风水堪舆',
    description: '罗盘八宅，阳宅阴宅',
    icon: '屋',
    href: '/fengshui',
    color: 'text-teal-400',
  },
];

export default function QuickTools() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-chinese font-bold text-gradient-gold mb-2">
            快捷工具
          </h2>
          <p className="text-sm text-xuan-muted font-chinese">
            一键直达常用功能
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickTools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={tool.href}
                className="block p-6 card-xuan hover:border-xuan-gold/40 group transition-all duration-300"
              >
                <div className={`text-4xl mb-4 ${tool.color} group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>
                <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-1">
                  {tool.name}
                </h3>
                <p className="text-xs text-xuan-muted font-chinese">
                  {tool.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
