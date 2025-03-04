import React from "react";
import PresenceDot from "@/components/PresenceDot";
import MemberImage from "@/app/members/MemberImage";
import { Member, SerializedMessage } from "@/types";
// import { selectMembersOnline } from "@/redux-store/features/presenceSlice";
import RecentChatFrame from "./RecentChatFrame";
import { useAppSelector } from "@/redux-store/hooks";
import { IoIosArrowForward } from "react-icons/io";
import { selectMemberById, selectMemberOnlineStatus } from "@/redux-store/features/membersSlice";
import { selectChatById } from "@/redux-store/features/chatsSlice";
import { selectMessageById } from "@/redux-store/features/messagesSlice";

type Props = {
  chatId: string;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (isOpen: boolean) => void;
};

export default function RecentChat({
  chatId,
  isSidebarOpen,
  setIsSidebarOpen,
}: Props) {

  const chat = useAppSelector((state) => selectChatById(state, chatId));
  const { chatPartnerId, messageIds = [], unreadMessageCount } = chat;
  const lastMessageId = messageIds[messageIds.length - 1];
  const lastMessage = useAppSelector((messagesState) => selectMessageById(messagesState, lastMessageId)?.content);
  const chatPartner = useAppSelector(
    state => selectMemberById(state, chatPartnerId)
  );
  const online = useAppSelector(state => selectMemberOnlineStatus(state, chatPartnerId));
  const trimmedLastMessage =
    (lastMessage && lastMessage.length > 25) ? `${lastMessage.slice(0, 25)}...` : lastMessage;

  return (
    <RecentChatFrame
      chatId={chatId}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    >
      <div className="flex items-center">
        <div className="m-2 rounded-full border-2 border-slate-500 overflow-hidden">
          <MemberImage
            memberImage={
              chatPartner.image ? chatPartner.image : "/images/user.png"
            }
            memberName={chatPartner.name ? chatPartner.name : ""}
            width={50}
            height={50}
          />
          {online && (
            <div className="absolute top-9 left-11 z-20">
              <PresenceDot />
            </div>
          )}
          {chatPartner.deleted && (
            <div className="absolute bottom-[2px] left-3 z-20 bg-gray-400 dark:bg-gray-600 px-1 text-[10px] border-1 rounded-full ">
              Deleted
            </div>
          )}
        </div>
        <div className="flex flex-col text-gray-800 dark:text-white pr-8">
          <div>{chatPartner.deleted ? "Deleted User" : chatPartner.name}</div>
          <div className="text-xs text-gray-400 min-w-full">
            {trimmedLastMessage || "No message to show"}
            {unreadMessageCount > 0 && (
              <div className="absolute bottom-6 right-[30px] sm:right-[10px] bg-secondary rounded-full text-white text-xs w-5 h-5 flex items-center justify-center">
                {unreadMessageCount}
              </div>
            )}
          </div>
        </div>
      </div>
      <IoIosArrowForward
        className="sm:hidden ml-2 justify-self-end text-slate-500 dark:text-slate-400"
        size={30}
      />
    </RecentChatFrame>
  );
}
