import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";


const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // fontFamily: {
      //   nunito: ["var(--font-nunito)", "sans-serif"], // doesn't work
      // },
      backgroundImage: {
        "dark-gradient": "linear-gradient(to top, rgba(0,0,0,1), transparent)",
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
  // darkMode: "class",
  plugins: [
    heroui({
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
            secondary: "#5f88cc",
            default: "#ededed", // foreground
          },
        },
      },
    }),
  ],
};
export default config;
