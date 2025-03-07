"use client";

import React from "react";
import { useAppSelector } from "@/redux-store/hooks";
import { IoIosArrowBack } from "react-icons/io";
import PresenceAvatar from "@/components/PresenceAvatar";
import { selectMemberById, selectMemberOnlineStatus } from "@/redux-store/features/membersSlice";
import { selectCurrentChat } from "@/redux-store/features/chatsSlice";

type Props = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
};

export default function CurrentChatPartner({
  isSidebarOpen,
  setIsSidebarOpen,
}: Props) {
  const currentChat = useAppSelector(selectCurrentChat);
  const chatPartnerId = currentChat && currentChat.chatPartnerId;
  const chatPartner = useAppSelector(state => selectMemberById(state, chatPartnerId));
  const online = !!(useAppSelector(state => selectMemberOnlineStatus(state, chatPartnerId)));

  return (
    <>
      {chatPartner && (
        <div className="m-auto border-b-1 border-slate-300 dark:border-slate-500  bg-white dark:bg-gray-800 flex items-center relative">
          <IoIosArrowBack
            className="sm:hidden ml-2 text-slate-500  dark:text-slate-400"
            size={30}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <div className="mx-1 my-3 ">
            <PresenceAvatar
              src={chatPartner.image || "/images/user.png"}
              online={online}
              deleted={chatPartner.deleted || false}
              className="self-end mx-1"
              own={false}
            />
          </div>
          <div className="flex flex-col text-gray-800 dark:text-white justify-center">
            <div className="text-sm">
              {chatPartner && chatPartner.name && chatPartner.name}
              {(!chatPartner || chatPartner.deleted) && "Deleted User"}

              {chatPartner && !chatPartner.deleted && online && (
                <div className="text-xs text-teal-500 dark:text-teal-300">
                  ACTIVE NOW
                </div>
              )}
            </div>

            {!online && (
              <div
                suppressHydrationWarning={true}
                className="text-xs text-gray-400 min-w-full relative"
              >
                Last seen: {chatPartner && chatPartner.lastActive}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
