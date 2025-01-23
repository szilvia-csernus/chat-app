import React, { Suspense } from "react";
import PresenceDot from "@/components/PresenceDot";
import MemberImage from "@/app/members/MemberImage";
import { Member } from "@/types";

import RecentChatFallback from "./RecentChatFallback";
import RecentChatFrame from "./RecentChatFrame";

type Props = {
  key: string;
  chatId: string;
  chatPartner: Member;
  lastMessage: string;
  unreadMessages: number;
  currentChatId: string;
  membersOnline: string[];
};

export default function RecentChat({
  key,
  chatId,
  chatPartner,
  lastMessage,
  unreadMessages,
  currentChatId,
  membersOnline,
}: Props) {
  const online = membersOnline.includes(chatPartner.id);

  return (
    <Suspense fallback={<RecentChatFallback />}>
      <RecentChatFrame
        key={key}
        chatId={chatId}
        currentChatId={currentChatId}
      >
        <div className="m-1 rounded-full border-2 border-slate-500 overflow-hidden">
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
            {lastMessage || "No messages yet"}
            {/* {unreadMessages > 0 && ( */}
            <div className="absolute top-0 left-28 bg-secondary rounded-full text-white text-xs w-5 h-5 flex items-center justify-center">
              1
            </div>
            {/* )} */}
          </div>
        </div>
      </RecentChatFrame>
    </Suspense>
  );
}
