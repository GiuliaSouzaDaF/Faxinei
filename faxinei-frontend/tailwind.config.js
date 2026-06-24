/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'faxinei-branco': '#FFFFFF',
        'faxinei-ciano': '#00BCD4',     
        'faxinei-verde-agua': '#48D1CC' 
      }
    },
  },
  plugins: [],
}