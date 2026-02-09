import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bbdaff",
          300: "#8cc2ff",
          400: "#559fff",
          500: "#2e78ff",
          600: "#1757f5",
          700: "#1043e1",
          800: "#1336b6",
          900: "#16338f",
          950: "#122057",
        },
      },
    },
  },
  plugins: [],
};
export default config;
