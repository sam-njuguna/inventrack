/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    borderColor: {
      bd: "#ccc",
    },
    backgroundColor: {
      bg: "#fdfdfdb2",
      hov: "#dddbdb36",
      bg_light: "#f0f0f085",
      bg_light_var: "#f7f7f7",
      bg_var: "#dddbdb79",
    },
  },
  plugins: [],
};
