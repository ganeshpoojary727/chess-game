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
        terracotta: {
          DEFAULT: '#C05342',
          dark: '#A43F30',
          light: '#DE705F',
          50: '#FDF6F5',
          100: '#FBECE9',
          200: '#F5D3CD',
          300: '#EEB1A7',
          400: '#DE705F',
          500: '#C05342',
          600: '#A43F30',
          700: '#7E2F23',
          800: '#561E16',
          900: '#320E09',
        },
        ivory: {
          DEFAULT: '#F5F2EB',
          muted: '#EAE5DB',
          card: '#FAF8F5',
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F5F2EB',
          300: '#EAE5DB',
          400: '#D6CEBE',
          500: '#BCB19C',
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
        serif: ['"Playfair Display"', 'Cinzel', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Cinzel', 'serif'],
        sans: ['Inter', 'Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
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
