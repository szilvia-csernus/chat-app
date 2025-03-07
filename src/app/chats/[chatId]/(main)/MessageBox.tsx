"use client";

import PresenceAvatar from "@/components/PresenceAvatar";
import { useAppSelector } from "@/redux-store/hooks";
import { CurrentMember, Member } from "@/types";
import clsx from "clsx";
import { Suspense, useEffect, useRef, useState } from "react";
import { selectMemberOnlineStatus } from "@/redux-store/features/membersSlice";
import { selectMessageById } from "@/redux-store/features/messagesSlice";

type MessageBoxProps = {
  messageId: string;
  currentMember: CurrentMember;
  chatPartner: Member;
  latestDate: { current: string | null };
  lastMsgSender: { current: "currentMember" | "chatPartner" | null};
};

export default function MessageBox({
  messageId,
  currentMember,
  chatPartner,
  latestDate,
  lastMsgSender
}: MessageBoxProps) {
  const message = useAppSelector((state) =>
    selectMessageById(state, messageId)
  );

  const [date, setDate] = useState<string | null>(null);
  const [renderCurrentMemberImg, setRenderCurrentMemberImg] = useState<boolean>(true);
  const [renderChatPartnerImg, setRenderChatPartnerImg] = useState<boolean>(true);

  useEffect(() => {
    if (message.date === latestDate.current) {
      setDate(null);
    } else {
      setDate(message.date);
      latestDate.current = message.date;
    }
  }, [message.date, latestDate]);

  useEffect(() => {
    if (message.senderId === currentMember.id && lastMsgSender.current === "currentMember") {
      setRenderCurrentMemberImg(false);
    } else {
      if (message.senderId === currentMember.id) {
        setRenderCurrentMemberImg(true);
        lastMsgSender.current = "currentMember";
      }
    }
  })

  useEffect(() => {
    if (message.senderId === chatPartner.id && lastMsgSender.current === "chatPartner") {
      setRenderChatPartnerImg(false);
    } else {
      if (message.senderId === chatPartner.id) {
        setRenderChatPartnerImg(true);
        lastMsgSender.current = "chatPartner";
      } 
    }
  })

  const isCurrentMemberSender = message.senderId === currentMember.id;
  const sender = isCurrentMemberSender ? currentMember : chatPartner;
  const chatPartnerOnline = useAppSelector((state) =>
    selectMemberOnlineStatus(state, chatPartner.id)
  );

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
    "flex flex-col min-w-32 px-2 py-1 border-1 border-slate-300 dark:border-slate-500",
    {
      "rounded-l-xl rounded-br-xl bg-cyan-50 dark:bg-cyan-800 text-slate-800 dark:text-white":
        isCurrentMemberSender,
      "rounded-r-xl rounded-bl-xl bg-white dark:bg-gray-800":
        !isCurrentMemberSender,
      "bg-gray-200 dark:bg-gray-700": message?.deleted,
    }
  );

  const rendermessageDetails = () => (
    <div
      className={clsx(
        "flex items-center w-full text-secondary dark:text-teal-300"
        // {
        //   "justify-end": isCurrentMemberSender,
        // }
      )}
    >
      <div className="flex justify-end gap-2 w-full">
        {/* <span className="text-xs font-bold mr-2">
          {isCurrentMemberSender ? "You" : sender.name}
        </span> */}
        <div className="text-xs">{message?.time}</div>
        {message?.read && message.senderId === currentMember.id && (
          <div className="text-xs text-gray-400 italic w-auto">
            Seen &#10003;
          </div>
        )}
      </div>
    </div>
  );

  const renderMessageContent = () => (
    <div className="flex flex-col">
      <div className={messageContentClasses}>
        <p
          className={clsx(
            "text-sm text-gray-800 dark:text-white whitespace-pre-line",
            {
              "italic text-xs text-gray-500 dark:text-gray-500":
                message?.deleted,
            }
          )}
        >
          {message?.content}
        </p>
        {rendermessageDetails()}
      </div>
      
    </div>
  );

  return (
    <>
      {date && (
        <div
          suppressHydrationWarning={true}
          className="w-32 text-center text-xs font-semibold my-4 mx-auto py-1 border-1 bg-cyan-50 dark:bg-cyan-800 text-slate-800 dark:text-white rounded-full border-slate-300 dark:border-slate-500"
        >
          {date}
        </div>
      )}
      <Suspense fallback={<div>Loading message...</div>}>
        {message && (
          <div className="grid grid-rows-1">
            <div
              className={clsx(
                "flex gap-2 mb-1 items-start",
                {
                  "justify-end text-right": isCurrentMemberSender,
                },
                { "justyfy-start": !isCurrentMemberSender }
              )}
            >
              {!isCurrentMemberSender &&
                (renderChatPartnerImg ? (
                  renderAvatar()
                ) : (
                  <div className="w-10" />
                ))}
              {renderMessageContent()}
              {isCurrentMemberSender &&
                (renderCurrentMemberImg ? (
                  renderAvatar()
                ) : (
                  <div className="w-10" />
                ))}
            </div>
            <div ref={messageEndRef} />
          </div>
        )}
      </Suspense>
    </>
  );
}
