import React from "react";
import RecentChatFrame from "./RecentChatFrame";
import { useAppSelector } from "@/redux-store/hooks";
import { IoIosArrowForward } from "react-icons/io";
import {
  selectMemberById,
  selectMemberOnlineStatus,
} from "@/redux-store/features/membersSlice";
import {
  selectChatById,
  selectLastMsgIdByChatId,
} from "@/redux-store/features/chatsSlice";
import { selectMsgById } from "@/redux-store/features/messagesSlice";
import PresenceAvatar from "@/components/PresenceAvatar";

type Props = {
  chatId: string;
};

export default function RecentChat({ chatId }: Props) {
  const chat = useAppSelector((state) => selectChatById(state.chats, chatId));
  const { chatPartnerId, unreadMessageCount } = chat;
  const lastMessageId = useAppSelector((state) =>
    selectLastMsgIdByChatId(state, chatId)
  );
  const lastMessage = useAppSelector((state) =>
    selectMsgById(state, lastMessageId)
  )?.content;
  const chatPartner = useAppSelector((state) =>
    selectMemberById(state.members, chatPartnerId)
  );
  const online = useAppSelector((state) =>
    selectMemberOnlineStatus(state, chatPartnerId)
  );

  return (
    <>
      {chatPartner && (
        <RecentChatFrame chatId={chatId}>
          <div className="flex items-center">
            <div className="m-2">
              <PresenceAvatar
                src={chatPartner.image || "/images/user.png"}
                online={online}
                deleted={chatPartner.deleted || false}
                imageWidth={50}
                imageHeight={50}
                classNames="self-end mx-1"
                own={false}
              />
            </div>
            <div className="flex flex-col text-gray-800 dark:text-white pr-1 max-w-[70%]">
              <div>
                {chatPartner.deleted ? "Deleted User" : chatPartner.name}
              </div>
              <div className="text-xs text-gray-400 line-clamp-2">
                {lastMessage || "No message to show"}
                {unreadMessageCount > 0 && (
                  <div className="absolute bottom-6 right-[30px] sm:right-[10px] bg-secondary rounded-full text-white text-xs w-5 h-5 flex items-center justify-center">
                    {unreadMessageCount}
                  </div>
                )}
              </div>
            </div>
          </div>
          <IoIosArrowForward
            className="sm:hidden ml-2 justify-self-end text-slate-500 dark:text-slate-400"
            size={30}
          />
        </RecentChatFrame>
      )}
    </>
  );
}
