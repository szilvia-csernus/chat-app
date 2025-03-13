"use client";

import React, { useRef } from "react";
import MessageBox from "./MessageBox";

import { timeAgoDate } from "@/lib/utils";
import { useAppSelector } from "@/redux-store/hooks";
import { selectCurrentChatGroupedMessageIdsByDate } from "@/redux-store/features/chatsSlice";

type Props = {
  date: string;
};

export default function MessageGroup({ date}: Props) {
  const messageIdGroup = useAppSelector((state) => selectCurrentChatGroupedMessageIdsByDate(state, date));

  const lastMsgSender = useRef<"currentMember" | "chatPartner" | null>(null);

  return (
    <>
      {date && <div
        suppressHydrationWarning={true}
        className=" w-none min-w-32 max-w-48 text-center text-xs font-semibold my-4 mx-auto py-1 px-2 border-1  text-secondary dark:text-teal-300 rounded-full border-slate-300 dark:border-slate-500"
      >
        {timeAgoDate(date)}
      </div>}
      {/* message group for specific date */}
      <ul>
        {messageIdGroup.map((id) => (
          <li key={id}>
            <MessageBox
              messageId={id}
              lastMsgSender={lastMsgSender}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
