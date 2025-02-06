"use client";

import { useEffect, useRef } from "react";
import { Channel } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import { Message } from "@prisma/client";
import { useCallback } from "react";
import { updateReadStatus } from "@/app/actions/messageActions";
import { getUnreadMessageCount } from "@/app/actions/chatActions";
import {
  addLastMessageToRecentChat,
  selectRecentChats,
  setAllUnreadMessageCount,
  updateUnreadCount,
} from "@/redux-store/features/recentChatsSlice";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  addMessage,
  selectCurrentChat,
  updateMessageReadStatus,
} from "@/redux-store/features/currentChatSlice";
import { Chat, SerializedMessage } from "@/types";
import { serializeMessage } from "@/lib/serialize";


export const usePrivateChatChannels = (currentMemberId: string | null) => {
  // Ref is used to prevent the creation of multiple channels when the component re-renders
  const channelRefs = useRef<{ [key: string]: Channel | null }>({});
  const dispatch = useAppDispatch();

  // storing the current chat in a ref to use in the handleNewMessage function
  // which otherwise would not have access to the current chat when it is
  // triggered by the channel event
  const currentChatRef = useRef(<Chat | null>null);
  currentChatRef.current = useAppSelector(selectCurrentChat);
  console.log("Current chat in usePrivateChatChannels", currentChatRef.current);

  const recentChats = useAppSelector(selectRecentChats);


  const handleNewMessage = useCallback(
    async (chatId: string, message: SerializedMessage) => {
      console.log("Handling new message", chatId, currentChatRef.current?.id);
      // If the message is for the current chat, add it to the chat
      // on either or both the sender and receiver side
      if (currentChatRef.current && currentChatRef.current.id === chatId) {
        console.log(
          "Supposed to add message to current chat",
          currentChatRef.current.id
        );
        dispatch(addMessage(message));
      }
      dispatch(
        addLastMessageToRecentChat({ chatId, content: message.content })
      );

      // Receiver side: if the message is not for current chat,
      // update the unread count for that chat
      if (
        currentChatRef.current &&
        currentChatRef.current.id !== chatId &&
        message.senderId !== currentMemberId
      ) {
        const unreadCount = await getUnreadMessageCount(chatId);
        dispatch(updateUnreadCount({ chatId, count: unreadCount }));
        dispatch(setAllUnreadMessageCount());
      }

      // Receiver side: if the message is for the current chat,
      // update the read status of the message
      if (
        currentChatRef.current &&
        currentChatRef.current.id === chatId &&
        message.senderId !== currentMemberId
      ) {
        console.log("New message received for chat: ", chatId, message);
        console.log("Current chat is: ", currentChatRef.current.id);
        await updateReadStatus(message.id);
      }
    },
    [
      currentMemberId,
      addMessage,
      updateUnreadCount,
      setAllUnreadMessageCount,
      currentChatRef.current
    ]
  );

  const handleMessageRead = useCallback(
    (messageId: string) => {
      dispatch(updateMessageReadStatus(messageId));
      dispatch(setAllUnreadMessageCount());
    },
    [updateMessageReadStatus, setAllUnreadMessageCount]
  );

  useEffect(() => {
    console.log("useEffect triggered with chats:", recentChats);

    // Subscribe to channels for each chat
    recentChats.forEach((chat) => {
      if (!channelRefs.current[chat.id]) {
        const channel = pusherClient.subscribe(`private-chat-${chat.id}`);
        console.log("Subscribed to channel", `private-chat-${chat.id}`);
        channel.bind(
          "new-message",
          (data: { chatId: string; message: Message }) => {
            const serializedMessage = serializeMessage(data.message);
            console.log("New message received", data.chatId, serializedMessage);
            handleNewMessage(data.chatId, serializedMessage);
          }
        );
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
