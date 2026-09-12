/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bd: {
          green: '#006a4e',
          'green-deep': '#00503b',
          'green-soft': '#e6f2ee',
          red: '#f42a41',
          ink: '#0f1d18',
          paper: '#f7faf8',
        },
      },
      fontFamily: {
        sans: ['"Hind Siliguri"', '"Noto Sans Bengali"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,64,46,.06), 0 8px 24px -12px rgba(0,64,46,.18)',
        lift: '0 2px 4px rgba(0,64,46,.08), 0 16px 40px -16px rgba(0,64,46,.28)',
      },
      maxWidth: {
        page: '72rem',
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'fade-up': 'fade-up .35s ease-out both',
      },
    },
  },
  plugins: [],
};
