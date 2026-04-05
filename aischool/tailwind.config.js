/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./visualizadores.html",
    "./visualizadores/**/*.{js,ts,jsx,tsx}",
    "./js/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B1647",
        cyan: "#48E5E5",
      },
    },
  },
  plugins: [],
}
