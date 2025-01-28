"use client";

import { useCurrentChatStore } from "@/hooks/useCurrentChatStore";
import { Chat, Member } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";
import { formatShortDateTime } from "@/lib/utils";
import { Channel } from "pusher-js";
import usePresenceStore from "@/hooks/usePresenceStore";
import { Message } from "@prisma/client";
import { useRecentChatsStore } from "@/hooks/useRecentChatsStore";
import { useRouter } from "next/navigation";
import { updateReadStatus } from "@/app/actions/messageActions";

type Props = {
  initialChat: Chat | null;
  currentMember: Member;
  chatPartner: Member;
};

export default function ChatThread({
  initialChat,
  currentMember,
  chatPartner,
}: Props) {
  const setCurrentChat = useCurrentChatStore((state) => state.setCurrentChat);
  const currentChat = useCurrentChatStore((state) => state.chat);
  const addMessage = useCurrentChatStore((state) => state.addMessage);
  const updateMessageReadStatus = useCurrentChatStore(
    (state) => state.updateMessageReadStatus
  );

  // Pusher channel reference
  const channelRef = useRef<Channel | null>(null);

  const membersOnline = usePresenceStore((state) => state.membersOnline);

  const updateUnreadCount = useRecentChatsStore(
    (state) => state.updateUnreadCount
  );

  const router = useRouter();

  const handleNewMessage = useCallback(
    async (message: Message) => {
      console.log("New message received:", message); // Debugging statement
      if (message.senderId !== currentMember.id) {
        await updateReadStatus(message.id);
      }
      addMessage(message);
      // getUnreadMessageCount().then((count) => {
      //   updateUnreadCount(currentChat.id, count);
      // });
    },
    [addMessage, updateReadStatus, currentMember.id]
  );

  // const handleReadMessages = useCallback(
  //   (messageIds: string[]) => {
  //     setThreadMessages((prevMessages) =>
  //       prevMessages.map((message) => {
  //         if (messageIds.includes(message.id)) {
  //           return { ...message, dateRead: formatShortDateTime(new Date()) };
  //         } else {
  //           return message;
  //         }
  //       })
  //     );
  //     getUnreadMessageCount().then((count) => {
  //       updateUnreadCount(count);
  //     });
  //   },
  //   [updateUnreadCount]
  // );

  useEffect(() => {
    if (initialChat) setCurrentChat(initialChat);
  }, [initialChat, setCurrentChat]);

  useEffect(() => {
    // getUnreadMessageCount().then((count) => {
    //   updateUnreadCount(count);
    // });
    if (currentChat && currentChat.id && !channelRef.current && initialChat) {
      console.log("Subscribing to channel:", initialChat.id); // Debugging statement
      channelRef.current = pusherClient.subscribe(`private-${initialChat.id}`);
      channelRef.current.bind("new-message", (message: Message) => {
        console.log("Binding 'new-message' to private channel:", message); // Debugging statement
        handleNewMessage(message);
      });
      channelRef.current.bind("message-read", (data: { messageId: string }) => {
        console.log("Binding 'message-read' to private channel:", data.messageId); // Debugging statement
        updateMessageReadStatus(data.messageId);
      });
      // channelRef.current.bind("read-messages", handleReadMessages);
    }

    return () => {
      if (channelRef.current && channelRef.current.subscribed) {
        channelRef.current.unsubscribe();
        channelRef.current.unbind("new-message", handleNewMessage);
        channelRef.current.unbind("message-read", updateMessageReadStatus);
        // channelRef.current.unbind("read-messages", handleReadMessages);
      }
    };
  }, [currentChat?.id, handleNewMessage]);

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
    chatThread = <p>No messages yet</p>;
  }

  return <ul className="flex flex-col">{chatThread}</ul>;
}
