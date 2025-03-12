import React from "react";
import Chat from "./(main)/Chat";
import { getChat } from "@/app/actions/chatActions";
import { updateMessagesWithReadStatus } from "@/app/actions/messageActions";
import { RawChatData } from "@/types";

export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{ chatId: string }>;
};

export default async function ChatsPage({ params }: Params) {
  const { chatId } = await params;

  let initialChat: RawChatData | null = null;
  
  // Update the messages in the database to be marked as read
  if (chatId) {
    await updateMessagesWithReadStatus(chatId );
    initialChat = await getChat(chatId);
  }

  return (
    <div className="w-full sm:col-span-7 relative">
      <Chat initialChat={initialChat} />
    </div>
  );
}
