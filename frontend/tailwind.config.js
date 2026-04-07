/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Emerald Green base
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b', // Base text and dark elements
          900: '#0f172a',
          950: '#020617',
        },
        // Brand colors
        brand: {
          primary: '#274e79',
          'primary-dark': '#1a3b5c',
          light: '#f0f4f8',
        },
        // Midnight palette for dark mode - Deep, premium aesthetic
        midnight: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
          950: '#0f172a', // Main dark background - Deep space
          card: '#1e293b', // Card background - Premium dark slate
          'card-hover': '#2d3d4f', // Card hover state
          border: '#334155', // Border color for dark mode
          'border-light': '#475569', // Light border for accents
          text: '#e2e8f0', // Text color for dark mode
          'text-secondary': '#cbd5e1', // Secondary text
        }
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        // Enhanced Glassmorphism shadows
        'glass-sm': '0 8px 32px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'glass-md': '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'glass-lg': '0 15px 35px 0 rgba(31, 38, 135, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'glass-xl': '0 25px 50px -12px rgba(31, 38, 135, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        // Glow effects
        'glow': '0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2)',
        'glow-dark': '0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.15)',
        'glow-lg': '0 0 30px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.25)',
        // Floating card shadow
        'card-float': '0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.12)',
        'card-float-hover': '0 30px 40px -10px rgb(0 0 0 / 0.2), 0 12px 15px -8px rgb(0 0 0 / 0.15)',
      },
      backdropFilter: {
        'glass': 'blur(20px)',
        'glass-sm': 'blur(10px)',
        'glass-xl': 'blur(30px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      transitionDuration: {
        '500': '500ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [],
};
