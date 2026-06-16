/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        dark: {
          900: '#030712',
          800: '#0b0f19',
          700: '#111827',
          600: '#1f2937',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass-sm': '0 2px 8px 0 rgba(31, 38, 135, 0.08)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        'glass-lg': '0 12px 40px 0 rgba(31, 38, 135, 0.3)',
      },
      backdropBlur: {
        'glass': '8px',
        'glass-lg': '16px',
      }
    },
  },
  plugins: [],
}
