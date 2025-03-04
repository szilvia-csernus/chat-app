"use client";

import { Card, CardFooter } from "@heroui/card";
import MemberImage from "./MemberImage";
import { useRouter } from "next/navigation";
import NewChat from "./NewChat";
import { useDisclosure } from "@heroui/react";
import { useAppSelector } from "@/redux-store/hooks";
import { selectCurrentMember, selectCurrentMemberId } from "@/redux-store/features/currentMemberSlice";
import { selectMemberById, selectMemberOnlineStatus } from "@/redux-store/features/membersSlice";
import { CurrentMember, Member } from "@/types";

export type MemberCardProps = {
  memberId: string;
};

export default function MemberCard({
  memberId,
}: MemberCardProps) {
  const router = useRouter();

  // when member is the currentMember, somehow the member is not found
  const currentMemberId = useAppSelector(selectCurrentMemberId);
  let member: Member | null = null;
  if (currentMemberId === memberId !== null) {
    const currentMember = useAppSelector(selectCurrentMember);
    if (currentMember) {
      member = {
        id: currentMember.id,
        name: currentMember.name,
        image: currentMember.image,
        lastActive: currentMember.lastActive,
        deleted: currentMember.deleted,
        chatting: null,
        online: currentMember.online,
      };
    }
  } else {
    member = useAppSelector(state => selectMemberById(state, memberId));
  }

  const online = useAppSelector((state) =>
      selectMemberOnlineStatus(state, memberId)
    );
  const chatIdIfChatting = member && member.chatting;

  const memberImageUrl = member && member.image ? member.image : "/images/user.png";

  // modal properties
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onClickHandler = () => {
    if (chatIdIfChatting) {
      router.push(`/chats/${chatIdIfChatting}`);
    } else if (currentMemberId === memberId) {
      router.push(`/profile`)
    } else {
      onOpen();
    }
  };

  return (
    <div onClick={onClickHandler}>
      {member && isOpen && currentMemberId && (
        <NewChat
          member={member}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
      <Card fullWidth>
        <div>
          <MemberImage memberImage={memberImageUrl} memberName={member ? member.name : ""} />
          {currentMemberId === memberId && (
            <div className="absolute top-2 left-2 z-20">
              <div className="border-1 border-white p-1 rounded-2xl bg-[#fb9f3c] text-xs text-white">
                YOU
              </div>
            </div>
          )}
          {currentMemberId !== memberId && online && (
            <div className="absolute top-2 left-3 z-20">
              <div className="border-1 border-white p-[5px] rounded-2xl bg-teal-500 animate-pulse text-xs text-white">
                active
              </div>
            </div>
          )}
          {currentMemberId !== memberId && !online && (
            <div className="absolute top-2 left-3 z-20">
              <div className="border-1 border-white p-[5px] rounded-2xl bg-gray-500 text-xs text-white">
                inactive
              </div>
            </div>
          )}

          <CardFooter className="flex justify-start bg-dark-gradient overflow-hidden absolute bottom-0 z-10 pb-1 pt-12">
            <div className="flex flex-col text-white">
              <span className="">{member ? member.name : ""}</span>
            </div>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
