import React from "react";
import Chat from "./(main)/Chat";

export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{ chatId: string }>;
};

export default async function ChatsPage({ params }: Params) {
  const { chatId } = await params;

  return (
    <div className="w-full sm:col-span-7 relative">  
        <Chat chatId={chatId}/>
    </div>
  );
}
