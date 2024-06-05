/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "inter": ["Inter", "sans-serif"],
      },
      colors: {
        "primary-clr": "#1E1F22",
        "secondary-clr": "#2B2D31",
        "tertiary-clr": "#868F98",
        "accent-clr": "#5865F2",
      },
    },
  },
  plugins: [],
};
