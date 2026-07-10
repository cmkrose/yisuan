'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api/client';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ account: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', form);
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-xuan-black flex items-center justify-center px-4">
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
          <h2 className="text-2xl font-chinese font-bold text-xuan-gold mb-6 text-center">登录</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 font-chinese">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-chinese text-xuan-silver mb-2">邮箱/手机号</label>
              <input
                type="text"
                value={form.account}
                onChange={(e) => setForm({ ...form, account: e.target.value })}
                placeholder="请输入邮箱或手机号"
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
                placeholder="请输入密码"
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
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/register" className="text-sm text-xuan-gold/70 hover:text-xuan-gold font-chinese transition-colors">
              没有账号？立即注册
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
