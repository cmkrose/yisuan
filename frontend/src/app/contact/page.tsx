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

export default function ContactPage() {
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
              CONTACT
            </span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">
              联系我们
            </h1>
            <p className="text-xuan-muted font-chinese">
              以术会友，以道结缘
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="card-xuan-gold overflow-hidden">
              <div className="relative w-48 h-36 mx-auto overflow-hidden rounded-xl">
                <img
                  src="/images/8.jpg"
                  alt="联系方式"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-xuan-black/80 via-transparent to-transparent" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-chinese font-bold text-xuan-gold mb-6 border-b border-xuan-border pb-3">
                联系方式
              </h2>
              <p className="text-sm text-xuan-silver font-chinese leading-relaxed mb-8">
                如有任何问题或建议，欢迎随时联系。我们将尽快回复您的消息。
              </p>
              <div className="grid grid-cols-1 gap-6 max-w-xs mx-auto">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="card-xuan p-5 text-center"
                >
                  <div className="text-3xl mb-3">📧</div>
                  <h3 className="text-sm font-chinese font-bold text-xuan-gold mb-2">
                    电子邮箱
                  </h3>
                  <p className="text-xs text-xuan-silver font-chinese break-all">
                    2621201037@qq.com
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8 text-center">
              <p className="text-sm text-xuan-gold font-chinese leading-relaxed">
                山高水长，缘来则聚。期待与每一位有缘人相遇。
              </p>
              <p className="text-xs text-xuan-muted font-chinese mt-2">
                反馈建议 / 技术交流 / 合作洽谈
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
