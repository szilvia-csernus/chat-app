"use client";

import { Chat, Member } from "@/types";
import React, { useEffect } from "react";
import MessageBox from "./MessageBox";

import { selectMembersOnline } from "@/redux-store/features/presenceSlice";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { setAllUnreadMessageCount, updateUnreadCount } from "@/redux-store/features/recentChatsSlice";
import { selectCurrentChat } from "@/redux-store/features/currentChatSlice";
import { setCurrentChat } from "@/redux-store/features/currentChatSlice";


type Props = {
  currentMember: Member;
  chatPartner: Member;
  initialChat: Chat | null;
};

export default function ChatThread({ currentMember, chatPartner, initialChat }: Props) {
  const dispatch = useAppDispatch();
  
  const currentChat = useAppSelector(selectCurrentChat);
  const membersOnline = useAppSelector(selectMembersOnline);

  useEffect(() => {
    if (initialChat) {
      dispatch(setCurrentChat(initialChat));
    }
  }, [initialChat, setCurrentChat]);

  useEffect(() => {
    if (currentChat) {
      // The user is currently viewing the chat, so reset the unread count
      // in the redux store. For the database, the read status is updated
      // in the backand in page.tsx
      dispatch(updateUnreadCount({chatId: currentChat.id, count: 0}));
      dispatch(setAllUnreadMessageCount());
    }
  });

  let chatThread: React.JSX.Element;
  if (
    currentMember &&
    currentChat &&
    currentChat.messages &&
    currentChat.messages.length > 0
  ) {
    chatThread = (
      <>
        {currentChat.messages.map((message): React.JSX.Element => {
          const isCurrentMemberSender = message.senderId === currentMember.id;
          const isChatPartnerOnline =
            message.senderId && membersOnline.includes(message.senderId);
          return (
            <li key={message.id}>
              <MessageBox
                message={message}
                read={message.read}
                currentMember={currentMember}
                chatPartner={chatPartner}
                isCurrentMemberSender={isCurrentMemberSender}
                isChatPartnerOnline={!!isChatPartnerOnline}
              />
            </li>
          );
        })}
      </>
    );
  } else {
    chatThread = (
      <li key={0} className="my-4 pl-1">
        Start chatting with {chatPartner.name}.
      </li>
    );
  }

  return <ul className="flex flex-col">{chatThread}</ul>;
}