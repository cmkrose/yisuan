import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';

const APP_NAME = '易算';
const APP_DESCRIPTION = '集八字命理、姓名学、紫微斗数、风水、占卜、择日、AI分析于一体的东方智慧智能分析平台';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://yisuan.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0f',
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: ['八字命理','紫微斗数','姓名学','风水堪舆','奇门遁甲','择日','AI命理','东方智慧','传统文化'],
  authors: [{ name: '易算团队' }],
  creator: '易算',
  publisher: '易算科技',
  formatDetection: { telephone: false, email: false, address: false },
  icons: { icon: '/favicon.ico', apple: '/images/icons/apple-touch-icon.png' },

  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    locale: 'zh_CN',
    images: [{ url: `${APP_URL}/images/banners/og-image.jpg`, width: 1200, height: 630, alt: APP_NAME }],
  },

  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/images/banners/og-image.jpg`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },

  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },

  alternates: { canonical: APP_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: APP_NAME,
              description: APP_DESCRIPTION,
              url: APP_URL,
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Web',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
            }),
          }}
        />
      </head>
      <body className="bg-xuan-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
