'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';

export function useAuth() {
  const router = useRouter();

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  };

  const getUser = () => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  };

  const isLoggedIn = () => !!getToken();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const fetchProfile = async () => {
    const res = await api.get('/api/users/profile');
    return res.data;
  };

  const fetchUser = async () => {
    const res = await api.get('/api/users/me');
    return res.data;
  };

  const updateProfile = async (data: any) => {
    const res = await api.put('/api/users/profile', data);
    return res.data;
  };

  const fetchCharts = async () => {
    const res = await api.get('/api/users/charts');
    return res.data;
  };

  const fetchAnalysisRecords = async () => {
    const res = await api.get('/api/users/analysis-records');
    return res.data;
  };

  return {
    getToken,
    getUser,
    isLoggedIn,
    logout,
    fetchProfile,
    fetchUser,
    updateProfile,
    fetchCharts,
    fetchAnalysisRecords,
  };
}
