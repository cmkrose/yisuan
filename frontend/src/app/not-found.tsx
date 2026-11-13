import Link from 'next/link';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-32 pb-24 px-4 flex flex-col items-center text-center">
        <div className="text-7xl font-chinese font-bold text-gradient-gold mb-6">404</div>
        <h1 className="text-2xl font-chinese font-bold text-xuan-gold mb-3">页面走丢了</h1>
        <p className="text-xuan-muted font-chinese mb-8">您访问的页面不存在或已被移动。</p>
        <div className="flex gap-3">
          <Link href="/" className="btn-gold px-6 py-3 font-chinese">返回首页</Link>
          <Link href="/bazi" className="btn-outline-gold px-6 py-3 font-chinese">去排盘</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
