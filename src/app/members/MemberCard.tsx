"use client";

import { Card, CardFooter } from "@heroui/card";
import MemberImage from "./MemberImage";
import PresenceDot from "@/components/PresenceDot";
import { useRouter } from "next/navigation";
import NewChat from "./NewChat";
import { useDisclosure } from "@heroui/react";
import { Member } from "@/types";
import { useAppSelector } from "@/redux-store/hooks";
import { selectMemberOnlineStatus } from "@/redux-store/features/presenceSlice";
import { selectChatPartnerById } from "@/redux-store/features/chatPartnersSlice";

export type MemberCardProps = {
  member: Member;
  currentMember: Member;
};

export default function MemberCard({
  member,
  currentMember,
}: MemberCardProps) {
  const router = useRouter();

  const online = useAppSelector(selectMemberOnlineStatus(member.id));
  const chatPartner = useAppSelector(selectChatPartnerById(member.id));
  const chatting = !!chatPartner;
  const chatId = chatPartner?.chatId;

  // modal properties
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onClickHandler = () => {
    if (chatting) {
      router.push(`/chats/${chatId}`);
    } else {
      onOpen();
    }
  };

  return (
    <div onClick={onClickHandler}>
      {isOpen && (
        <NewChat
          member={member}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          currentMember={currentMember}
        />
      )}
      <Card fullWidth>
        <div>
          <MemberImage memberImage={member.image} memberName={member.name} />
          {online && (
            <div className="absolute top-2 left-3 z-20">
              <PresenceDot outlineColor="white" />
            </div>
          )}

          <CardFooter className="flex justify-start bg-dark-gradient overflow-hidden absolute bottom-0 z-10">
            <div className="flex flex-col text-white">
              <span className="">{member.name}</span>
            </div>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
