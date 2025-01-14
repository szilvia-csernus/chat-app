import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      title: ['"Oswald"', "sans-serif"],
      body: ['"Nunito"', "sans-serif"],
    },
    extend: {
      backgroundImage: {
        "dark-gradient":
          "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#64748b", // slate-500
        secondary: "#0f766e", // teal-700
        accent: "#fdba74", // orange-300
        success: "#2dd4bf", // teal-400
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: "#64748b",
            secondary: "#0f766e",
            default: "#020617", // foreground
          },
        },
        dark: {
          colors: {
            primary: "#64748b",
            secondary: "#0f766e",
            default: "#ededed", // foreground
          },
        },
      },
    }),
  ],
};
export default config;
