/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // 1. Define a custom font name (e.g., 'sans' is the Tailwind default for body text)
        // Ensure 'Poppins' matches the font name you imported in index.html
        sans: ["Poppins", "sans-serif"],
      },
    },
    plugins: [],
  },
};
