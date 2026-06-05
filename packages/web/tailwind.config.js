/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sakura: {
          50: '#FFF5F7', 100: '#FFF0F3', 200: '#FBE8ED', 300: '#FAD1DD',
          400: '#F08CAE', 500: '#E8789B', 600: '#D4687C',
        },
        ocean: {
          50: '#E8EDF5', 100: '#A0B4D0', 200: '#6B7D95',
          800: '#1A3A5C', 900: '#0F1F38', 950: '#0A1628',
        },
        forest: {
          50: '#F5F7F2', 100: '#EEF2E9', 200: '#D4E8D0',
          400: '#8CB88A', 500: '#5B8C5A', 600: '#2E5E2E',
        },
        sunset: {
          50: '#FFF8F3', 100: '#FFF3EB', 200: '#FFD4C0',
          400: '#FF7B42', 500: '#F06830', 600: '#E05A2B',
        },
      },
      fontFamily: {
        heading: ['"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
        body: ['"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
        mono: ['"Cascadia Code"', '"Fira Code"', '"JetBrains Mono"', '"Consolas"', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-15deg)' },
          '50%': { transform: 'translateY(-15px) rotate(-12deg)' },
        },
      },
    },
  },
  plugins: [],
};
