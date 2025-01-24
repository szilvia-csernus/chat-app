import React, { Suspense } from "react";
import PresenceDot from "@/components/PresenceDot";
import MemberImage from "@/app/members/MemberImage";
import { Member } from "@/types";

import RecentChatFallback from "./RecentChatFallback";
import RecentChatFrame from "./RecentChatFrame";

type Props = {
  chatId: string;
  chatPartner: Member;
  lastMessage: string;
  unreadMessages: number;
  membersOnline: string[];
};

export default function RecentChat({
  chatId,
  chatPartner,
  lastMessage,
  unreadMessages,
  membersOnline,
}: Props) {
  const online = membersOnline.includes(chatPartner.id);
  const message = lastMessage.length > 15 ? `${lastMessage.slice(0, 7)}...` : lastMessage;

  return (
    <Suspense fallback={<RecentChatFallback />}>
      <RecentChatFrame
        chatId={chatId}
      >
        <div className="m-2 rounded-full border-2 border-slate-500 overflow-hidden">
          <MemberImage
            memberImage={chatPartner.image ? chatPartner.image : ""}
            memberName={chatPartner.name ? chatPartner.name : ""}
            width={50}
            height={50}
          />
          {online && (
            <div className="absolute top-9 left-11 z-20">
              <PresenceDot outlineColor="white" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <div>{chatPartner.name}</div>
          <div className="text-xs text-gray-500 min-w-full relative">
            {message || "No messages yet"}
            {unreadMessages > 0 && (
            <div className="absolute bottom-2 left-[125px] bg-secondary rounded-full text-white text-xs w-5 h-5 flex items-center justify-center">
              {unreadMessages}
            </div>
            )}
          </div>
        </div>
      </RecentChatFrame>
    </Suspense>
  );
}
