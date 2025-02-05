import React, { Suspense } from "react";
import PresenceDot from "@/components/PresenceDot";
import MemberImage from "@/app/members/MemberImage";
import { Member } from "@/types";
import { selectMembersOnline } from "@/redux-store/features/presenceSlice";
import RecentChatFallback from "./RecentChatFallback";
import RecentChatFrame from "./RecentChatFrame";
import { useAppSelector } from "@/redux-store/hooks";


type Props = {
  chatId: string;
  chatPartner: Member;
  lastMessage: string;
  unreadMessageCount: number;
};

export default function RecentChat({
  chatId,
  chatPartner,
  lastMessage,
  unreadMessageCount,
}: Props) {
  const membersOnline = useAppSelector(selectMembersOnline);
  const online = membersOnline.includes(chatPartner.id);
  const message =
    lastMessage.length > 18 ? `${lastMessage.slice(0, 18)}...` : lastMessage;

  return (
    <Suspense fallback={<RecentChatFallback />}>
      <RecentChatFrame chatId={chatId}>
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
            {unreadMessageCount > 0 && (
              <div className="absolute bottom-2 left-[125px] bg-secondary rounded-full text-white text-xs w-5 h-5 flex items-center justify-center">
                {unreadMessageCount}
              </div>
            )}
          </div>
        </div>
      </RecentChatFrame>
    </Suspense>
  );
}
