import React from "react";
import Sidebar from "./(sidebar)/Sidebar";
import { getCurrentMember } from "@/app/actions/memberActions";
import { redirect } from "next/navigation";


export default async function ChatPageLayout({children}: {children: React.ReactNode}) {

  const currentMember = await getCurrentMember();
  if (!currentMember) return redirect("/profile/complete-profile");

  return (
    <div className="grid grid-cols-12 gap-1 h-[85vh]">
      <div className="col-span-5 lg:col-span-4">
        <Sidebar currentMemberId={currentMember.id} />
      </div>
      <div className="col-span-7 lg:col-span-8">{children}</div>
    </div>
  );
}
