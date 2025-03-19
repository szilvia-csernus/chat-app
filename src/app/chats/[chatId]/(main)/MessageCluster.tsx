"use client";

import PresenceAvatar from "@/components/PresenceAvatar";
import { useAppSelector } from "@/redux-store/hooks";
import clsx from "clsx";
import { Suspense } from "react";
import { selectMemberOnlineStatus } from "@/redux-store/features/membersSlice";
import { selectCurrentMember } from "@/redux-store/features/currentMemberSlice";
import { selectMemberById } from "@/redux-store/features/membersSlice";
import {
  selectCurrentChatMsgClusterById,
  selectCurrentChatPartnerId,
} from "@/redux-store/features/chatsSlice";
import MessageBox from "./MessageBox";

type Props = {
  clusterId: string;
  date: string;
};

export default function MessageCluster({ clusterId, date }: Props) {
  const msgCluster = useAppSelector((state) =>
    selectCurrentChatMsgClusterById(state.chats, date, clusterId)
  );
  const senderId = msgCluster?.senderId;
  const messageIds = msgCluster?.msgIds || [];
  const currentMember = useAppSelector(selectCurrentMember);
  const chatPartnerId = useAppSelector(selectCurrentChatPartnerId);
  const chatPartner = useAppSelector((state) =>
    selectMemberById(state, chatPartnerId)
  );

  const isCurrentMemberSender = senderId === currentMember!.id;

  const sender = isCurrentMemberSender ? currentMember : chatPartner;

  const chatPartnerOnline = useAppSelector((state) =>
    selectMemberOnlineStatus(state, chatPartner!.id)
  );

  const renderAvatar = () => (
    <PresenceAvatar
      src={sender!.image || "/images/user.png"}
      online={chatPartnerOnline || false}
      deleted={sender!.deleted}
      classNames=""
      imageWidth={40}
      imageHeight={40}
      own={isCurrentMemberSender}
    />
  );

  return (
    <div
      className={clsx(
        "flex gap-1 items-start min-h-10",
        {
          "justify-end text-right": isCurrentMemberSender,
        },
        { "justify-start": !isCurrentMemberSender }
      )}
    >
      <div className="min-w-10 mr-1 ml-1">
        {!isCurrentMemberSender && renderAvatar()}
      </div>
      <ul
        className={clsx(
          "flex flex-col mt-2",
          { "items-end": isCurrentMemberSender },
          { "items-start": !isCurrentMemberSender }
        )}
      >
        {messageIds.map((msgId) => (
          <li key={msgId}>
            <Suspense key={msgId} fallback={<div>Loading message...</div>}>
              <MessageBox
                messageId={msgId}
                isCurrentMemberSender={isCurrentMemberSender}
              />
            </Suspense>
          </li>
        ))}
      </ul>
      <div className="min-w-11 ml-1">
        {isCurrentMemberSender && renderAvatar()}
      </div>
    </div>
  );
}
