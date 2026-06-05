/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
        mono: ['"Cascadia Code"', '"Fira Code"', '"JetBrains Mono"', '"Consolas"', 'monospace'],
      },
    },
  },
  plugins: [],
};
