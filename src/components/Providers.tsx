"use client";

import { useRecentChatsStore } from "@/hooks/useRecentChatsStore";
import { usePresenceChannel } from "@/hooks/usePresenceChannel";
import { useChatPartnersStore } from "@/hooks/useChatPartnersStore";
import { ChatPartner, RecentChat } from "@/types";
import { HeroUIProvider } from "@heroui/react";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

type ProvidersProps = {
  children: ReactNode;
  userId: string;
  recentChats: RecentChat[];
  chatPartners: ChatPartner[];
};

export default function Providers({
  children,
  userId,
  recentChats,
  chatPartners,
}: ProvidersProps) {

  usePresenceChannel(userId);
  
  const setRecentChats = useRecentChatsStore(state => state.setRecentChats)
  setRecentChats(recentChats);
  
  const setChatPartners = useChatPartnersStore(state => state.setChatPartners);
  setChatPartners(chatPartners);


  return (
    <HeroUIProvider>
      <ToastContainer position="bottom-right" hideProgressBar className="z-4" />
      {children}
    </HeroUIProvider>
  );
}
