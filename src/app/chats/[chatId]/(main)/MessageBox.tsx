"use client";

import PresenceAvatar from "@/components/PresenceAvatar";
import { useAppSelector } from "@/redux-store/hooks";
import { CurrentMember, Member } from "@/types";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { selectMemberOnlineStatus } from "@/redux-store/features/membersSlice";
import { selectMessageById } from "@/redux-store/features/messagesSlice";

type MessageBoxProps = {
  messageId: string;
  currentMember: CurrentMember;
  chatPartner: Member;
};

export default function MessageBox({
  messageId,
  currentMember,
  chatPartner,

}: MessageBoxProps) {
  const message = useAppSelector(state => selectMessageById(state, messageId)
  );
  const isCurrentMemberSender = message.senderId === currentMember.id;
  const sender = isCurrentMemberSender ? currentMember : chatPartner;
  const chatPartnerOnline = useAppSelector(state => selectMemberOnlineStatus(state, chatPartner.id));
  
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messageEndRef]);

  const renderAvatar = () => (
    <PresenceAvatar
      src={sender.image || "/images/user.png"}
      online={chatPartnerOnline || false}
      deleted={sender.deleted}
      className="self-end mx-1"
      own={isCurrentMemberSender}
    />
  );

  const messageContentClasses = clsx(
    "flex flex-col px-2 py-1 border-1 border-slate-300 dark:border-slate-500",
    {
      "rounded-l-2xl rounded-tr-2xl bg-cyan-50 dark:bg-cyan-800 text-slate-800 dark:text-white": isCurrentMemberSender,
      "rounded-r-2xl rounded-tl-2xl bg-white dark:bg-gray-800":
        !isCurrentMemberSender,
      "bg-gray-200 dark:bg-gray-700": message?.deleted,
    }
  );

  const rendermessageHeader = () => (
    <div
      className={clsx(
        "flex items-center w-full mt-1 text-secondary dark:text-teal-300",
        {
          "justify-end": isCurrentMemberSender,
        }
      )}
    >
      <div className="flex">
        <span className="text-xs font-bold ">
          {isCurrentMemberSender ? "You" : sender.name}
        </span>
        <span className="text-xs ml-2 ">{message?.createdAt}</span>
      </div>
    </div>
  );

  const renderMessageContent = () => (
    <div className="flex flex-col">
      <div className={messageContentClasses}>
        {rendermessageHeader()}
        <p
          className={clsx("text-sm py-3 text-gray-800 dark:text-white whitespace-pre-line", {
           "italic text-gray-500 dark:text-gray-400" : message?.deleted }
          )}
        >
          {message?.content}
        </p>
      </div>
      {message?.read && message.senderId === currentMember.id ? (
        <div className="text-xs text-gray-400 italic">Seen &#10003;</div>
      ) : (
        <div></div>
      )}
    </div>
  );

  return (
    <>
      {message && (
        <div className="grid grid-rows-1">
          <div
            className={clsx(
              "flex gap-2 mb-3",
              {
                "justify-end text-right": isCurrentMemberSender,
              },
              { "justyfy-start": !isCurrentMemberSender }
            )}
          >
            {!isCurrentMemberSender && renderAvatar()}
            {renderMessageContent()}
            {isCurrentMemberSender && renderAvatar()}
          </div>
          <div ref={messageEndRef} />
        </div>
      )}
    </>
  );
}
