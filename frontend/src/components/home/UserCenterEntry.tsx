'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function UserCenterEntry() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-2xl border border-xuan-gold/20 bg-gradient-to-br from-xuan-card via-xuan-dark to-xuan-card p-8 sm:p-12"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212,168,83,0.3) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Decorative Bagua */}
          <div className="absolute top-4 right-4 text-8xl font-chinese text-xuan-gold/5">卦</div>
          <div className="absolute bottom-4 left-4 text-6xl font-chinese text-xuan-gold/5">易</div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-xuan-gold/30 bg-xuan-gold/10 mb-6"
            >
              <span className="text-4xl">👤</span>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl font-chinese font-bold text-gradient-gold mb-4">
              用户中心
            </h2>
            <p className="text-xuan-muted font-chinese mb-8 max-w-md mx-auto">
              登录后保存您的命盘数据，查看历史分析记录，获取个性化推荐
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="btn-gold text-base px-8 py-3 font-chinese"
              >
                立即登录
              </Link>
              <Link
                href="/register"
                className="btn-outline-gold text-base px-8 py-3 font-chinese"
              >
                免费注册
              </Link>
            </div>

            {/* Features */}
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { icon: '💾', label: '保存命盘' },
                { icon: '📊', label: '历史记录' },
                { icon: '🎯', label: '个性推荐' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <span className="text-2xl mb-2 block">{feature.icon}</span>
                  <span className="text-xs text-xuan-muted font-chinese">{feature.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
