import { notFound, redirect } from "next/navigation";
import ChatForm from "./(main)/ChatForm";
import { getChat } from "@/app/actions/chatActions";
import ChatThread from "./(main)/ChatThread";
import { mapChatDataToChatType } from "@/lib/utils";
import { getCurrentMember, getMemberById } from "@/app/actions/memberActions";

export default async function Chat({ params }: { params: { chatId: string } }) {
  const chat = await getChat(params.chatId);
  if (!chat) return notFound();
  const currentChat = mapChatDataToChatType(chat);

  const currentMember = await getCurrentMember();
  if (!currentMember) return redirect("/complete-profile");
  const chatPartnerId =
    chat.profile1Id === currentMember.id ? chat.profile2Id : chat.profile1Id;

  const chatPartner = await getMemberById(chatPartnerId);
  if (!chatPartner) return notFound();

  return (
    <div className="flex flex-col justify-between h-full">
      <ChatThread
        currentChat={currentChat}
        currentMember={currentMember}
        chatPartner={chatPartner}
      />

      <div className="flex items-center space-x-2">
        <ChatForm chatPartnerId={chatPartnerId} />
      </div>
    </div>
  );
}
