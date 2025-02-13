import { Nunito } from "next/font/google";


// Google font (variable font, as recommended in the Next.js docs)
export const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  // variable: "--font-nunito"  // This would be for tailwind config but it didn't work
});
