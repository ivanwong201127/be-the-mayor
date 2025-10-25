/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'map-land': 'var(--color-map-land)',
        'map-water': 'var(--color-map-water)',
        'map-city': 'var(--color-map-city)',
        'map-city-hover': 'var(--color-map-city-hover)',
        'map-selected': 'var(--color-map-selected)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
      },
      boxShadow: {
        'map-glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'city-glow': '0 0 15px rgba(239, 68, 68, 0.4)',
        'city-selected-glow': '0 0 15px rgba(16, 185, 129, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
