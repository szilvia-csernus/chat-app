import React from "react";
import RecentChat from "./RecentChat";
import { useAppSelector } from "@/redux-store/hooks";
// import { selectRecentChats } from "@/redux-store/features/recentChatsSlice";
// import { selectCurrentChat } from "@/redux-store/features/currentChatSlice";
import { selectMemberById } from "@/redux-store/features/membersSlice";
import { selectChatIds, selectChats, selectCurrentChatId } from "@/redux-store/features/chatsSlice";


type Props = {
  setIsSidebarOpen?: (isOpen: boolean) => void;
};

export default function RecentChatsList({ setIsSidebarOpen }: Props) {
  const chatIds = useAppSelector(selectChatIds); 

  return (
    <ul className="flex flex-col w-full overflow-hidden scrollbar-hide">
      {chatIds.map((id) => {
        return (
          <li key={id}>
            <RecentChat
              chatId={id}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </li>
        );
      })}
    </ul>
  );
}
