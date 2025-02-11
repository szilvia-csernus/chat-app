import { notFound, redirect } from "next/navigation";
import { getChat, getChatPartner } from "@/app/actions/chatActions";
import { getCurrentMember } from "@/app/actions/memberActions";
import { updateMessagesWithReadStatus } from "@/app/actions/messageActions";
import { authWithRedirect } from "@/app/actions/authActions";
import Chats from "./Chats";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  params,
}: {
  params: { chatId: string };
}) {
  await authWithRedirect();

  const currentMember = await getCurrentMember();
  if (!currentMember) return redirect("/profile/complete-profile");

  // Update the messages in the database to be marked as read
  await updateMessagesWithReadStatus(params.chatId);

  const initialChat = await getChat(params.chatId);
  if (!initialChat) return notFound();

  const chatPartner = await getChatPartner(initialChat.id);
  if (!chatPartner) return notFound();

  return (
    <Chats
      chatPartner={chatPartner}
      currentMember={currentMember}
      initialChat={initialChat}
    />
  );
}
