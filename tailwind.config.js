/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui"],
      },
      colors: {
        brand: {
          50: "#f4f8ff",
          100: "#dbe9ff",
          500: "#2f6bff",
          600: "#1f54d4",
          700: "#173f9f",
        },
      },
      boxShadow: {
        panel: "0 10px 30px rgba(31, 84, 212, 0.12)",
      },
    },
  },
  plugins: [],
};
