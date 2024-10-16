/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        24: "repeat(24, minmax(0, 1fr))", // 24 columnas
        16: "repeat(16, minmax(0, 1fr))", // 16 columnas
      },
    },
  },
  plugins: [],
};
