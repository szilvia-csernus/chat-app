import React from "react";
import LoginForm from "./LoginForm";
import Footer from "@/components/Footer";

export default async function LoginPage() {
  return (
    <div className="w-full h-full flex flex-col justify-strech">
      <div className="h-full min-h-[calc(100dvh-160px)] flex items-center justify-center vertical-center">
        <LoginForm />
      </div>
      <Footer />
    </div>
  );
}
