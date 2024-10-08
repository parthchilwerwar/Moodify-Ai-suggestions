/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          500: '#6366F1',
        },
        purple: {
          500: '#8B5CF6',
        },
        pink: {
          200: '#FBCFE8',
          500: '#EC4899',
          600: '#DB2777',
        },
        custompink: '#FD227A',
        'blue-neon': '#5546FF',
        'white-neon': '#FFFFFF',
        'neon-green': '#B4EB14',
      },
    },
  },
  plugins: [],
  
}

