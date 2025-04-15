"use client";

import { Card, CardFooter } from "@heroui/card";
import MemberImage from "../../components/MemberImage";
import { useRouter } from "next/navigation";
import NewChat from "./NewChat";
import { useDisclosure } from "@heroui/react";
import { useAppSelector } from "@/redux-store/hooks";
import { selectCurrentMember } from "@/redux-store/features/currentMemberSlice";
import {
  selectMemberById,
  selectMemberOnlineStatus,
} from "@/redux-store/features/membersSlice";
import { Member } from "@/types";

export type MemberCardProps = {
  memberId: string;
};

export default function MemberCard({ memberId }: MemberCardProps) {
  const router = useRouter();

  const currentMember = useAppSelector(selectCurrentMember);
  const member = useAppSelector((state) =>
    selectMemberById(state.members, memberId)
  );

  let memberToDisplay: Member | null = null;

  if (
    currentMember &&
    currentMember.id === memberId &&
    currentMember.id !== null
  ) {
    memberToDisplay = {
      id: currentMember.id,
      name: currentMember.name,
      image: currentMember.image,
      lastActive: currentMember.lastActive,
      deleted: currentMember.deleted,
      chatting: null,
      online: currentMember.online,
    };
  } else {
    memberToDisplay = member;
  }

  const online = useAppSelector((state) =>
    selectMemberOnlineStatus(state, memberId)
  );

  // modal properties
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const memberImageUrl =
    memberToDisplay && memberToDisplay.image
      ? memberToDisplay.image
      : "/images/user.png";

  const onClickHandler = () => {
    const chatIdIfChatting = member && member.chatting;
    if (currentMember && currentMember.id === memberId) {
      router.push(`/profile`);
    } else if (chatIdIfChatting) {
      router.push(`/chats/${chatIdIfChatting}`);
    } else {
      onOpen();
    }
  };

  return (
    <>
      {currentMember && (
        <div onClick={onClickHandler} className="cursor-pointer">
          {memberToDisplay && isOpen && currentMember.id && (
            <NewChat
              member={memberToDisplay}
              isOpen={isOpen}
              onOpenChange={onOpenChange}
            />
          )}
          <Card fullWidth className="bg-inherit">
            <div className="relative border-1 border-gray-300 
             dark:border-gray-700 overflow-hidden rounded-2xl z-10">
              <MemberImage
                memberImage={memberImageUrl}
                memberName={memberToDisplay ? memberToDisplay.name : ""}
              />
              {/* Gradient overlay for the image */}
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-for-image-overlay" /> 
              {currentMember.id === memberId && (
                <div className="absolute top-2 left-2 z-20">
                  <div className="border-1 border-white p-1 rounded-2xl bg-[#fb9f3c] text-xs text-white">
                    YOU
                  </div>
                </div>
              )}
              {currentMember.id !== memberId && online && (
                <div className="absolute top-2 left-3 z-20">
                  <div className="border-1 border-white p-[5px] rounded-2xl bg-teal-500 animate-pulse text-xs text-white">
                    active
                  </div>
                </div>
              )}
              {currentMember.id !== memberId && !online && (
                <div className="absolute top-2 left-3 z-20">
                  <div className="border-1 border-white p-[5px] rounded-2xl bg-gray-500 text-xs text-white">
                    inactive
                  </div>
                </div>
              )}

              <CardFooter className="z-10 py-0 px-0 absolute bottom-0 left-0 right-0 max-h-8 w-full m-0 overflow-hidden">
                <div
                  className={`backdrop-blur-md border-white/20 
                  border-1 w-[calc(100%_-_2px)] text-center px-4 py-1
                  text-white drop-shadow-md wide-text-shadow m-auto`}
                >
                  {memberToDisplay ? memberToDisplay.name : ""}
                </div>
              </CardFooter>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
