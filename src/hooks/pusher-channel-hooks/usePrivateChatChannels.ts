"use client";

import { useEffect } from "react";
import { Channel } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import { useCallback } from "react";
import { SerializedMessage } from "@/types";
import {
  updateMsgReadStatus,
} from "@/redux-store/features/messagesSlice";
import { addNewMessage } from "@/redux-store/thunks";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { selectCurrentMemberId } from "@/redux-store/features/currentMemberSlice";
import { selectActiveChatIds } from "@/redux-store/features/chatsSlice";


// Singleton constant is used for the channel reference to prevent the creation of 
// multiple channels when the component re-renderss
const chatChannelRefs: { [key: string]: Channel | null } = {};

export const usePrivateChatChannels = () => {
  console.log("Private Chat");

  const dispatch = useAppDispatch();
  const currentMemberId = useAppSelector(selectCurrentMemberId);
  const activeChatIds = useAppSelector(selectActiveChatIds)

  const handleNewMessage = useCallback(
    (chatId: string, message: SerializedMessage, date: string) => {
      console.log("Handling new message", chatId);
      dispatch(addNewMessage(chatId, message, date));
    },
    [dispatch]
  );

  const handleMessageRead = useCallback(
    (messageId: string) => {
      dispatch(updateMsgReadStatus(messageId));
    },
    [dispatch]
  );

  useEffect(() => {
    const previousChatIds = Object.keys(chatChannelRefs);

    if (currentMemberId) {
      // Subscribe to channels for each chat
      activeChatIds.forEach((id) => {
        if (!chatChannelRefs[id] || !chatChannelRefs[id].subscribed) {
          const channel = pusherClient.subscribe(`private-chat-${id}`);
          console.log(
            "usePrivateChatChannel: Subscribed to chat channel",
            `private-chat-${id}`
          );

          channel.bind(
            "new-message",
            (data: {
              chatId: string;
              message: SerializedMessage;
              date: string;
            }) => {
              // console.log("New message received", data.chatId, data.message);
              handleNewMessage(data.chatId, data.message, data.date);
            }
          );
          channel.bind("message-read", (data: { messageId: string }) => {
            // console.log("Message read event received", data);
            handleMessageRead(data.messageId);
          });
          chatChannelRefs[id] = channel;
        }
      });
    }
    // Unsubscribe from channels that are no longer active
    previousChatIds.forEach((id) => {
      if (!activeChatIds.includes(id)) {
        const channel = chatChannelRefs[id];
        if (channel) {
          console.log("Unsubscribed from channel", `private-chat-${id}`);
          channel.unbind();
          pusherClient.unsubscribe(`private-chat-${id}`);
          chatChannelRefs[id] = null;
        }
      }
    });
    // Cleanup function to unsubscribe from channels
    return () => {
      activeChatIds.forEach((id) => {
        const channel = chatChannelRefs[id];
        if (channel) {
          console.log("Unsubscribed from channel", `private-chat-${id}`);
          channel.unbind();
          pusherClient.unsubscribe(`private-chat-${id}`);
          chatChannelRefs[id] = null;
        }
      });
    };
  }, [activeChatIds, currentMemberId, handleNewMessage, handleMessageRead]);

  return chatChannelRefs;
};
