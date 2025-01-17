"use client";

import { useRecentChatsStore } from "@/hooks/useRecentChatsStore";
import { usePresenceChannel } from "@/hooks/usePresenceChannel";
import { useChatPartnersStore } from "@/hooks/useChatPartnersStore";
import { ChatPartner, RecentChat } from "@/types";
import { NextUIProvider } from "@nextui-org/react";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

type ProvidersProps = {
  children: ReactNode;
  userId: string;
  recentChats: RecentChat[] | null;
  chatPartners: ChatPartner[] | null;
};

export default function Providers({
  children,
  userId,
  recentChats,
  chatPartners,
}: ProvidersProps) {
  usePresenceChannel(userId);
  const { set: setRecentChats } = useRecentChatsStore();
  if (recentChats) {
    setRecentChats(recentChats);
  }
  const { set: setChatPartners } = useChatPartnersStore();
  if (chatPartners) {
    setChatPartners(chatPartners);
  }

  return (
    <NextUIProvider>
      <ToastContainer position="bottom-right" hideProgressBar className="z-4" />
      {children}
    </NextUIProvider>
  );
}
