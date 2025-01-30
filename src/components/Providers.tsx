"use client";

import { useRecentChatsStore } from "@/hooks/zustand-stores/useRecentChatsStore";
import { usePresenceChannel } from "@/hooks/pusher-channel-hooks/usePresenceChannel";
import { useChatPartnersStore } from "@/hooks/zustand-stores/useChatPartnersStore";
import { ChatPartner, RecentChat } from "@/types";
import { HeroUIProvider } from "@heroui/react";
import React, { ReactNode, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/ReactToastify.min.css";

type Props = {
  children: ReactNode;
  currentProfileId: string | null;
  recentChats: RecentChat[];
  chatPartners: ChatPartner[];
};

export default function Providers({
  children,
  currentProfileId,
  recentChats,
  chatPartners,
}: Props) {
  usePresenceChannel(currentProfileId);

  const router = useRouter();

  const setRecentChats = useRecentChatsStore((state) => state.setRecentChats);
  const setChatPartners = useChatPartnersStore(
    (state) => state.setChatPartners
  );

  useEffect(() => {
    setRecentChats(recentChats);
    setChatPartners(chatPartners);
  }, [recentChats, chatPartners, setRecentChats, setChatPartners]);

  return (
    <HeroUIProvider navigate={router.push}>
      <ToastContainer position="bottom-right" hideProgressBar className="z-4" />
      {children}
    </HeroUIProvider>
  );
}
