import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6EF",
        brew: {
          50: "#FBF6EF",
          100: "#F1E4D3",
          200: "#E4CDA8",
          500: "#8A6642",
          600: "#6B4E32",
          700: "#5B3A22",
          900: "#3B2A1A",
        },
        accent: {
          DEFAULT: "#C2410C",
          light: "#F97316",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"PingFang TC"',
          '"Microsoft JhengHei"',
          '"Noto Sans TC"',
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
