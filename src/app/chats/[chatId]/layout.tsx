import { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { Card } from "@nextui-org/card";
import { auth } from "@/auth";
import Sidebar from "./(sidebar)/Sidebar";

export default async function ChatLayout({
  params,
  children,
}: {
  params: { chatId: string };
  children: ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }

  const { chatId } = params;

  return (
    <>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4 lg:col-span-4">
          <Sidebar chatId={chatId} />
        </div>
        <div className="col-span-8 lg:col-span-8">
          <Card className="w-full h-[85vh] p-5 overflow-auto py-8">
            {children}
          </Card>
        </div>
      </div>
    </>
  );
}
