"use client";

import { ChatPartner, RecentChat } from "@/types";
import { HeroUIProvider } from "@heroui/react";
import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import StoreProvider from "./StoreProvider";

type Props = {
  children: ReactNode;
  recentChats: RecentChat[];
  chatPartners: ChatPartner[];
};

export default function Providers({
  children,
  recentChats,
  chatPartners,
}: Props) {

  const router = useRouter();
  
  return (
    <StoreProvider
      recentChats={recentChats}
      chatPartners={chatPartners}
    >
      <HeroUIProvider navigate={router.push}>
        {children}
      </HeroUIProvider>
    </StoreProvider>
  );
}
