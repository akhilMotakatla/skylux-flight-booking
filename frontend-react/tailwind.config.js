/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: { DEFAULT: '#030712', 50: '#0d1117', 100: '#161b22', 200: '#1e2432' },
        electric: { DEFAULT: '#3b82f6', glow: 'rgba(59,130,246,0.4)' },
        violet: { DEFAULT: '#8b5cf6', glow: 'rgba(139,92,246,0.4)' },
        cyan: { DEFAULT: '#06b6d4', glow: 'rgba(6,182,212,0.4)' },
        gold: { DEFAULT: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
        rose: { neon: '#f43f5e' },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.3), transparent)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
        'glow-blue': 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)',
        'glow-purple': 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'marquee': 'marquee 30s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'counter': 'counter 2s ease-out forwards',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        'pulse-glow': {
          '0%,100%': { boxShadow: '0 0 20px rgba(59,130,246,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(59,130,246,0.6), 0 0 80px rgba(59,130,246,0.2)' },
        },
        'gradient-shift': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(59,130,246,0.3)',
        'glow': '0 0 30px rgba(59,130,246,0.4)',
        'glow-lg': '0 0 60px rgba(59,130,246,0.3), 0 0 120px rgba(139,92,246,0.2)',
        'glow-gold': '0 0 30px rgba(245,158,11,0.4)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        'card': '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
}
