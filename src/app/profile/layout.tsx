import React from "react";
import Footer from "@/components/Footer";

export default async function ProfilePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col justify-strech">
      <div className="h-full min-h-[calc(100dvh-160px)] md:border-1 border-slate-300 dark:border-slate-700 bg-zig-zag flex flex-grow w-full md:my-2 items-center md:items-start justify-center">
        {children}
      </div>
      <Footer />
    </div>
  );
}
