"use client";

import { useEffect, useRef } from "react";
import { Channel } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import { useCurrentChatStore } from "../zustand-stores/useCurrentChatStore";
import { Message } from "@prisma/client";
import { useCallback } from "react";
import { useRecentChatsStore } from "@/hooks/zustand-stores/useRecentChatsStore";
import { updateReadStatus } from "@/app/actions/messageActions";
import { getUnreadMessageCount } from "@/app/actions/chatActions";


export const usePrivateChatChannels = (currentMemberId: string) => {

  // Ref is used to prevent the creation of multiple channels when the component re-renders
  const channelRefs = useRef<{ [key: string]: Channel | null }>({});
  const updateMessageReadStatus = useCurrentChatStore(
    (state) => state.updateMessageReadStatus
  );

  const recentChats = useRecentChatsStore((state) => state.recentChats);
  const currentChat = useCurrentChatStore((state) => state.chat);

  const addMessage = useCurrentChatStore((state) => state.addMessage);
  const addLastMessageToRecentChat = useRecentChatsStore((state) => state.addLastMessageToRecentChat);
  const updateUnreadCount = useRecentChatsStore(
    (state) => state.updateUnreadCount
  );
  const setAllUnreadMessageCount = useRecentChatsStore((state) => state.setAllUnreadMessageCount);

  const handleNewMessage = useCallback(
    async (chatId: string, message: Message) => {
      if (currentChat && currentChat.id === chatId) {
        addMessage(message);
      }

      if (
        currentChat &&
        currentChat.id === chatId && 
        message.senderId !== currentMemberId
      ) {
        console.log("New message received for chat: ",chatId, message);
        console.log("Current chat is: ", currentChat.id);
        await updateReadStatus(message.id);
      }
      
      addLastMessageToRecentChat(chatId, message.content);
      if (chatId) {
        const unreadCount = await getUnreadMessageCount(chatId);
        console.log("Unread count for chat", chatId, "is", unreadCount);
        updateUnreadCount(chatId, unreadCount);
        setAllUnreadMessageCount();
      }
    },
    [currentMemberId, addMessage, updateUnreadCount, setAllUnreadMessageCount]
  );

  const handleMessageRead = useCallback(
    (messageId: string) => {
      updateMessageReadStatus(messageId);
      setAllUnreadMessageCount();
    },
    [updateMessageReadStatus, setAllUnreadMessageCount]);


  useEffect(() => {
    console.log("useEffect triggered with chats:", recentChats);

    // Subscribe to channels for each chat
    recentChats.forEach((chat) => {
      if (!channelRefs.current[chat.id]) {
        const channel = pusherClient.subscribe(`private-chat-${chat.id}`);
        console.log("Subscribed to channel", `private-chat-${chat.id}`);
        channel.bind("new-message", (data: {chatId: string, message: Message}) => {
          console.log("New message received", data.chatId, data.message);
          handleNewMessage(data.chatId, data.message);
        });
        channel.bind("message-read", (data: { messageId: string }) => {
          console.log("Message read event received", data);
          handleMessageRead(data.messageId);
        });
        channelRefs.current[chat.id] = channel;
        console.log(channelRefs.current);
      }
    });
    // Cleanup function to unsubscribe from channels
    return () => {
      recentChats.forEach((chat) => {
        const channel = channelRefs.current[chat.id];
        if (channel) {
          console.log("Unsubscribed from channel", `private-chat-${chat.id}`);
          channel.unbind("new-message");
          channel.unbind("message-read");
          pusherClient.unsubscribe(`private-chat-${chat.id}`);
          channelRefs.current[chat.id] = null;
        }
      });
    };
  }, [recentChats.length]);

  return channelRefs.current;
};
