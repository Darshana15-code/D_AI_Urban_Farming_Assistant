/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          50: '#fdfcf9',
          100: '#faf9f5',
          200: '#f4f2ea',
          300: '#eae7dc',
          400: '#d9d5c5',
        },
        forest: {
          50: '#f2f7f4',
          100: '#dfede4',
          200: '#bfdbc9',
          300: '#95c2a6',
          400: '#68a37f',
          500: '#468660',
          600: '#2f6345',
          700: '#234d35',
          800: '#1a3a28',
          900: '#142c1e',
          950: '#0a1710',
        },
        sage: {
          50: '#f5f8f5',
          100: '#e8f0e8',
          200: '#d4e2d4',
          300: '#b8ceb8',
          400: '#95b395',
          500: '#769876',
        },
        clay: {
          50: '#fbf6f3',
          100: '#f5eae4',
          200: '#ecd5c9',
          300: '#deb8a5',
          400: '#cb927a',
          500: '#ba7359',
          600: '#a85b41',
          700: '#8c4833',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(20, 44, 30, 0.04), 0 1px 3px -1px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 24px -4px rgba(20, 44, 30, 0.07), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 16px 40px -8px rgba(20, 44, 30, 0.12), 0 4px 16px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
