import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        xuan: {
          black: '#0a0a0f',
          dark: '#12121a',
          card: '#1a1a24',
          border: '#2a2a3a',
          gold: '#d4a853',
          'gold-light': '#e8c97a',
          'gold-dark': '#b8922e',
          'gold-muted': 'rgba(212, 168, 83, 0.15)',
          red: '#c45c4a',
          cyan: '#5ca8c4',
          jade: '#5ca87a',
          silver: '#9ca3af',
          muted: '#6b7280',
        },
        primary: {
          50: '#fdf8eb',
          100: '#faefd0',
          200: '#f5dda1',
          300: '#efc868',
          400: '#e8b23d',
          500: '#d4a853',
          600: '#b8922e',
          700: '#9a7624',
          800: '#7d5e20',
          900: '#674e1e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        chinese: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        display: ['"Noto Serif SC"', '"Ma Shan Zheng"', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'ink-gradient': 'linear-gradient(180deg, rgba(10,10,15,0) 0%, rgba(10,10,15,0.8) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4a853 0%, #e8c97a 50%, #d4a853 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 168, 83, 0.3)',
        'gold-lg': '0 0 40px rgba(212, 168, 83, 0.4)',
        'gold-sm': '0 0 10px rgba(212, 168, 83, 0.2)',
        'inner-gold': 'inset 0 0 20px rgba(212, 168, 83, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'ink-drop': 'inkDrop 1.5s ease-out forwards',
        'bagua-rotate': 'baguaRotate 30s linear infinite',
        'star-twinkle': 'starTwinkle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 168, 83, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 168, 83, 0.6)' },
        },
        inkDrop: {
          '0%': { transform: 'scale(0)', opacity: '0.8' },
          '50%': { opacity: '0.4' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        baguaRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        starTwinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
