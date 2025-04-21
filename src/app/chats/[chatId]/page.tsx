import React from "react";
import Chat from "./(main)/Chat";
import { getChatPartnerLastActiveByChatId } from "@/app/actions/memberActions";

export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{ chatId: string }>;
};

export default async function ChatsPage({ params }: Params) {
  const { chatId } = await params;
  const chatPartnerLastActive = await getChatPartnerLastActiveByChatId(chatId);

  return (
    <div className="w-full sm:col-span-7 relative">  
        <Chat chatId={chatId} chatPartnerLastActive={chatPartnerLastActive}/>
    </div>
  );
}
