import { notFound } from "next/navigation";
import { getChat, getChatPartner } from "@/app/actions/chatActions";

import { mapChatDataToChatType } from "@/lib/maps";
import { getCurrentMember } from "@/app/actions/memberActions";
import { updateMessagesWithReadStatus } from "@/app/actions/messageActions";
import { authWithRedirect } from "@/app/actions/authActions";
import React from "react";
import { Card } from "@heroui/card";
import ChatThread from "./(main)/ChatThread";
import ChatForm from "./(main)/ChatForm";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  params,
}: {
  params: { chatId: string };
}) {
  await authWithRedirect();

  const currentMember = await getCurrentMember();
  if (!currentMember) return null; // layout.tsx handles the redirect

  // Update the messages in the database to be marked as read
  await updateMessagesWithReadStatus(params.chatId, currentMember.id);

  const chat = await getChat(params.chatId);

  if (!chat) return notFound();
  const initialChat = mapChatDataToChatType(chat);

  const chatPartner = await getChatPartner(chat.id);

  if (!chatPartner) return notFound();

  return (
    <>
      <Card className="w-full h-[85vh] p-5 overflow-auto py-3 border-1 border-gray-300 bg-background">
        <div className="flex flex-col justify-between">
          <ChatThread
            currentMember={currentMember}
            chatPartner={chatPartner}
            initialChat={initialChat}
          />

          <div className="flex items-center space-x-2">
            <ChatForm chatPartnerId={chatPartner.id} />
          </div>
        </div>
      </Card>
    </>
  );
}
