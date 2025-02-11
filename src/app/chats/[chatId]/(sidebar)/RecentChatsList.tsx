import React from "react";
import RecentChat from "./RecentChat";
import { useAppSelector } from "@/redux-store/hooks";
import { selectRecentChats } from "@/redux-store/features/recentChatsSlice";
import { selectCurrentChat } from "@/redux-store/features/currentChatSlice";


type Props = {
  currentMemberId: string;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (isOpen: boolean) => void;
};

export default function RecentChatsList({ currentMemberId, isSidebarOpen, setIsSidebarOpen }: Props) {
  const recentChats = useAppSelector(selectRecentChats);
  const currentChat = useAppSelector(selectCurrentChat);

  return (
    <ul className="flex flex-col w-full">
      {recentChats.map((rc) => {
        const chatPartner = rc.participants.filter((p) => p.id !== currentMemberId)[0];
        const msgCount = currentChat?.id === rc.id ? 0 : rc.unreadMessageCount;
        return (
          <li key={rc.id}>
            <RecentChat
              chatId={rc.id}
              chatPartner={chatPartner}
              lastMessage={rc.lastMessage}
              unreadMessageCount={msgCount}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </li>
        );
      })}
    </ul>
  );
}
