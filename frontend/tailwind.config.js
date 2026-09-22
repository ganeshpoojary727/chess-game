/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c9a86a',
          light: '#e0c897',
          dark: '#9f7d41',
          50: '#fbf8f0',
          100: '#f6f0dd',
          200: '#eddcb7',
          300: '#e0c897',
          400: '#c9a86a',
          500: '#b89454',
          600: '#9f7d41',
          700: '#7d6033',
          800: '#5c4527',
          900: '#3d2e1c',
        },
        checkmate: {
          bg: '#0a0a0d',
          surface: '#111114',
          elevated: '#16161b',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(201, 168, 106, 0.35)',
          text: '#f5f5f7',
          muted: '#8e8e93',
        },
        terracotta: {
          DEFAULT: '#C05342',
          dark: '#A43F30',
          light: '#DE705F',
        },
        ivory: {
          DEFAULT: '#F5F2EB',
          muted: '#EAE5DB',
          card: '#FAF8F5',
        },
        ebony: {
          DEFAULT: '#18181B',
          elevated: '#27272A',
          border: '#3F3F46',
          surface: '#121214',
          950: '#09090B',
        },
        board: {
          light: "#ebecd0",
          dark: "#779556",
          highlight: "rgba(255, 255, 0, 0.4)",
          danger: "rgba(239, 68, 68, 0.55)",
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Cinzel', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        sans: ['Inter', 'Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 35s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
};
