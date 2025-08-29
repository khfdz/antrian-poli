/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      primary: '#3B82F6',
      secondary: '#1D4ED8',
      light: '#EBF4FF',
      }
    },
  },
  plugins: [],
}