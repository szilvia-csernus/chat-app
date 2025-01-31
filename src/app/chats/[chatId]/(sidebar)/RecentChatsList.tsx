import React from "react";
import RecentChat from "./RecentChat";
import { useRecentChatsStore } from "@/hooks/zustand-stores/useRecentChatsStore";
import { useCurrentChatStore } from "@/hooks/zustand-stores/useCurrentChatStore";

type Props = {
  currentMemberId: string;
};

export default function RecentChatsList({ currentMemberId }: Props) {
  const recentChats = useRecentChatsStore((state) => state.recentChats);
  const currentChat = useCurrentChatStore((state) => state.chat);

  return (
    <ul className="flex flex-col gap-1 w-full ">
      {recentChats.map((rc) => {
        const chatPartner =
          currentMemberId === rc.participant1.id
            ? rc.participant2
            : rc.participant1;
        const msgCount = currentChat?.id === rc.id ? 0 : rc.unreadMessageCount;
        return (
          <li key={rc.id}>
            <RecentChat
              chatId={rc.id}
              chatPartner={chatPartner}
              lastMessage={rc.lastMessage}
              unreadMessageCount={msgCount}
            />
          </li>
        );
      })}
    </ul>
  );
}
