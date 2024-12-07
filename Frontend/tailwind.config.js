/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'city-img':"url('images/city.jpg')",
        'street-img':"url('images/street.jpg')",
      }
    },
  },
  plugins: [],
}

