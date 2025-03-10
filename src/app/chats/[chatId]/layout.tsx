import { redirect } from "next/navigation";

import { authWithRedirect } from "@/app/actions/authActions";
import { getCurrentProfile } from "@/app/actions/profileActions";
import SidebarMobile from "./(sidebar)/SidebarMobile";
import SidebarDesktop from "./(sidebar)/SidebarDesktop";
import { ReactNode } from "react";


export default async function ChatPage({ children }: { children: ReactNode }) {
  await authWithRedirect();

  const currentProfile = await getCurrentProfile();
  if (!currentProfile) return redirect("/profile/complete-profile");

  return (
    <div className="w-full h-full sm:grid sm:grid-cols-12 sm:gap-1 mx-0 my-0 sm:my-1">
      <div className="bg-inherit min-w-md sm:hidden">
        <SidebarMobile />
      </div>
      <div className="hidden sm:flex sm:col-span-5">
        <SidebarDesktop />
      </div>
      <div className="w-full sm:col-span-7 relative">{children}</div>
    </div>
  );
}
