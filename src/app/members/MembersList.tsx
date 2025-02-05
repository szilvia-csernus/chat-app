"use client";

import MemberCard from "./MemberCard";
import { selectAllChatPartners } from "@/redux-store/features/chatPartnersSlice";
import { selectMembersOnline } from "@/redux-store/features/presenceSlice";
import { useAppSelector } from "@/redux-store/hooks";
import { Member } from "@/types";


type MembersListProps = {
  members: Member[] | null;
};

export default function MembersList({ members }: MembersListProps) {
  const membersOnline = useAppSelector(selectMembersOnline);
  const chatPartners = useAppSelector(selectAllChatPartners);
  console.log("members:", members);
  console.log("membersOnline:", membersOnline);

  return (
    <>
      {members &&
        members.map((member) => {
          const online = membersOnline.includes(member.id);
          console.log("online", online);
          const chatPartner = chatPartners.find(
            (cp) => cp.chatPartner.id === member.id
          );
          const chatting = !!chatPartner;
          const chatId = chatPartner?.chatId;
          return (
            <MemberCard
              key={member.id}
              member={member}
              online={online}
              chatting={chatting}
              chatId={chatId}
            />
          );
        })}
    </>
  );
}
