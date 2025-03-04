"use client";

import React, { useEffect } from "react";
import MessageBox from "./MessageBox";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { selectCurrentMember } from "@/redux-store/features/currentMemberSlice";
import { notFound } from "next/navigation";
import { selectMemberById } from "@/redux-store/features/membersSlice";
import {
  selectCurrentChat,
  updateUnreadCount,
} from "@/redux-store/features/chatsSlice";

export default function ChatThread() {
  const dispatch = useAppDispatch();

  const currentChat = useAppSelector(selectCurrentChat);
  const currentMember = useAppSelector(selectCurrentMember);
  const chatPartnerId = currentChat && currentChat.chatPartnerId;
  if (!chatPartnerId) return notFound();
  const chatPartner = useAppSelector((state) =>
    selectMemberById(state, chatPartnerId)
  );
  if (!chatPartner) return notFound();

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
        {currentChat.messageIds.map((id) => (
          <li key={id}>
            <MessageBox
              messageId={id}
              currentMember={currentMember}
              chatPartner={chatPartner}
            />
          </li>
        ))}
      </>
    );
  } else {
    chatThread = (
      <li key={0} className="my-4 pl-1">
        Start chatting with {chatPartner.name}
      </li>
    );
  }

  return <ul className="flex flex-col px-1 py-2">{chatThread}</ul>;
}
