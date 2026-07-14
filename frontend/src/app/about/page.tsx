'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-xs tracking-[0.3em] text-xuan-gold/70 font-chinese mb-4">
              ABOUT
            </span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">
              关于我们
            </h1>
            <p className="text-xuan-muted font-chinese">
              以代码传道，以术数渡人
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-chinese font-bold text-xuan-gold mb-6 border-b border-xuan-border pb-3">
                关于我
              </h2>
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-xuan-silver font-chinese leading-relaxed">
                  踏雪亦为寻梅，独行于代码与玄学之间。自幼痴迷东方术数，十余载研习不辍。今以一己之力，融古法于今技，筑此易算平台。愿以代码为舟，渡有缘人于命理之海。
                </p>
                <p className="text-sm sm:text-base text-xuan-silver font-chinese leading-relaxed">
                  寒窗十载，笔耕不辍。从紫微斗数到四柱八字，从奇门遁甲到六爻占卜，从风水堪舆到姓名学理——每一门术数都承载着华夏先贤对天地人三才的深刻洞见。我深信，传统智慧不应束之高阁，而应借助现代技术，让更多人得以亲近、理解、运用。
                </p>
                <p className="text-sm sm:text-base text-xuan-silver font-chinese leading-relaxed">
                  独行者未必孤独。在每一个深夜编码的时刻，在每一次算法与古法的碰撞中，我感受到的是跨越千年的对话。易算平台的每一行代码，都写满了我对东方智慧的敬畏与热爱。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-chinese font-bold text-xuan-gold mb-6 border-b border-xuan-border pb-3">
                关于易算
              </h2>
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-xuan-silver font-chinese leading-relaxed">
                  易算是一个开源的个人项目，旨在将中国传统命理学与现代计算机技术相结合，为广大命理爱好者和专业人士提供一个准确、便捷、美观的命理分析平台。
                </p>
                <p className="text-sm sm:text-base text-xuan-silver font-chinese leading-relaxed">
                  平台集成了八字命理排盘、紫微斗数分析、姓名学解读、风水堪舆、奇门遁甲、六爻占卜、择日吉凶等核心功能，并融合了AI大语言模型技术，为用户提供智能化的命理解读。
                </p>
                <p className="text-sm sm:text-base text-xuan-silver font-chinese leading-relaxed">
                  易，变也，不变也。以不易之算法，解万变之命运。我们坚持开放源代码，欢迎每一位同道中人共同参与，让东方智慧的光芒照亮更多人的前行之路。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-chinese font-bold text-xuan-gold mb-6 border-b border-xuan-border pb-3">
                技术栈
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Next.js', desc: '前端框架', color: 'border-white/20 hover:border-white/50' },
                  { name: 'NestJS', desc: '后端框架', color: 'border-red-500/20 hover:border-red-500/50' },
                  { name: 'TypeScript', desc: '类型安全', color: 'border-blue-500/20 hover:border-blue-500/50' },
                  { name: 'Tailwind CSS', desc: '样式方案', color: 'border-cyan-500/20 hover:border-cyan-500/50' },
                  { name: 'PostgreSQL', desc: '数据存储', color: 'border-blue-400/20 hover:border-blue-400/50' },
                  { name: 'Redis', desc: '缓存服务', color: 'border-red-400/20 hover:border-red-400/50' },
                ].map((tech) => (
                  <motion.div
                    key={tech.name}
                    whileHover={{ y: -4 }}
                    className={`text-center p-5 bg-xuan-dark border rounded-lg ${tech.color} transition-all duration-300`}
                  >
                    <div className="text-sm font-chinese font-bold text-xuan-gold mb-1">
                      {tech.name}
                    </div>
                    <div className="text-xs text-xuan-muted font-chinese">
                      {tech.desc}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8 text-center">
              <p className="text-sm text-xuan-gold font-chinese leading-relaxed">
                本项目完全开源，以热情驱动，以匠心雕琢。
              </p>
              <p className="text-sm text-xuan-muted font-chinese mt-2">
                一人之力虽微，然心之所向，山海不可阻也。
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
