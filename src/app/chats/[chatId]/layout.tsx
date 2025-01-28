import { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { Card } from "@heroui/card";
import { auth } from "@/auth";
import Sidebar from "./(sidebar)/Sidebar";
import { getCurrentProfileId } from "@/app/actions/profileActions";

export default async function ChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }

  const currentProfileId = await getCurrentProfileId();
  if (!currentProfileId) return redirect("/profile/complete-profile");

  return (
    <div className="grid grid-cols-12 gap-1">
      <div className="col-span-5 lg:col-span-4">
        <Sidebar currentProfileId={currentProfileId} />
      </div>
      <div className="col-span-7 lg:col-span-8">
        <Card className="w-full h-[85vh] p-5 overflow-auto py-3 border-1 border-gray-300 bg-background">
          {children}
        </Card>
      </div>
    </div>
  );
}
