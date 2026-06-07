/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Linear/Stripe style neutral palette
        primary: '#18181b', // zinc-900
        secondary: '#f4f4f5', // zinc-100
        accent: '#2563eb', // blue-600
        border: '#e4e4e7', // zinc-200
        success: '#10b981', // emerald-500
        danger: '#ef4444', // red-500
        warning: '#f59e0b', // amber-500
      },
      borderRadius: {
        'xl': '16px',
        'lg': '12px',
        'md': '8px',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      },
      fontSize: {
        'xs': 'clamp(0.7rem, 0.65rem + 0.25vw, 0.8rem)',
        'sm': 'clamp(0.8rem, 0.75rem + 0.25vw, 0.95rem)',
        'base': 'clamp(0.95rem, 0.9rem + 0.25vw, 1.125rem)',
        'lg': 'clamp(1.1rem, 1rem + 0.5vw, 1.3rem)',
        'xl': 'clamp(1.2rem, 1.1rem + 0.5vw, 1.5rem)',
        '2xl': 'clamp(1.4rem, 1.2rem + 1vw, 1.8rem)',
        '3xl': 'clamp(1.75rem, 1.5rem + 1.25vw, 2.25rem)',
        '4xl': 'clamp(2rem, 1.5rem + 2.5vw, 3rem)',
        '5xl': 'clamp(2.5rem, 1.5rem + 5vw, 4rem)',
        '6xl': 'clamp(3rem, 2rem + 5vw, 5rem)',
      }
    },
  },
  plugins: [],
}
