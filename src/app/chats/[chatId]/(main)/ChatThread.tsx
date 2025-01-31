"use client";

import { useCurrentChatStore } from "@/hooks/zustand-stores/useCurrentChatStore";
import { Chat, Member } from "@/types";
import React, { useEffect } from "react";
import MessageBox from "./MessageBox";

import usePresenceStore from "@/hooks/zustand-stores/usePresenceStore";
import { useRecentChatsStore } from "@/hooks/zustand-stores/useRecentChatsStore";

type Props = {
  currentMember: Member;
  chatPartner: Member;
  initialChat: Chat | null;
};

export default function ChatThread({ currentMember, chatPartner, initialChat }: Props) {
  const currentChat = useCurrentChatStore((state) => state.chat);
  const membersOnline = usePresenceStore((state) => state.membersOnline);
  const setCurrentChat = useCurrentChatStore((state) => state.setCurrentChat);
  const resetCurrentChat = useCurrentChatStore((state) => state.resetCurrentChat);
   const setAllUnreadMessageCount = useRecentChatsStore(
      (state) => state.setAllUnreadMessageCount
    );

  useEffect(() => {
    if (initialChat) {
      setCurrentChat(initialChat);
    }

    return () => {
      resetCurrentChat();
    };
  }, [initialChat, setCurrentChat]);

  useEffect(() => {
    setAllUnreadMessageCount();
  }, [currentChat?.id, setAllUnreadMessageCount]);

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
                isChatPartnerOnline={isChatPartnerOnline}
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