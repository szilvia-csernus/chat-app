import { notFound, redirect } from "next/navigation";
import { getChat } from "@/app/actions/chatActions";
import { updateMessagesWithReadStatus } from "@/app/actions/messageActions";
import { authWithRedirect } from "@/app/actions/authActions";
import Chats from "./Chats";
import { getCurrentProfile } from "@/app/actions/profileActions";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  await authWithRedirect();

  const searchParams = await params;
  const chatId = searchParams.chatId;
  console.log("Chat ID", chatId);

  const currentProfile = await getCurrentProfile();
  if (!currentProfile) return redirect("/profile/complete-profile");

  // Update the messages in the database to be marked as read
  await updateMessagesWithReadStatus(chatId);

  const initialChat = await getChat(chatId);
  if (!initialChat) return notFound();


  return (
    <Chats
      initialChat={initialChat}
    />
  );
}
