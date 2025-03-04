"use client";
import { ReactNode, useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/redux-store/store";
import { CurrentMember, RawChatData } from "@/types";
import { usePresenceChannel } from "@/hooks/pusher-channel-hooks/usePresenceChannel";
import { usePrivateChatChannels } from "@/hooks/pusher-channel-hooks/usePrivateChatChannels";
import { usePrivateChannel } from "@/hooks/pusher-channel-hooks/usePrivateChannel";
import { setCurrentMember } from "@/redux-store/features/currentMemberSlice";
import { fetchAllMembers } from "@/redux-store/features/membersSlice";
import { setCurrentChat, setChats } from "@/redux-store/features/chatsSlice";
import { mapRawChatDataListToChatsAndMessages, mapRawChatDataToChatAndMessages } from "@/lib/maps";
import { setMessages } from "@/redux-store/features/messagesSlice";

type Props = {
  currentMember: CurrentMember | null;
  children: ReactNode;
  recentChats: RawChatData[] | null;
  currentChat: RawChatData | null;
};

export default function StoreProvider({
  currentMember,
  children,
  recentChats,
  currentChat,
}: Props) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Creates the redux store instance the first time this renders
    storeRef.current = makeStore();
    // sets store with fetched data
    storeRef.current.dispatch(setCurrentMember(currentMember));
  }

  useEffect(() => {
    if (currentMember && storeRef.current) {
      storeRef.current.dispatch(fetchAllMembers());
    }
  }, [currentMember]);

  useEffect(() => {
    if (currentMember && storeRef.current && recentChats) {
      console.log(
        "StoreProvider useEffect: Setting recent chats in store",
        recentChats
      );
      const { chats, messages } = mapRawChatDataListToChatsAndMessages(recentChats);
      storeRef.current.dispatch(setChats(chats));
      storeRef.current.dispatch(setMessages(messages));
    }
  }, [currentMember, recentChats]);

  useEffect(() => {
    if (currentMember && storeRef.current && currentChat) {
      const result = mapRawChatDataToChatAndMessages(currentChat);
      if (result) {
        const { chat, messages } = result;
        storeRef.current.dispatch(setCurrentChat(chat));
        storeRef.current.dispatch(setMessages(messages));
      }
    }
  }, [currentMember, currentChat]);


  usePresenceChannel({ store: storeRef.current, currentMember });
  usePrivateChannel({ store: storeRef.current, currentMember });
  usePrivateChatChannels({ store: storeRef.current, currentMember });


  return <Provider store={storeRef.current}>{children}</Provider>;
}
