import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://yisuan.com';
  const now = new Date().toISOString();

  const staticPages = [
    { url: base, priority: 1, changefreq: 'daily' as const },
    { url: `${base}/bazi`, priority: 0.9, changefreq: 'daily' as const },
    { url: `${base}/ziwei`, priority: 0.9, changefreq: 'daily' as const },
    { url: `${base}/name`, priority: 0.8, changefreq: 'weekly' as const },
    { url: `${base}/fengshui`, priority: 0.8, changefreq: 'weekly' as const },
    { url: `${base}/divination`, priority: 0.8, changefreq: 'weekly' as const },
    { url: `${base}/zeri`, priority: 0.7, changefreq: 'daily' as const },
    { url: `${base}/ai-analysis`, priority: 0.8, changefreq: 'weekly' as const },
    { url: `${base}/knowledge`, priority: 0.9, changefreq: 'daily' as const },
    { url: `${base}/visual`, priority: 0.7, changefreq: 'weekly' as const },
    { url: `${base}/divination/qimen`, priority: 0.7, changefreq: 'weekly' as const },
  ];

  return staticPages.map((page) => ({
    url: page.url,
    lastModified: now,
    changeFrequency: page.changefreq,
    priority: page.priority,
  }));
}
