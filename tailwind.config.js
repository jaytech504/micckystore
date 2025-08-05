/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,tx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    ".public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': "#FBB906",
        'button-pink': "#E866B7"
      }
    },
  },
  plugins: [],
}