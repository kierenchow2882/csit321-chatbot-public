/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        blue: {
          50: '#f0f5ff',
          100: '#e0eaff',
          200: '#c0d4ff',
          300: '#9db7fe',
          400: '#7893fc',
          500: '#5a6ff9',
          600: '#4754ef',
          700: '#3a42d3',
          800: '#3239ab',
          900: '#2d3285',
          950: '#1e2057',
        },
      },
    },
  },
  plugins: [],
};