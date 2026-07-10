'use client';

import React from 'react';
import Link from 'next/link';

const footerLinks = {
  命理: [
    { name: '八字排盘', href: '/bazi' },
    { name: '紫微斗数', href: '/ziwei' },
    { name: '姓名学', href: '/name' },
    { name: '择日', href: '/zeri' },
  ],
  占卜: [
    { name: '六爻占卜', href: '/divination/liuyao' },
    { name: '梅花易数', href: '/divination/meihua' },
    { name: '奇门遁甲', href: '/divination/qimen' },
  ],
  风水: [
    { name: '八宅风水', href: '/fengshui/bazhai' },
    { name: '玄空飞星', href: '/fengshui/feixing' },
    { name: '罗盘分析', href: '/fengshui/compass' },
  ],
  关于: [
    { name: '关于我们', href: '/about' },
    { name: '联系我们', href: '/contact' },
    { name: '隐私政策', href: '/privacy' },
    { name: '用户协议', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-xuan-dark border-t border-xuan-border">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-xuan-gold/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-chinese font-bold text-gradient-gold">易算</span>
            </Link>
            <p className="text-sm text-xuan-muted font-chinese mb-4">
              融合传统智慧与现代科技的东方玄学平台
            </p>
            <div className="flex space-x-4">
              {['微信', '微博', '知乎'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-xuan-border text-xuan-muted hover:text-xuan-gold hover:border-xuan-gold/50 transition-colors"
                >
                  <span className="text-xs">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-chinese font-bold text-xuan-gold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-xuan-muted hover:text-xuan-gold-light font-chinese transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-xuan-border flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-xuan-muted font-chinese">
            © 2024 易算. All rights reserved.
          </p>
          <p className="text-xs text-xuan-muted font-chinese mt-2 md:mt-0">
            仅供娱乐参考，不构成任何建议
          </p>
        </div>
      </div>
    </footer>
  );
}
