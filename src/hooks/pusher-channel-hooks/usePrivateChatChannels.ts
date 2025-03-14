"use client";

import { useEffect, useRef } from "react";
import { Channel } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import { useCallback } from "react";
import { CurrentMember, SerializedMessage } from "@/types";
import { AppStore } from "@/redux-store/store";
import {
  updateMsgReadStatus,
} from "@/redux-store/features/messagesSlice";
import { addNewMessage } from "@/redux-store/thunks";

type Props = {
  store: AppStore;
  currentMember: CurrentMember | null;
};

export const usePrivateChatChannels = ({ store, currentMember }: Props) => {
  console.log("Private Chat");

  // Ref is used to prevent the creation of multiple channels when the component re-renders
  const chatChannelRefs = useRef<{ [key: string]: Channel | null }>({});

  const currentMemberId = currentMember?.id;
  

  const handleNewMessage = useCallback(
    (chatId: string, message: SerializedMessage, date: string) => {
      console.log("Handling new message", chatId);
      store.dispatch(addNewMessage(chatId, message, date))
    },
    []
  );

  const handleMessageRead = useCallback(
    (messageId: string) => {
      store.dispatch(updateMsgReadStatus(messageId));
    },
    [store]
  );

  useEffect(() => {
    if (!currentMemberId) return;

    // at this point, we don't have access to the "useAppSelector" hook yet
    // so we need to get the chat ids from the store directly
    const chats = store.getState().chats.chats;
    const chatIds = Object.keys(chats);
    const activeChatIds = chatIds.filter((id) => !chats[id].inactive);

    // Subscribe to channels for each chat
    activeChatIds.forEach((id) => {
      if (!chatChannelRefs.current[id]) {
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
        chatChannelRefs.current[id] = channel;
      }
    });
    // Cleanup function to unsubscribe from channels
    return () => {
      activeChatIds.forEach((id) => {
        const channel = chatChannelRefs.current[id];
        if (channel) {
          console.log("Unsubscribed from channel", `private-chat-${id}`);
          channel.unbind();
          pusherClient.unsubscribe(`private-chat-${id}`);
          chatChannelRefs.current[id] = null;
        }
      });
    };
  }, [currentMemberId, handleNewMessage, handleMessageRead]);

  return chatChannelRefs.current;
};
