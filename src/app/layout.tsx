import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import MainNav from "@/components/navbar/MainNav";


export const metadata: Metadata = {
  title: "Next.js Auth.js Prisma Template",
  description:
    "A template for Next.js, TypeScript, Tailwind CSS and Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body h-screen">
        <Providers>
          <MainNav />
          <main className="container mx-auto p-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
