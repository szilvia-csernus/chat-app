import React from "react";
import RecentChat from "./RecentChat";
import { useAppSelector } from "@/redux-store/hooks";
import { selectChatIds } from "@/redux-store/features/chatsSlice";


export default function RecentChatsList() {
  const chatIds = useAppSelector(selectChatIds); 

  return (
    <ul className="flex flex-col w-full overflow-hidden scrollbar-x-hide">
      {chatIds.map((id) => {
        return (
          <li key={id}>
            <RecentChat
              chatId={id}
            />
          </li>
        );
      })}
    </ul>
  );
}
