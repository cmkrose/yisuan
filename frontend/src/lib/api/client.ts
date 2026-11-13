import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://yisuan.onrender.com';

export { API_BASE };

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const NO_RETRY_PATTERNS = [/\/auth\/login/, /\/auth\/register/, /\/save$/];

function isRetryable(config: any): boolean {
  if (!config) return false;
  const method = (config.method || 'get').toLowerCase();
  const url = config.url || '';
  if (NO_RETRY_PATTERNS.some((re) => re.test(url))) return false;
  if (method === 'get') return true;
  if (method === 'post' && /\/calculate$/.test(url)) return true;
  return false;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;

    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    if (config && !config.__retried && isRetryable(config)) {
      config.__retried = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return api(config);
    }

    return Promise.reject(error);
  },
);
