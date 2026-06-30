/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif SC"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        invoice: {
          paper: '#fafaf9',
          ink: '#1c1917',
          muted: '#78716c',
          border: '#e7e5e4',
          accent: '#4f46e5',
          accentLight: '#e0e7ff',
          warning: '#f59e0b',
          success: '#10b981',
          danger: '#f43f5e',
          stamp: '#dc2626',
        },
      },
      boxShadow: {
        paper: '0 1px 3px rgba(0,0,0,0.08), 0 10px 30px -5px rgba(0,0,0,0.1)',
        float: '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 20px -3px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
