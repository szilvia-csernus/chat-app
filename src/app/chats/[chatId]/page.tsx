import { notFound } from "next/navigation";
// import ChatForm from "./ChatForm";
import { getCurrentUserId } from "@/app/actions/authActions";
// import MessageThread from "./MessageThread";
import { getChat } from "@/app/actions/chatActions";
import { getCurrentProfile, getMemberById } from "@/app/actions/memberActions";


export default async function Chat({ params }: { params: { chatId: string } }) {
  const initialThreadMessages = await getChat(params.chatId);
  if (!initialThreadMessages) return notFound();

  const currentProfile = await getCurrentProfile();
  
  const chatPartner = await getMemberById(
    initialThreadMessages.profile1Id === currentProfile?.id
      ? initialThreadMessages.profile2Id
      : initialThreadMessages.profile1Id
  );

  return (
    <div className="flex flex-col gap-4">
      {/* <ChatThread
        chatThread={chatThread}
      /> */}
      {/* {chatPartner && (
        <div className="flex items-center space-x-2">
          <ChatForm otherPersonId={chatPartner.id} />
        </div>
      )} */}
    </div>
  );
}
