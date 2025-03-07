"use client";

import React, {  useEffect, useRef } from "react";
import MessageBox from "./MessageBox";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { selectCurrentMember } from "@/redux-store/features/currentMemberSlice";
import { selectMemberById } from "@/redux-store/features/membersSlice";
import {
  selectCurrentChat,
  updateUnreadCount,
} from "@/redux-store/features/chatsSlice";

export default function ChatThread() {
  const dispatch = useAppDispatch();
  const latestDate = useRef<string | null>(null);
  const lastMsgSender = useRef<"currentMember" | "chatPartner" | null>(null);

  const currentChat = useAppSelector(selectCurrentChat);
  const currentMember = useAppSelector(selectCurrentMember);
  const chatPartnerId = currentChat && currentChat.chatPartnerId;
  const chatPartner = useAppSelector((state) =>
    selectMemberById(state, chatPartnerId)
  );

  useEffect(() => {
    if (currentChat) {
      // The user just opened this chat, meaning they seen all previously
      // unread messages, so reset the unread count in the redux store.
      // For the database, the read status is updated in the backend in
      // page.tsx
      dispatch(updateUnreadCount({ chatId: currentChat.id, count: 0 }));
    }
  });

  let chatThread: React.JSX.Element;
  if (
    currentMember &&
    currentChat &&
    currentChat.messageIds &&
    currentChat.messageIds.length > 0
  ) {
    chatThread = (
      <>
        {chatPartner && currentChat.messageIds.map((id) => (
          <li key={id}>
            <MessageBox
              messageId={id}
              currentMember={currentMember}
              chatPartner={chatPartner}
              latestDate={latestDate}
              lastMsgSender={lastMsgSender}
            />
          </li>
        ))}
      </>
    );
  } else {
    chatThread = (
      <li key={0} className="my-4 pl-1">
        Start chatting with {chatPartner && chatPartner.name}
      </li>
    );
  }

  return <ul className="flex flex-col px-1 py-2">{chatThread}</ul>;
}
