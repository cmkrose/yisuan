'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const baguaSymbols = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars.length = 0;
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.0005 + 0.0002,
        });
      }
    };

    const drawStars = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.speed) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 168, 83, ${star.opacity * twinkle})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(drawStars);
    };

    resize();
    createStars();
    animationId = requestAnimationFrame(drawStars);

    window.addEventListener('resize', () => {
      resize();
      createStars();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-xuan-black via-xuan-dark to-xuan-black" />

      {/* Star Field */}
      <StarField />

      {/* Bagua Circle - Outer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute w-[600px] h-[600px] lg:w-[800px] lg:h-[800px]"
      >
        <div className="absolute inset-0 border border-xuan-gold/20 rounded-full" />
        <div className="absolute inset-4 border border-xuan-gold/15 rounded-full" />
        <div className="absolute inset-8 border border-xuan-gold/10 rounded-full" />

        {/* Bagua Symbols */}
        {baguaSymbols.map((symbol, index) => {
          const angle = (index * 45 - 90) * (Math.PI / 180);
          const radius = 280;
          const x = Math.cos(angle) * radius + 300;
          const y = Math.sin(angle) * radius + 300;

          return (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="absolute text-3xl lg:text-4xl text-xuan-gold/60 font-chinese"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {symbol}
            </motion.span>
          );
        })}
      </motion.div>

      {/* Bagua Circle - Inner Rotating */}
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.2, rotate: 360 }}
        transition={{
          opacity: { duration: 2, ease: 'easeOut' },
          rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
        }}
        className="absolute w-[400px] h-[400px] lg:w-[500px] lg:h-[500px]"
      >
        <div className="absolute inset-0 border-2 border-xuan-gold/30 rounded-full" />
        <div className="absolute inset-2 border border-xuan-gold/20 rounded-full border-dashed" />

        {/* Bagua Center Symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl lg:text-9xl text-xuan-gold/30 font-chinese">☯</span>
        </div>
      </motion.div>

      {/* Ink Wash Effect - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-xuan-black via-xuan-black/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-2 text-xs sm:text-sm font-chinese tracking-[0.3em] text-xuan-gold/80 border border-xuan-gold/20 rounded-full bg-xuan-gold/5">
            东方智慧 · 古老传承
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-chinese font-bold mb-6 leading-tight"
        >
          <span className="text-gradient-gold">探索东方智慧</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-xl sm:text-2xl md:text-3xl font-chinese text-xuan-silver/80 mb-8"
        >
          连接传统文化与现代AI
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-base sm:text-lg text-xuan-muted max-w-2xl mx-auto mb-12 font-chinese leading-relaxed"
        >
          融合千年命理智慧与前沿人工智能技术，
          <br className="hidden sm:block" />
          为您提供专业、精准的东方玄学分析服务
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/bazi" className="btn-gold text-base sm:text-lg px-8 py-4 font-chinese">
            开始探索
          </Link>
          <Link
            href="/knowledge"
            className="btn-outline-gold text-base sm:text-lg px-8 py-4 font-chinese"
          >
            了解更多
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: '10万+', label: '用户信赖' },
            { value: '100万+', label: '分析次数' },
            { value: '99.9%', label: '准确率' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-xuan-gold font-chinese">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-xuan-muted font-chinese mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center"
        >
          <span className="text-xs text-xuan-muted font-chinese mb-2">向下滚动</span>
          <svg
            className="w-6 h-6 text-xuan-gold/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}


