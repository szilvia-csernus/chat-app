"use client";

import { Card, CardFooter } from "@heroui/card";
import MemberImage from "./MemberImage";
import PresenceDot from "@/components/PresenceDot";
import { useRouter } from "next/navigation";
import NewChat from "./NewChat";
import { useDisclosure } from "@heroui/react";
import { Member } from "@/types";

export type MemberCardProps = {
  member: Member;
  online: boolean;
  chatting: boolean;
  chatId: string | undefined;
};

export default function MemberCard({
  member,
  online,
  chatting,
  chatId,
}: MemberCardProps) {
  const router = useRouter();

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
        />
      )}
      <Card fullWidth>
        <MemberImage
          memberImage={member.image}
          memberName={member.name}
        />
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
      </Card>
    </div>
  );
}
