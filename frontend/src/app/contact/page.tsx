'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { api } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';

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
  const { getUser } = useAuth();
  const [fbType, setFbType] = useState<'建议' | '问题'>('建议');
  const [fbContent, setFbContent] = useState('');
  const [fbContact, setFbContact] = useState('');
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [fbStatus, setFbStatus] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#feedback') {
      const timer = window.setTimeout(() => {
        document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const submitFeedback = async () => {
    if (fbSubmitting) return;
    const content = fbContent.trim();
    if (!content) {
      setFbStatus({ ok: false, text: '请先填写反馈内容' });
      return;
    }
    setFbSubmitting(true);
    setFbStatus(null);
    try {
      const user = getUser();
      const userId = user?.id ? String(user.id) : undefined;
      const contact = fbContact.trim();
      const finalContent = contact ? `${content}\n\n【联系方式】${contact}` : content;
      await api.post('/api/admin/feedback', { content: finalContent, type: fbType, userId });
      setFbStatus({ ok: true, text: '反馈已提交，感谢你的反馈！' });
      setFbContent('');
      setFbContact('');
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      setFbStatus({
        ok: false,
        text: msg ? `提交失败：${Array.isArray(msg) ? msg.join('；') : msg}` : '提交失败，请稍后重试',
      });
    } finally {
      setFbSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
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
            initial="visible"
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

            <motion.div
              variants={itemVariants}
              id="feedback"
              className="card-xuan-gold p-6 sm:p-8 scroll-mt-24"
            >
              <h2 className="text-xl sm:text-2xl font-chinese font-bold text-xuan-gold mb-6 border-b border-xuan-border pb-3">
                意见反馈
              </h2>
              <p className="text-sm text-xuan-silver font-chinese leading-relaxed mb-6">
                使用中遇到问题，或有改进建议？请在这里告诉我们。
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs text-xuan-gold font-chinese mb-2">反馈类型</label>
                  <div className="flex gap-3">
                    {(['建议', '问题'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFbType(t)}
                        disabled={fbSubmitting}
                        className={`px-4 py-2 rounded-lg text-sm font-chinese border transition-all disabled:opacity-60 ${
                          fbType === t
                            ? 'bg-xuan-gold/15 border-xuan-gold/60 text-xuan-gold'
                            : 'bg-xuan-dark border-xuan-border text-xuan-muted hover:text-xuan-silver'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="fb-content" className="block text-xs text-xuan-gold font-chinese mb-2">
                    反馈内容 <span className="text-xuan-red">*</span>
                  </label>
                  <textarea
                    id="fb-content"
                    value={fbContent}
                    onChange={(e) => setFbContent(e.target.value)}
                    maxLength={1000}
                    rows={5}
                    disabled={fbSubmitting}
                    placeholder="请描述你的建议或遇到的问题..."
                    className="w-full px-4 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white placeholder-xuan-muted focus:border-xuan-gold/50 outline-none resize-y disabled:opacity-60"
                  />
                  <div className="mt-1 text-right text-[10px] text-xuan-muted">{fbContent.length}/1000</div>
                </div>

                <div>
                  <label htmlFor="fb-contact" className="block text-xs text-xuan-gold font-chinese mb-2">
                    联系方式（选填）
                  </label>
                  <input
                    id="fb-contact"
                    type="text"
                    value={fbContact}
                    onChange={(e) => setFbContact(e.target.value)}
                    maxLength={100}
                    disabled={fbSubmitting}
                    placeholder="邮箱 / 微信 / QQ，方便我们回复"
                    className="w-full px-4 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white placeholder-xuan-muted focus:border-xuan-gold/50 outline-none disabled:opacity-60"
                  />
                </div>

                {fbStatus && (
                  <div
                    role={fbStatus.ok ? 'status' : 'alert'}
                    className={`p-3 rounded-lg text-xs font-chinese border ${
                      fbStatus.ok
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}
                  >
                    {fbStatus.text}
                  </div>
                )}

                <button
                  type="button"
                  onClick={submitFeedback}
                  disabled={fbSubmitting}
                  className="w-full btn-gold py-3 font-chinese text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {fbSubmitting ? '提交中...' : '提交反馈'}
                </button>
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
