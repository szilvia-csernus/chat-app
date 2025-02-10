"use client";

import { Chat, ChatPartner, RecentChat } from "@/types";
import { HeroUIProvider } from "@heroui/react";
import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import StoreProvider from "./StoreProvider";

type Props = {
  children: ReactNode;
  recentChats: RecentChat[];
  chatPartners: ChatPartner[];
  currentChat: Chat | null;
};

export default function Providers({
  children,
  recentChats,
  chatPartners,
  currentChat
}: Props) {

  const router = useRouter();
  
  return (
    <StoreProvider
      recentChats={recentChats}
      chatPartners={chatPartners}
      currentChat={currentChat}
    >
      <HeroUIProvider navigate={router.push}>
        {children}
      </HeroUIProvider>
    </StoreProvider>
  );
}
