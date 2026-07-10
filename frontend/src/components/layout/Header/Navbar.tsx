'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: '首页', href: '/' },
  { name: '八字命理', href: '/bazi' },
  { name: '紫微斗数', href: '/ziwei' },
  { name: '姓名学', href: '/name' },
  { name: '六爻', href: '/divination/liuyao' },
  { name: '梅花易数', href: '/divination/meihua' },
  { name: '奇门遁甲', href: '/divination/qimen' },
  { name: '风水堪舆', href: '/fengshui' },
  { name: '择日', href: '/zeri' },
  { name: 'AI助手', href: '/ai-analysis' },
  { name: '知识库', href: '/knowledge' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-xuan-black/90 backdrop-blur-xl border-b border-xuan-gold/10 shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <span className="text-3xl lg:text-4xl font-chinese font-bold text-gradient-gold">
                  易算
                </span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-xuan-gold to-transparent"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="hidden sm:block text-xs text-xuan-muted font-chinese tracking-widest">
                东方智慧
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-chinese transition-colors duration-300 group ${
                    pathname === item.href
                      ? 'text-xuan-gold'
                      : 'text-xuan-silver hover:text-xuan-gold-light'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-xuan-gold transition-all duration-300 group-hover:w-3/4 ${
                      pathname === item.href ? 'w-3/4' : ''
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* User Center & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* User Center */}
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg border border-xuan-gold/30 text-xuan-gold hover:bg-xuan-gold/10 transition-all duration-300"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-sm font-chinese">用户中心</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg border border-xuan-border hover:border-xuan-gold/50 transition-colors"
              >
                <div className="flex flex-col space-y-1.5">
                  <span
                    className={`w-5 h-0.5 bg-xuan-gold transition-all duration-300 ${
                      isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                    }`}
                  />
                  <span
                    className={`w-5 h-0.5 bg-xuan-gold transition-all duration-300 ${
                      isMobileMenuOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`w-5 h-0.5 bg-xuan-gold transition-all duration-300 ${
                      isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-xuan-dark border-l border-xuan-gold/20 overflow-y-auto">
              <div className="p-6">
                {/* Mobile Logo */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-2xl font-chinese font-bold text-gradient-gold">
                    易算
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-xuan-border hover:border-xuan-gold/50 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-xuan-silver"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Mobile Nav Items */}
                <nav className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg font-chinese transition-all duration-300 ${
                          pathname === item.href
                            ? 'bg-xuan-gold/10 text-xuan-gold border-l-2 border-xuan-gold'
                            : 'text-xuan-silver hover:bg-xuan-card hover:text-xuan-gold-light'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile User Center */}
                <div className="mt-8 pt-6 border-t border-xuan-border">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-lg border border-xuan-gold/30 text-xuan-gold hover:bg-xuan-gold/10 transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-chinese">用户中心</span>
                  </Link>
                </div>

                {/* Decorative Element */}
                <div className="mt-8 flex justify-center">
                  <span className="text-6xl font-chinese text-xuan-gold/10">卦</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
