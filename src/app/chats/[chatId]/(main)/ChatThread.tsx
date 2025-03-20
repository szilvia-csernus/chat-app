"use client";

import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { selectMemberById } from "@/redux-store/features/membersSlice";
import {
  selectCurrentChat,
  selectCurrentChatId,
  selectCurrentChatMsgGroupChronList,
  selectCurrentChatPartnerId,
} from "@/redux-store/features/chatsSlice";
import MessageGroup from "./MessageGroup";
import { updateUnreadMsgCount } from "@/redux-store/thunks";

export default function ChatThread() {
  const dispatch = useAppDispatch();

  const currentChatId = useAppSelector(selectCurrentChatId)
  const chatPartnerId = useAppSelector(selectCurrentChatPartnerId);
  const chatPartner = useAppSelector((state) =>
    selectMemberById(state.members, chatPartnerId)
  );
  const messageGroupList = useAppSelector((state) =>
    selectCurrentChatMsgGroupChronList(state.chats)
  );

  useEffect(() => {
    if (currentChatId) {
      // The user just opened this chat, meaning they can now see all previously
      // unread messages, therefore, we reset the unread count in the redux store.
      dispatch(updateUnreadMsgCount(currentChatId));
    }
  }, [currentChatId, dispatch]);

  return (
    <ul className="flex flex-col px-1 py-2">
      {currentChatId &&
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
      {currentChatId &&
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
