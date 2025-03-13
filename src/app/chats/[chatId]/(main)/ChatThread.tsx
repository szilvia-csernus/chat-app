"use client";

import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { selectMemberById } from "@/redux-store/features/membersSlice";
import {
  selectCurrentChat,
  selectCurrentChatMsgIdGroupChronList,
  selectCurrentChatPartnerId,
  updateUnreadCount,
} from "@/redux-store/features/chatsSlice";
import MessageGroup from "./MessageGroup";

export default function ChatThread() {
  const dispatch = useAppDispatch();

  const currentChat = useAppSelector(selectCurrentChat);
  const chatPartnerId = useAppSelector(selectCurrentChatPartnerId);
  const chatPartner = useAppSelector((state) =>
    selectMemberById(state, chatPartnerId)
  );
  const messageGroupList = useAppSelector(
    selectCurrentChatMsgIdGroupChronList
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
    currentChat &&
    chatPartner &&
    messageGroupList &&
    messageGroupList.length > 0
  ) {
    chatThread = (
      <>
        {messageGroupList.map((date: string) => {
          return(
            <li key={date}>
              <MessageGroup
                date={date}
              />
            </li>
          )})}
      </>
    );
  } else {
    chatThread = (
      <li key={"No message"} className="my-4 pl-1">
        Start chatting {(chatPartner && chatPartner.name) && ` with ${chatPartner.name}`}!
      </li>
    );
  }

  return <ul className="flex flex-col px-1 py-2">{chatThread}</ul>;
}
