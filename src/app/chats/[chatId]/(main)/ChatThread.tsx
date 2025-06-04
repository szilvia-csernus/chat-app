"use client";

import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { selectMemberById } from "@/redux-store/features/membersSlice";
import {
  selectCurrentChatId,
  selectCurrentChatMsgGroupChronList,
  selectCurrentChatPartnerId,
} from "@/redux-store/features/chatsSlice";
import MessageGroup from "./MessageGroup";
import { resetUnreadMsgCount } from "@/redux-store/thunks";
import { setChatVisible } from "@/redux-store/features/uiSlice";

export default function ChatThread() {
  const dispatch = useAppDispatch();
  const currentChatId = useAppSelector(selectCurrentChatId);
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
      dispatch(resetUnreadMsgCount(currentChatId));
    }
  }, [currentChatId, dispatch]);

  // Marking the chat as visible, i.e. not covered up with the Sidebar
  useEffect(() => {
    dispatch(setChatVisible(true));
  }, [dispatch]);

  return (
    <ul className="flex flex-col px-1 py-2 scroll-behavior-smooth">
      {currentChatId &&
        chatPartner &&
        messageGroupList &&
        messageGroupList.length > 0 && (
          <>
            {messageGroupList.map((date: string, idx) => {
              return (
                <li key={date}>
                  <MessageGroup date={date} first={idx === 0} />
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
