import React, { useMemo } from "react";
import { Member, RecentChat as RecentChatType } from "@/types";
import RecentChat from "./RecentChat";
import { Profile } from "@prisma/client";


type Props = {
  recentChats: RecentChatType[];
  currentProfileId: string;
  membersOnline: string[];
};

export default function RecentChatsList({
  recentChats,
  currentProfileId,
  membersOnline,
}: Props) {

  return (
    <ul className="flex flex-col gap-1 w-full ">
      {recentChats.map((rc) => {
        const chatPartner = currentProfileId === rc.participant1.id ? rc.participant2 : rc.participant1;
        return (
          <li key={rc.id}>
          <RecentChat
            chatId={rc.id}
            chatPartner={chatPartner}
            lastMessage={rc.lastMessage}
            unreadMessages={rc.unreadMessages}
            membersOnline={membersOnline}
          />
          </li>
        );
      })}
    </ul>
  );
};
