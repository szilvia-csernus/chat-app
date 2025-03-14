"use client";

import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { selectMemberById } from "@/redux-store/features/membersSlice";
import {
  selectCurrentChat,
  selectCurrentChatMsgGroupChronList,
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
  const messageGroupList = useAppSelector(selectCurrentChatMsgGroupChronList);

  useEffect(() => {
    if (currentChat) {
      // The user just opened this chat, meaning they seen all previously
      // unread messages, so reset the unread count in the redux store.
      // For the database, the read status is updated in the backend in
      // page.tsx
      dispatch(updateUnreadCount({ chatId: currentChat.id, count: 0 }));
    }
  });

  return (
      <ul className="flex flex-col px-1 py-2">
        {currentChat &&
          chatPartner &&
          messageGroupList &&
          messageGroupList.length > 0 && (
            <>
              {messageGroupList.map((date: string) => {
                return (
                  <li key={date}>
                    <MessageGroup date={date} />
                  </li>
                );
              })}
            </>
          )}
        {currentChat &&
          chatPartner &&
          messageGroupList &&
          messageGroupList.length === 0 && (
            <li key={"No message"} className="my-4 pl-1">
              Start chatting{chatPartner.name && ` with ${chatPartner.name}`}!
            </li>
          )}
      </ul>
  );
}
