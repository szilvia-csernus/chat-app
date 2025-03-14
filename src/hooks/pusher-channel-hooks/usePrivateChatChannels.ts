"use client";

import { useEffect, useRef } from "react";
import { Channel } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import { useCallback } from "react";
import { updateReadStatus } from "@/app/actions/messageActions";
import { getUnreadMessageCount } from "@/app/actions/chatActions";
import { CurrentMember, SerializedMessage} from "@/types";
import { useParams } from "next/navigation";
import { AppStore } from "@/redux-store/store";
import { addMessageId, updateUnreadCount } from "@/redux-store/features/chatsSlice";
import { addNewMessage, updateMessageReadStatus } from "@/redux-store/features/messagesSlice";

type Props = {
  store: AppStore;
  currentMember: CurrentMember | null;
}

export const usePrivateChatChannels = ({ store, currentMember }: Props) => {
  console.log("Private Chat");

  // Ref is used to prevent the creation of multiple channels when the component re-renders
  const chatChannelRefs = useRef<{ [key: string]: Channel | null }>({});

  // storing the active chatid in a ref to be used in the handleNewMessage function
  // which otherwise would not have access to it when
  // triggered by the channel event
  const currentChatRef = useRef<string | null>(null);
  const params = useParams<{ chatId: string }>();
  currentChatRef.current = params.chatId;
  // console.log("Active chat in usePrivateChatChannels", currentChatRef.current);
  
  const currentMemberId = currentMember?.id;
  
  // at this point, we don't have access to the "useAppSelector" hook yet
  // so we need to get the chat ids from the store directly
  const chats = store.getState().chats.chats;
  const chatIds = Object.keys(chats);
  const activeChatIds = chatIds.filter((id) => !chats[id].inactive);
  

  const handleNewMessage = useCallback(
    async (chatId: string, message: SerializedMessage, date: string) => {
      console.log("Handling new message", chatId, currentChatRef.current);
      // If the message is for the acctive chat, add it to the chat
      // on either or both the sender and receiver side
      if (currentChatRef.current === chatId) {
        console.log(
          "Adding message to active chat...",
          currentChatRef.current
        );
        store.dispatch(addNewMessage(message));
        store.dispatch(addMessageId({ chatId, senderId: message.senderId!, messageId: message.id, date }));
      }

      // Receiver side: if the message is not for the active chat,
      // update the unread count for that chat
      if (
        currentChatRef.current !== chatId &&
        message.senderId !== currentMemberId
      ) {
        const unreadCount = await getUnreadMessageCount(chatId);
         store.dispatch(updateUnreadCount({ chatId, count: unreadCount }));
      }

      // Receiver side: if the message is for the active chat,
      // update the read status of the message
      if (
        currentChatRef.current === chatId &&
        message.senderId !== currentMemberId
      ) {
        // console.log("New message received for chat: ", chatId, message);
        // console.log("Active chat is: ", currentChatRef.current);
        await updateReadStatus(message.id);
      }
    },
    [
      currentMemberId,
      store,
    ]
  );

  const handleMessageRead = useCallback(
    (messageId: string) => {
       store.dispatch(updateMessageReadStatus(messageId));
    },
    [store]
  );

  useEffect(() => {
    if (!currentMemberId) return;
    
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
          (data: { chatId: string; message: SerializedMessage, date: string }) => {
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
  }, [currentMemberId, activeChatIds, handleNewMessage, handleMessageRead]);

  return chatChannelRefs.current;
};
