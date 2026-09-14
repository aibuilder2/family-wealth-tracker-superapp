/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#10263A',
          light: '#173248',
          dark: '#0B1B28',
        },
        paper: {
          DEFAULT: '#FBF8F2',
          dim: '#F1ECE0',
          dark: '#E9E2D0',
          muted: '#E7E1D2',
        },
        gold: {
          DEFAULT: '#B98B2A',
          soft: '#E4C77E',
          dark: '#916b1e',
        },
        green: {
          DEFAULT: '#4C7A5E',
          soft: '#E8F2EC',
        },
        coral: {
          DEFAULT: '#C1502E',
          soft: '#FBECE8',
        },
        ink: {
          DEFAULT: '#1B2A33',
          muted: '#6B7A80',
        }
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Fraunces', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
