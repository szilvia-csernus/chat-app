import React from "react";
import LoginForm from "./LoginForm";
import Footer from "@/components/Footer";

export default async function LoginPage() {
  return (
    <div className="w-full min-h-[calc(100dvh-80px)] flex flex-col justify-strech">
      <div
        className="min-h-[calc(100dvh-160px)] md:min-h-[calc(100dvh-176px)] md:border-1 border-slate-300 dark:border-slate-800 
      bg-zig-zag flex flex-grow w-full md:my-2 items-center justify-center vertical-center"
      >
        <LoginForm />
      </div>
      <Footer />
    </div>
  );
}
