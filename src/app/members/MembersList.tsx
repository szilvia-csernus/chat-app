"use client";

import MemberCard from "./MemberCard";
import usePresenceStore from "@/hooks/usePresenceStore";
import { Member } from "@/types";
import { useChatPartnersStore } from "@/hooks/useChatPartnersStore";

type MembersListProps = {
  members: Member[] | null;
};

export default function MembersList({ members }: MembersListProps) {
  const membersOnline = usePresenceStore((state) => state.membersOnline);
  const chatPartners = useChatPartnersStore((state) => state.chatPartners);
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
