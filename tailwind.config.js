/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          1: '#000000',
          2: '#09090A',
          3: '#101012',
          4: '#1F1F22',
        },
        light: {
          1: '#FFFFFF',
          2: '#EFEFEF',
          3: '#7878A3',
          4: '#5C5C7B',
        },
        primary: {
          500: '#877EFF',
          600: '#5D5FEF',
        },
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}