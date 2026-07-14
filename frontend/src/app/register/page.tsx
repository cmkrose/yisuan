'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api/client';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', phone: '', password: '', confirmPassword: '', nickname: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [phoneError, setPhoneError] = useState('');
  const [emailSuffix, setEmailSuffix] = useState('@qq.com');
  const [emailPrefix, setEmailPrefix] = useState('');

  const emailSuffixes = ['@qq.com', '@163.com', '@126.com', '@gmail.com', '@outlook.com', '@sina.com', '@sohu.com', '@139.com'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPhoneError('');

    if (form.password !== form.confirmPassword) {
      setError('两次密码输入不一致');
      return;
    }
    if (method === 'email') {
      const fullEmail = emailPrefix + emailSuffix;
      if (!emailPrefix) { setError('请输入邮箱'); return; }
      form.email = fullEmail;
    }
    if (method === 'phone') {
      const phone = form.phone.replace(/\s/g, '');
      if (!/^\d{11}$/.test(phone)) {
        setPhoneError('手机号必须为11位数字');
        return;
      }
      if (phone.length !== 11) {
        setPhoneError('手机号必须为11位数字');
        return;
      }
      form.phone = phone;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', {
        email: method === 'email' ? form.email : undefined,
        phone: method === 'phone' ? form.phone : undefined,
        password: form.password,
        nickname: form.nickname || undefined,
      });
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || '注册失败，请重试';
      if (msg.includes('已存在') || msg.includes('重复')) {
        setError(msg);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-xuan-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <Link href="/" className="inline-block">
            <span className="text-4xl font-chinese font-bold text-gradient-gold">易算</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-xuan-gold p-8"
        >
          <h2 className="text-2xl font-chinese font-bold text-xuan-gold mb-6 text-center">注册</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 font-chinese">
              {error}
            </div>
          )}

          {/* Method Switch */}
          <div className="flex mb-6 bg-xuan-dark rounded-lg p-1">
            {[
              { value: 'email', label: '邮箱注册' },
              { value: 'phone', label: '手机注册' },
            ].map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMethod(m.value as 'email' | 'phone')}
                className={`flex-1 py-2.5 rounded-md text-sm font-chinese transition-all ${
                  method === m.value ? 'bg-xuan-gold/20 text-xuan-gold' : 'text-xuan-muted'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {method === 'email' && (
              <div>
                <label className="block text-sm font-chinese text-xuan-silver mb-2">邮箱</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={emailPrefix}
                    onChange={(e) => setEmailPrefix(e.target.value)}
                    placeholder="输入邮箱名"
                    className="flex-1 px-4 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-white placeholder-xuan-muted focus:outline-none focus:border-xuan-gold/50 transition-colors"
                  />
                  <select
                    value={emailSuffix}
                    onChange={(e) => setEmailSuffix(e.target.value)}
                    className="px-3 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-white text-sm focus:outline-none focus:border-xuan-gold/50"
                  >
                    {emailSuffixes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {method === 'phone' && (
              <div>
                <label className="block text-sm font-chinese text-xuan-silver mb-2">手机号</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 11);
                      setForm({ ...form, phone: v });
                      if (v.length > 0 && v.length !== 11) {
                        setPhoneError('手机号必须为11位数字');
                      } else if (v.length === 11) {
                        setPhoneError('');
                      } else {
                        setPhoneError('');
                      }
                    }}
                    placeholder="请输入11位手机号"
                    maxLength={11}
                    className={`w-full px-4 py-3 bg-xuan-dark border rounded-lg text-white placeholder-xuan-muted focus:outline-none transition-colors ${phoneError ? 'border-red-500/50 focus:border-red-500' : 'border-xuan-border focus:border-xuan-gold/50'}`}
                  />
                  {phoneError && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-400 font-chinese">
                      {phoneError}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-chinese text-xuan-silver mb-2">昵称</label>
              <input
                type="text"
                value={form.nickname}
                onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                placeholder="给自己取个名字（必填）"
                required
                className="w-full px-4 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-white placeholder-xuan-muted focus:outline-none focus:border-xuan-gold/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-chinese text-xuan-silver mb-2">密码</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="至少6位密码"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-white placeholder-xuan-muted focus:outline-none focus:border-xuan-gold/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-chinese text-xuan-silver mb-2">确认密码</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="再次输入密码"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-white placeholder-xuan-muted focus:outline-none focus:border-xuan-gold/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-4 text-lg font-chinese disabled:opacity-50"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-xuan-gold/70 hover:text-xuan-gold font-chinese transition-colors">
              已有账号？立即登录
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
