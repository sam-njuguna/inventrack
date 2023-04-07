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
    boxShadow: {
      fade: "rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px;",
    },
  },
  plugins: [],
};
