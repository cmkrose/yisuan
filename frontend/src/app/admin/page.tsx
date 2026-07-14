'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api/client';

type TabKey = 'dashboard' | 'users' | 'features' | 'feedback' | 'health';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: '仪表盘', icon: '📊' },
  { key: 'users', label: '用户管理', icon: '👥' },
  { key: 'features', label: '功能统计', icon: '📈' },
  { key: 'feedback', label: '用户反馈', icon: '💬' },
  { key: 'health', label: '系统状态', icon: '🟢' },
];

const featureIcons: Record<string, string> = {
  '八字命理':'☯','紫微斗数':'★','姓名学':'名','风水堪舆':'🏠',
  '择日':'📆','奇门遁甲':'门','大六壬':'壬','知识库':'📚',
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [tab, setTab] = useState<TabKey>('dashboard');
  const [dash, setDash] = useState<any>(null);
  const [users, setUsers] = useState<any>(null);
  const [features, setFeatures] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [searchUser, setSearchUser] = useState('');
  const [userDetail, setUserDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const token = () => localStorage.getItem('admin_token') || '';

  useEffect(() => {
    const saved = localStorage.getItem('admin_token');
    if (saved === 'yisuan-admin-2024') { setLoggedIn(true); loadTab('dashboard'); }
  }, []);

  const handleLogin = async () => {
    setLoginError('');
    try {
      const r = await api.post('/api/admin/login', { password });
      localStorage.setItem('admin_token', r.data.token);
      setLoggedIn(true);
      loadTab('dashboard');
    } catch { setLoginError('密码错误'); }
  };

  const loadTab = async (t: TabKey) => {
    setTab(t); setLoading(true);
    try {
      const h = { headers: { Authorization: `Bearer ${token()}` } };
      if (t === 'dashboard') { const r = await api.get('/api/admin/dashboard', h); setDash(r.data); }
      if (t === 'users') { const r = await api.get(`/api/admin/users?search=${searchUser}`, h); setUsers(r.data); }
      if (t === 'features') { const r = await api.get('/api/admin/features', h); setFeatures(r.data); }
      if (t === 'feedback') { const r = await api.get('/api/admin/feedbacks', h); setFeedbacks(r.data); }
      if (t === 'health') { const r = await api.get('/api/admin/health', h); setHealth(r.data); }
    } catch { if (t === 'dashboard' && !localStorage.getItem('admin_token')) setLoggedIn(false); }
    finally { setLoading(false); }
  };

  const viewUser = async (id: string) => {
    const r = await api.get(`/api/admin/user-detail?id=${id}`, { headers: { Authorization: `Bearer ${token()}` } });
    setUserDetail(r.data);
  };

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-xuan-black flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-3xl font-chinese font-bold text-gradient-gold">易算</span>
            <p className="text-xs text-xuan-muted font-chinese mt-2">开发者后台</p>
          </div>
          <div className="card-xuan-gold p-6">
            {loginError && <div className="mb-4 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 font-chinese">{loginError}</div>}
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="输入管理员密码" className="w-full px-4 py-3 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white placeholder-xuan-muted focus:border-xuan-gold/50 mb-4" />
            <button onClick={handleLogin} className="w-full btn-gold py-3 font-chinese text-sm">登录</button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-xuan-black">
      <header className="sticky top-0 z-50 bg-xuan-dark/95 backdrop-blur-xl border-b border-xuan-gold/20">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-chinese font-bold text-gradient-gold">易算</span>
            <span className="text-xs text-xuan-muted font-chinese bg-xuan-gold/10 px-2 py-0.5 rounded">开发者后台</span>
          </div>
          <button onClick={() => { localStorage.removeItem('admin_token'); setLoggedIn(false); }}
            className="text-xs text-xuan-muted hover:text-xuan-red font-chinese transition-colors">退出</button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="hidden sm:block w-48 min-h-[calc(100vh-3.5rem)] border-r border-xuan-border p-4 space-y-1">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => loadTab(t.key)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-chinese transition-all ${
                tab === t.key ? 'bg-xuan-gold/10 text-xuan-gold border-l-2 border-xuan-gold' : 'text-xuan-muted hover:text-xuan-silver hover:bg-xuan-dark'
              }`}>
              <span className="mr-2">{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>

        {/* Mobile Tabs */}
        <div className="sm:hidden w-full border-b border-xuan-border flex overflow-x-auto px-2">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => loadTab(t.key)}
              className={`flex-shrink-0 px-3 py-3 text-xs font-chinese border-b-2 transition-all ${
                tab === t.key ? 'border-xuan-gold text-xuan-gold' : 'border-transparent text-xuan-muted'
              }`}>{t.icon} {t.label}</button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl">
              {loading && <div className="text-sm text-xuan-muted font-chinese">加载中...</div>}

              {/* ===== DASHBOARD ===== */}
              {tab === 'dashboard' && dash && (
                <div>
                  <h2 className="text-xl font-chinese font-bold text-xuan-gold mb-6">仪表盘</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                      { label:'用户总数', value:dash.totalUsers, icon:'👥', color:'border-purple-400/40 bg-purple-500/5' },
                      { label:'今日新增', value:dash.todayUsers, icon:'🆕', color:'border-emerald-400/40 bg-emerald-500/5' },
                      { label:'总使用次数', value:dash.totalVisits, icon:'📊', color:'border-amber-400/40 bg-amber-500/5' },
                      { label:'最热功能', value:dash.topFeature, icon:'🔥', color:'border-rose-400/40 bg-rose-500/5' },
                    ].map((c) => (
                      <div key={c.label} className={`p-4 rounded-xl border ${c.color} text-center`}>
                        <span className="text-2xl block mb-2">{c.icon}</span>
                        <div className="text-2xl font-bold text-white font-chinese">{c.value}</div>
                        <div className="text-xs text-xuan-muted mt-1">{c.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Feature Ranking */}
                  <div className="card-xuan-gold p-6">
                    <h3 className="text-sm font-chinese font-bold text-xuan-gold mb-4">功能热力图</h3>
                    <div className="space-y-2">
                      {dash.featureUsage.map((f: any, i: number) => {
                        const max = dash.featureUsage[0]?.count || 1;
                        const pct = Math.round((f.count / max) * 100);
                        const colors = ['bg-xuan-gold','bg-purple-400','bg-emerald-400','bg-cyan-400','bg-amber-400','bg-rose-400','bg-xuan-gold/70','bg-purple-400/70','bg-emerald-400/70','bg-cyan-400/70'];
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="w-20 text-xs font-chinese text-xuan-silver text-right">{f.name}</span>
                            <div className="flex-1 h-6 bg-xuan-dark rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, delay: i * 0.05 }}
                                className={`h-full rounded-full ${colors[i % colors.length]}`} />
                            </div>
                            <span className="w-10 text-xs text-xuan-muted text-right">{f.count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ===== USERS ===== */}
              {tab === 'users' && (
                <div>
                  <h2 className="text-xl font-chinese font-bold text-xuan-gold mb-4">用户管理</h2>
                  <div className="flex gap-2 mb-4">
                    <input type="text" value={searchUser} onChange={e => setSearchUser(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && loadTab('users')}
                      placeholder="搜索用户昵称/邮箱..." className="flex-1 px-3 py-2 bg-xuan-dark border border-xuan-border rounded-lg text-sm text-white placeholder-xuan-muted focus:border-xuan-gold/50" />
                    <button onClick={() => loadTab('users')} className="btn-gold px-4 py-2 text-sm font-chinese">搜索</button>
                  </div>

                  {users && (
                    <div className="card-xuan-gold overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-xuan-border text-xuan-muted font-chinese">
                            <th className="text-left p-3">用户</th><th className="text-left p-3">注册时间</th><th className="text-center p-3">命盘</th><th className="text-center p-3">分析</th><th className="text-right p-3">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.users.map((u: any) => (
                            <tr key={u.id} className="border-b border-xuan-border/30 hover:bg-xuan-gold/5">
                              <td className="p-3"><div className="font-chinese text-xuan-gold">{u.nickname || '用户'}</div><div className="text-[10px] text-xuan-muted">{u.email || u.phone || u.id.slice(0,8)}</div></td>
                              <td className="p-3 text-xuan-muted">{new Date(u.createdAt).toLocaleDateString('zh-CN')}</td>
                              <td className="p-3 text-center">{u._count.charts}</td>
                              <td className="p-3 text-center">{u._count.analysisRecords}</td>
                              <td className="p-3 text-right">
                                <button onClick={() => viewUser(u.id)} className="text-xs text-xuan-gold hover:underline font-chinese">详情</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="p-3 text-xs text-xuan-muted font-chinese">共 {users.total} 个用户 · 第 {users.page}/{users.totalPages} 页</div>
                    </div>
                  )}

                  {userDetail && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 card-xuan-gold p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-chinese font-bold text-xuan-gold">用户详情: {userDetail.user?.nickname}</h3>
                        <button onClick={() => setUserDetail(null)} className="text-xs text-xuan-muted">✕</button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-center">
                        {[{ l:'命盘数', v:userDetail.chartCount },{ l:'分析数', v:userDetail.analysisCount }].map((c) => (
                          <div key={c.l} className="p-2 bg-xuan-dark rounded text-sm font-bold text-xuan-gold">{c.v}<div className="text-[10px] text-xuan-muted">{c.l}</div></div>
                        ))}
                      </div>
                      {userDetail.featureUsage && (
                        <div>
                          <div className="text-xs text-xuan-muted mb-1">使用功能分布</div>
                          <div className="flex flex-wrap gap-1">
                            {userDetail.featureUsage.map((f: any) => (
                              <span key={f.name} className="px-2 py-0.5 text-[10px] font-chinese rounded bg-xuan-gold/10 text-xuan-gold">{f.name} ×{f.count}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* ===== FEATURES ===== */}
              {tab === 'features' && (
                <div>
                  <h2 className="text-xl font-chinese font-bold text-xuan-gold mb-4">功能使用统计</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((f: any, i: number) => (
                      <div key={i} className="card-xuan-gold p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{featureIcons[f.type] || '📊'}</span>
                          <div>
                            <div className="text-sm font-chinese font-bold text-xuan-gold">{f.type}</div>
                            <div className="text-xs text-xuan-muted">{f.total} 次使用 · {f.userCount} 人</div>
                          </div>
                        </div>
                        {f.users && f.users.length > 0 && (
                          <div className="space-y-1">
                            {f.users.map((u: any) => (
                              <div key={u.userId} className="flex justify-between items-center text-xs bg-xuan-dark rounded p-2">
                                <span className="text-xuan-silver font-chinese">{u.nickname}</span>
                                <span className="text-xuan-gold">{u.count}次</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== FEEDBACK ===== */}
              {tab === 'feedback' && feedbacks && (
                <div>
                  <h2 className="text-xl font-chinese font-bold text-xuan-gold mb-4">用户反馈</h2>
                  {feedbacks.items?.length === 0 ? (
                    <div className="card-xuan p-8 text-center text-sm text-xuan-muted font-chinese">暂无用户反馈</div>
                  ) : (
                    <div className="space-y-3">
                      {feedbacks.items.map((fb: any) => (
                        <div key={fb.id} className="card-xuan-gold p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-0.5 text-[10px] font-chinese rounded-full ${fb.feedbackType==='问题'?'bg-red-500/10 text-red-400':'bg-xuan-gold/10 text-xuan-gold'}`}>{fb.feedbackType}</span>
                            <span className="text-[10px] text-xuan-muted">{new Date(fb.createdAt).toLocaleString('zh-CN')}</span>
                          </div>
                          <p className="text-sm text-xuan-silver font-chinese">{fb.content}</p>
                          {fb.adminReply && <div className="mt-2 p-2 bg-xuan-dark rounded text-xs text-xuan-gold font-chinese">回复: {fb.adminReply}</div>}
                        </div>
                      ))}
                      <div className="text-xs text-xuan-muted">共 {feedbacks.total} 条 · 第 {feedbacks.page}/{feedbacks.totalPages} 页</div>
                    </div>
                  )}
                </div>
              )}

              {/* ===== HEALTH ===== */}
              {tab === 'health' && health && (
                <div>
                  <h2 className="text-xl font-chinese font-bold text-xuan-gold mb-4">系统状态</h2>
                  <div className={`p-4 rounded-xl mb-6 text-center border ${health.status === 'healthy' ? 'border-emerald-400/40 bg-emerald-500/5' : 'border-amber-400/40 bg-amber-500/5'}`}>
                    <div className={`text-2xl font-chinese font-bold ${health.status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {health.status === 'healthy' ? '一切正常' : '部分异常'}
                    </div>
                    <div className="text-xs text-xuan-muted mt-1">系统运行状态检查</div>
                  </div>
                  <div className="space-y-3">
                    {health.checks.map((c: any, i: number) => (
                      <div key={i} className={`p-4 rounded-lg border ${c.status === 'ok' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${c.status === 'ok' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          <span className="text-sm font-chinese font-bold text-white">{c.name}</span>
                        </div>
                        <div className="text-xs text-xuan-silver mt-1">{c.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
