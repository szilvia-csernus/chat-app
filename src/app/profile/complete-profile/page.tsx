import React from "react";
import ProfileForm from "./CompleteProfileForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";



export default async function CompleteProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  
  return (
    <div className="flex items-center justify-center vertical-center">
      <ProfileForm session={session} />
    </div>
  );
}
