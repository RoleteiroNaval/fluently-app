/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        accent: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
        },
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.7)',
          muted: 'rgba(255, 255, 255, 0.4)',
        }
      }
    },
  },
  plugins: [],
}
