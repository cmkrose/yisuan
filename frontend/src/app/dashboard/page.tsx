'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

type TabKey = 'profile' | 'bazi' | 'ziwei' | 'history';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'profile', label: '我的资料', icon: '👤' },
  { key: 'bazi', label: '我的八字', icon: '☯' },
  { key: 'ziwei', label: '我的紫微', icon: '★' },
  { key: 'history', label: '分析历史', icon: '📋' },
];

export default function DashboardPage() {
  const router = useRouter();
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [charts, setCharts] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    if (!auth.isLoggedIn()) {
      router.push('/login');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [u, p, c, r] = await Promise.all([
        auth.fetchUser(),
        auth.fetchProfile(),
        auth.fetchCharts(),
        auth.fetchAnalysisRecords(),
      ]);
      setUser(u);
      setProfile(p);
      setCharts(c);
      setRecords(r);
    } catch (err) {
      console.error('加载数据失败', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const updated = await auth.updateProfile(profile);
      setProfile(updated);
      setFormChanged(false);
    } catch (err: any) {
      alert(err.response?.data?.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const updateProfileField = (key: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [key]: value }));
    setFormChanged(true);
  };

  const chartTypeNames: Record<string, string> = {
    bazi: '八字命盘',
    ziwei: '紫微星盘',
    name: '姓名分析',
    fengshui: '风水分析',
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-xuan-black flex items-center justify-center">
        <div className="text-xuan-gold font-chinese text-lg">加载中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-xuan-black">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-xuan-dark/95 backdrop-blur-xl border-b border-xuan-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-chinese font-bold text-gradient-gold">
            易算
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/bazi" className="text-sm font-chinese text-xuan-muted hover:text-xuan-gold transition-colors">
              八字排盘
            </Link>
            <button
              onClick={() => auth.logout()}
              className="text-sm font-chinese text-xuan-muted hover:text-xuan-red transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* User Info Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-chinese font-bold text-gradient-gold mb-2">
            {user?.nickname || '易算用户'}，欢迎回来
          </h1>
          <p className="text-sm text-xuan-muted font-chinese">
            {user?.email || user?.phone || ''}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-xuan-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-chinese whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.key
                  ? 'border-xuan-gold text-xuan-gold'
                  : 'border-transparent text-xuan-muted hover:text-xuan-silver'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Birth Info Card */}
              <div className="card-xuan-gold p-6">
                <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-6 flex items-center gap-2">
                  <span>📅</span> 出生信息
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-chinese text-xuan-muted mb-1">姓名</label>
                      <input
                        type="text"
                        value={profile?.realName || ''}
                        onChange={(e) => updateProfileField('realName', e.target.value)}
                        placeholder="真实姓名"
                        className="w-full px-3 py-2 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white placeholder-xuan-muted focus:outline-none focus:border-xuan-gold/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-chinese text-xuan-muted mb-1">性别</label>
                      <select
                        value={profile?.gender || ''}
                        onChange={(e) => updateProfileField('gender', e.target.value)}
                        className="w-full px-3 py-2 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white focus:outline-none focus:border-xuan-gold/50"
                      >
                        <option value="">请选择</option>
                        <option value="male">男</option>
                        <option value="female">女</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-chinese text-xuan-muted mb-1">出生日期</label>
                    <input
                      type="date"
                      value={profile?.birthDate ? profile.birthDate.split('T')[0] : ''}
                      onChange={(e) => updateProfileField('birthDate', e.target.value)}
                      className="w-full px-3 py-2 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white focus:outline-none focus:border-xuan-gold/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-chinese text-xuan-muted mb-1">出生时辰</label>
                    <select
                      value={profile?.birthTime || ''}
                      onChange={(e) => updateProfileField('birthTime', e.target.value)}
                      className="w-full px-3 py-2 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white focus:outline-none focus:border-xuan-gold/50"
                    >
                      <option value="">请选择</option>
                      <option value="zi">子时 (23:00-01:00)</option>
                      <option value="chou">丑时 (01:00-03:00)</option>
                      <option value="yin">寅时 (03:00-05:00)</option>
                      <option value="mao">卯时 (05:00-07:00)</option>
                      <option value="chen">辰时 (07:00-09:00)</option>
                      <option value="si">巳时 (09:00-11:00)</option>
                      <option value="wu">午时 (11:00-13:00)</option>
                      <option value="wei">未时 (13:00-15:00)</option>
                      <option value="shen">申时 (15:00-17:00)</option>
                      <option value="you">酉时 (17:00-19:00)</option>
                      <option value="xu">戌时 (19:00-21:00)</option>
                      <option value="hai">亥时 (21:00-23:00)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-chinese text-xuan-muted mb-1">出生地</label>
                    <input
                      type="text"
                      value={profile?.birthPlace || ''}
                      onChange={(e) => updateProfileField('birthPlace', e.target.value)}
                      placeholder="省/市（选填）"
                      className="w-full px-3 py-2 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white placeholder-xuan-muted focus:outline-none focus:border-xuan-gold/50"
                    />
                  </div>

                  {formChanged && (
                    <button
                      onClick={handleProfileSave}
                      disabled={saving}
                      className="w-full btn-gold py-3 font-chinese disabled:opacity-50"
                    >
                      {saving ? '保存中...' : '保存资料'}
                    </button>
                  )}
                </div>
              </div>

              {/* Account Info Card */}
              <div className="card-xuan-gold p-6">
                <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-6 flex items-center gap-2">
                  <span>🔐</span> 账户信息
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-xuan-border">
                    <span className="text-sm text-xuan-muted font-chinese">昵称</span>
                    <span className="text-sm text-white font-chinese">{user?.nickname || '-'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-xuan-border">
                    <span className="text-sm text-xuan-muted font-chinese">邮箱</span>
                    <span className="text-sm text-white font-chinese">{user?.email || '未绑定'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-xuan-border">
                    <span className="text-sm text-xuan-muted font-chinese">手机</span>
                    <span className="text-sm text-white font-chinese">{user?.phone || '未绑定'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-xuan-border">
                    <span className="text-sm text-xuan-muted font-chinese">注册时间</span>
                    <span className="text-sm text-white font-chinese">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Charts Tab */}
          {(activeTab === 'bazi' || activeTab === 'ziwei') && (
            <motion.div
              key="charts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-chinese font-bold text-xuan-gold">
                  {activeTab === 'bazi' ? '我的八字命盘' : '我的紫微星盘'}
                </h3>
                <Link
                  href={activeTab === 'bazi' ? '/bazi' : '/ziwei'}
                  className="text-sm font-chinese text-xuan-gold/70 hover:text-xuan-gold transition-colors"
                >
                  新增排盘 →
                </Link>
              </div>

              {charts.filter((c) => c.chartType === activeTab).length === 0 ? (
                <div className="card-xuan p-12 text-center">
                  <div className="text-4xl mb-4">{activeTab === 'bazi' ? '☯' : '★'}</div>
                  <p className="text-xuan-muted font-chinese mb-4">
                    还没有{activeTab === 'bazi' ? '八字' : '紫微'}命盘
                  </p>
                  <Link
                    href={activeTab === 'bazi' ? '/bazi' : '/ziwei'}
                    className="btn-gold px-6 py-3 text-sm font-chinese inline-block"
                  >
                    立即排盘
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {charts
                    .filter((c) => c.chartType === activeTab)
                    .map((chart) => (
                      <div key={chart.id} className="card-xuan p-4 hover:border-xuan-gold/30 group transition-all">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-chinese font-bold text-white group-hover:text-xuan-gold">
                              {chart.title || chartTypeNames[chart.chartType] || chart.chartType}
                            </h4>
                            <p className="text-xs text-xuan-muted mt-1">
                              {new Date(chart.createdAt).toLocaleString('zh-CN')}
                            </p>
                          </div>
                          <span className="text-xuan-muted group-hover:text-xuan-gold transition-colors text-sm">查看 →</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h3 className="text-lg font-chinese font-bold text-xuan-gold mb-6">分析历史记录</h3>

              {records.length === 0 ? (
                <div className="card-xuan p-12 text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-xuan-muted font-chinese">暂无分析记录</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {records.map((record) => (
                    <div key={record.id} className="card-xuan p-4 hover:border-xuan-gold/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="inline-block px-2 py-0.5 text-xs font-chinese bg-xuan-gold/10 text-xuan-gold rounded mb-1">
                            {chartTypeNames[record.analysisType] || record.analysisType}
                          </span>
                          <p className="text-sm text-xuan-silver font-chinese">
                            {new Date(record.createdAt).toLocaleString('zh-CN')}
                          </p>
                        </div>
                        <span className="text-xs text-xuan-muted">查看详情 →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
