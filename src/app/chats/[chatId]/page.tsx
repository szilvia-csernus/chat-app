import { notFound, redirect } from "next/navigation";
import ChatForm from "./(main)/ChatForm";
import { getChat } from "@/app/actions/chatActions";
import ChatThread from "./(main)/ChatThread";
import { mapChatDataToChatType } from "@/lib/utils";
import { getCurrentMember, getMemberById } from "@/app/actions/memberActions";
import { updateMessagesWithReadStatus } from "@/app/actions/messageActions";
import { authWithRedirect } from "@/app/actions/authActions";

export const dynamic = "force-dynamic";

export default async function Chat({ params }: { params: { chatId: string } }) {
  await authWithRedirect();

  const currentMember = await getCurrentMember();
  if (!currentMember) return redirect("/profile/complete-profile");

  await updateMessagesWithReadStatus(params.chatId, currentMember.id);

  const chat = await getChat(params.chatId);

  if (!chat) return notFound();
  const initialChat = mapChatDataToChatType(chat);

  const chatPartnerId =
    chat.profile1Id === currentMember.id ? chat.profile2Id : chat.profile1Id;

  const chatPartner = await getMemberById(chatPartnerId);
  if (!chatPartner) return notFound();

  return (
    <div className="flex flex-col justify-between">
      <ChatThread
        initialChat={initialChat}
        currentMember={currentMember}
        chatPartner={chatPartner}
      />

      <div className="flex items-center space-x-2">
        <ChatForm chatPartnerId={chatPartnerId} />
      </div>
    </div>
  );
}
