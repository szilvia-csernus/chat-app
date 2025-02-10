"use client";
import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/redux-store/store";
import { setChatPartners } from "@/redux-store/features/chatPartnersSlice";
import { Chat, ChatPartner, RecentChat } from "@/types";
import { setRecentChats } from "@/redux-store/features/recentChatsSlice";
import { setPresentMembers } from "@/redux-store/features/presenceSlice";
import { setCurrentChat } from "@/redux-store/features/currentChatSlice";


type Props = {
  children: ReactNode;
  recentChats: RecentChat[];
  chatPartners: ChatPartner[];
  currentChat: Chat | null;
};

export default function StoreProvider({
  children,
  recentChats,
  chatPartners,
  currentChat,
}: Props) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Creates the redux store instance the first time this renders
    storeRef.current = makeStore();
    // sets store with initial data
    storeRef.current.dispatch(setRecentChats(recentChats));
    storeRef.current.dispatch(setChatPartners(chatPartners));
    storeRef.current.dispatch(setPresentMembers([]));
    storeRef.current.dispatch(setCurrentChat(currentChat));
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
