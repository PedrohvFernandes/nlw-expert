/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    // "./src/**/*.{js,jsx,ts,tsx}",
    './src/**/*.tsx'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
