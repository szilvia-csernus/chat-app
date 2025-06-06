"use client";

import { useEffect } from "react";
import { Channel } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import { useCallback } from "react";
import { SerializedMessage } from "@/types";
import {
  updateMsgReadStatus,
} from "@/redux-store/features/messagesSlice";
import { addNewMessage, refreshChat } from "@/redux-store/thunks";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { selectCurrentMemberId } from "@/redux-store/features/currentMemberSlice";
import { selectActiveChatIds, selectChatsPopulated } from "@/redux-store/features/chatsSlice";

// Singleton constant is used for the channel reference to prevent the creation of 
// multiple channels when the component re-renders (useRef would be equally valid)
const chatChannelRefs: { [key: string]: Channel | null } = {};

export const usePrivateChatChannels = () => {

  const dispatch = useAppDispatch();
  const currentMemberId = useAppSelector(selectCurrentMemberId);
  const activeChatIds = useAppSelector(selectActiveChatIds)
  const populated = useAppSelector(selectChatsPopulated);
  

  const handleNewMessage = useCallback(
    (chatId: string, message: SerializedMessage) => {
      dispatch(addNewMessage(chatId, message));
    },
    [dispatch]
  );

  const handleMessageRead = useCallback(
    (messageId: string) => {
      dispatch(updateMsgReadStatus(messageId));
    },
    [dispatch]
  );

  const handleRefreshChat = useCallback(
    (chatId: string) => {
      if (!populated) return;
      dispatch(refreshChat(chatId));
    },
    [dispatch, populated]
  );

  useEffect(() => {
    const previousChatIds = Object.keys(chatChannelRefs);

    if (currentMemberId) {
      // Subscribe to channels for each chat
      for (const id of activeChatIds)  {
        if (!chatChannelRefs[id] || !chatChannelRefs[id].subscribed) {
          const channel = pusherClient.subscribe(`private-chat-${id}`);

          channel.bind(
            "new-message",
            (data: {
              chatId: string;
              message: SerializedMessage;
            }) => {
              handleNewMessage(data.chatId, data.message);
            }
          );
          channel.bind("message-read", (data: { messageId: string }) => {
            handleMessageRead(data.messageId);
          });
          channel.bind("pusher:subscription_succeeded", () => {
            handleRefreshChat(id);
          });
          chatChannelRefs[id] = channel;
        }
      };
    }
    // Unsubscribe from channels that are no longer active
    previousChatIds.forEach((id) => {
      if (!activeChatIds.includes(id)) {
        const channel = chatChannelRefs[id];
        if (channel) {
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
          channel.unbind();
          pusherClient.unsubscribe(`private-chat-${id}`);
          chatChannelRefs[id] = null;
        }
      });
    };
  }, [activeChatIds, currentMemberId, handleNewMessage, handleMessageRead, handleRefreshChat]);

  return null;
};
