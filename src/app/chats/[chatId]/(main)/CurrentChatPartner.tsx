"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { IoIosArrowBack } from "react-icons/io";
import PresenceAvatar from "@/components/PresenceAvatar";
import { selectMemberById, selectMemberOnlineStatus } from "@/redux-store/features/membersSlice";
import { selectCurrentChatPartnerId } from "@/redux-store/features/chatsSlice";
import { openSidebar } from "@/redux-store/features/uiSlice";
import { timeAgoDateTime } from "@/lib/utils";


export default function CurrentChatPartner() {
  const chatPartnerId = useAppSelector(selectCurrentChatPartnerId);
  const chatPartner = useAppSelector(state => selectMemberById(state.members, chatPartnerId));
  const online = !!(useAppSelector(state => selectMemberOnlineStatus(state, chatPartnerId)));
  const dispatch = useAppDispatch();

  return (
    <>
      {chatPartner && (
        <div className="m-auto border-b-1 border-slate-300 dark:border-slate-500  bg-white dark:bg-gray-800 flex items-center">
          <IoIosArrowBack
            className="sm:hidden ml-2 text-slate-500  dark:text-slate-400 cursor-pointer"
            size={30}
            onClick={() => dispatch(openSidebar())}
          />
          <div className="my-3 ">
            <PresenceAvatar
              src={chatPartner.image || "/images/user.png"}
              online={online}
              deleted={chatPartner.deleted || false}
              classNames="self-end mx-1 mr-2"
              imageWidth={40}
              imageHeight={40}
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
                Last seen: {chatPartner && timeAgoDateTime(chatPartner.lastActive)}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
