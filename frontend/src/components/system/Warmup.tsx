'use client';

import { useEffect } from 'react';
import { API_BASE } from '@/lib/api/client';

export default function Warmup() {
  useEffect(() => {
    try {
      fetch(`${API_BASE}/`, { method: 'GET', mode: 'cors' }).catch(() => {});
    } catch {
      /* silent */
    }
  }, []);

  return null;
}
