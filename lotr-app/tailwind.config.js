/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#fdf6e3",
        ink: "#3a2f2f",
        wood: "#5c4b4b",
        "accent-green": "#4a5c47",
        "accent-red": "#8c4b4f",
        "accent-blue": "#5c7c8a",
      },
      fontFamily: {
        medieval: ["MedievalSharp", "serif"],
      },
    },
  },
  plugins: [],
};
