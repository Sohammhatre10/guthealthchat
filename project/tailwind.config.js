/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'good-bug': {
          'cream': '#FDF6E3',
          'warm-beige': '#F5E6D3',
          'sage': '#9CAF88',
          'forest': '#4A5D23',
          'terracotta': '#D4A574',
          'brown': '#8B4513',
          'dark-green': '#2D3E0F',
        },
        'primary': {
          50: '#FDF6E3',
          100: '#F5E6D3',
          200: '#E8D4B8',
          300: '#D4A574',
          400: '#9CAF88',
          500: '#4A5D23',
          600: '#3D4F1D',
          700: '#2D3E0F',
          800: '#1F2B0A',
          900: '#141A06',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideUp: 'slideUp 0.4s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};