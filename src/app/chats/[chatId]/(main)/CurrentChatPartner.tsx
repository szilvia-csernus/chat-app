"use client";

import React from "react";
import PresenceDot from "@/components/PresenceDot";
import MemberImage from "@/app/members/MemberImage";
import { Member } from "@/types";
import { selectMembersOnline } from "@/redux-store/features/presenceSlice";
import { useAppSelector } from "@/redux-store/hooks";
import { selectCurrentChat } from "@/redux-store/features/currentChatSlice";
import { selectChatPartnerById } from "@/redux-store/features/chatPartnersSlice";

type Props = {
  chatPartnerId: string;
};

export default function CurrentChatPartner({
  chatPartnerId,
}: Props) {
  const membersOnline = useAppSelector(selectMembersOnline);
  const chatPartnerData = useAppSelector(selectChatPartnerById(chatPartnerId));
  if (!chatPartnerData) {
    return null;
  }
  const chatPartner = chatPartnerData.chatPartner;
  
  const online = membersOnline.includes(chatPartnerId);

  return (
    <div className="border-b-1 border-slate-400  bg-white dark:bg-gray-800 flex">
      <div className="m-2 rounded-full border-1 border-slate-500 overflow-hidden">
        <MemberImage
          memberImage={chatPartner.image ? chatPartner.image : ""}
          memberName={chatPartner.name ? chatPartner.name : ""}
          width={35}
          height={35}
        />
      </div>
      <div className="flex flex-col text-gray-800 dark:text-white justify-center">

          <div className="text-sm">
            {chatPartner.name}
            <>
              {online && (
                <div className="text-xs text-teal-500 dark:text-teal-300">
                  ACTIVE NOW
                </div>
              )}
            </>
          </div>

        {!online && <div className="text-xs text-gray-400 min-w-full relative">
          Last seen: {chatPartner.lastActive}
        </div>}
      </div>
    </div>
  );
}
