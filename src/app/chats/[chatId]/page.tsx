import { notFound } from "next/navigation";
import { getChat, getChatPartner } from "@/app/actions/chatActions";
import { getCurrentMember } from "@/app/actions/memberActions";
import { updateMessagesWithReadStatus } from "@/app/actions/messageActions";
import { authWithRedirect } from "@/app/actions/authActions";
import { Card } from "@heroui/card";
import ChatThread from "./(main)/ChatThread";
import ChatForm from "./(main)/ChatForm";
import CurrentChatPartner from "./(main)/CurrentChatPartner";

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
  await updateMessagesWithReadStatus(params.chatId);

  const chat = await getChat(params.chatId);
  if (!chat) return notFound();

  const chatPartner = await getChatPartner(chat.id);
  if (!chatPartner) return notFound();

  return (
    <Card className="w-full h-[85vh] border-1 border-gray-300 bg-background relative">
      <div className="sticky space-x-2">
        <CurrentChatPartner chatPartnerId={chatPartner.id} />
      </div>
      <div className="flex flex-col h-full my-2 overflow-scroll scrollbar-hide">
        <ChatThread
          currentMember={currentMember}
          chatPartner={chatPartner}
          initialChat={chat}
        />
      </div>
      <div className="sticky mx-2">
        <ChatForm />
      </div>
    </Card>
  );
}
