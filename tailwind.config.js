/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      keyframes: {
        'cb-enter': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'cb-pulse': { '50%': { opacity: '.55' } },
        'cb-step-in': { from: { boxShadow: '0 0 0 0 #eff6ff' }, to: { boxShadow: '0 0 0 5px #eff6ff' } },
        'cb-line-in': { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      boxShadow: {
        soft: '0 4px 14px rgba(15, 23, 42, 0.03)',
        card: '0 4px 14px rgba(15, 23, 42, 0.04)',
        cardHover: '0 10px 30px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
}