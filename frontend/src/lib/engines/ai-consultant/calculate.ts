import { api } from '@/lib/api/client';
import { aiEngine } from './engine';
import type { AiReport, AiRequest } from './prompts';

const USE_REMOTE_AI = process.env.NEXT_PUBLIC_USE_REMOTE_AI === 'true';

export async function aiAnalyze(req: AiRequest): Promise<AiReport> {
  if (USE_REMOTE_AI) {
    try {
      const res = await api.post('/api/ai-consultant/analyze', req, { timeout: 8000 });
      return res.data as AiReport;
    } catch {
      return aiEngine.analyzeLocal(req);
    }
  }
  return aiEngine.analyzeLocal(req);
}
