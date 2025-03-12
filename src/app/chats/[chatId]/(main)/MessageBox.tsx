"use client";

import PresenceAvatar from "@/components/PresenceAvatar";
import { useAppSelector } from "@/redux-store/hooks";
import clsx from "clsx";
import { Suspense, useEffect, useRef, useState } from "react";
import { selectMemberOnlineStatus } from "@/redux-store/features/membersSlice";
import { selectMessageById } from "@/redux-store/features/messagesSlice";
import { selectCurrentMember } from "@/redux-store/features/currentMemberSlice";
import { selectMemberById } from "@/redux-store/features/membersSlice";
import {
  selectCurrentChatPartnerId
} from "@/redux-store/features/chatsSlice";

type MessageBoxProps = {
  messageId: string;
  lastMsgSender: { current: "currentMember" | "chatPartner" | null};
};

export default function MessageBox({
  messageId,
  lastMsgSender
}: MessageBoxProps) {
  const message = useAppSelector((state) =>
    selectMessageById(state, messageId)
  );
  const currentMember = useAppSelector(selectCurrentMember);
    const chatPartnerId = useAppSelector(selectCurrentChatPartnerId);
    const chatPartner = useAppSelector((state) =>
      selectMemberById(state, chatPartnerId)
    );

  const [renderCurrentMemberImg, setRenderCurrentMemberImg] = useState<boolean>(true);
  const [renderChatPartnerImg, setRenderChatPartnerImg] = useState<boolean>(true);

  useEffect(() => {
    if ( message && currentMember && message.senderId === currentMember.id) {
      setRenderCurrentMemberImg(true);
      setRenderChatPartnerImg(true);
      if (
        lastMsgSender.current === "currentMember"
      ) {
        setRenderCurrentMemberImg(false);
      } else {
        lastMsgSender.current = "currentMember";
      }
    }
    return () => {
      lastMsgSender.current = null;
      setRenderCurrentMemberImg(true);
    }
  }, [message, currentMember, lastMsgSender]);

  useEffect(() => {
    if (message!.senderId === chatPartner!.id) {
      setRenderChatPartnerImg(true);
      setRenderCurrentMemberImg(true);
      if (
        lastMsgSender.current === "chatPartner"
      ) {
        setRenderChatPartnerImg(false);
      } else {
        lastMsgSender.current = "chatPartner";
      }
    }
    return () => {
      lastMsgSender.current = null;
      setRenderChatPartnerImg(true);
    }
  }, [message, chatPartner, lastMsgSender]);

  const isCurrentMemberSender = message!.senderId === currentMember!.id;
  const sender = isCurrentMemberSender ? currentMember : chatPartner;
  const chatPartnerOnline = useAppSelector((state) =>
    selectMemberOnlineStatus(state, chatPartner!.id)
  );

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messageEndRef]);

  const renderAvatar = () => (
    <>
      { message &&
        <PresenceAvatar
          src={sender!.image || "/images/user.png"}
          online={chatPartnerOnline || false}
          deleted={sender!.deleted}
          classNames=""
          imageWidth={40}
          imageHeight={40}
          own={isCurrentMemberSender}
        />
      }
    </>
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
        {message?.read && message.senderId === currentMember!.id && (
          <div className="text-xs text-gray-400 italic w-auto">
            Seen &#10003;
          </div>
        )}
      </div>
    </div>
  );

  const renderMessageContent = () => (
    <div className="flex flex-col mt-1">
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
      <Suspense fallback={<div>Loading message...</div>}>
        {message && (
          <div className="grid grid-rows-1">
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
                {(!isCurrentMemberSender) &&
                  renderChatPartnerImg &&
                  renderAvatar()}
              </div>
              {renderMessageContent()}
              <div className="min-w-11 ml-1">
                {isCurrentMemberSender &&
                  renderCurrentMemberImg &&
                  renderAvatar()}
              </div>
            </div>
            <div ref={messageEndRef} />
          </div>
        )}
      </Suspense>
    </>
  );
}
