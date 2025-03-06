"use client";

import { CurrentMember, RawChatData } from "@/types";
import { HeroUIProvider } from "@heroui/react";
import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import StoreProvider from "./StoreProvider";

type Props = {
  children: ReactNode;
  currentMember: CurrentMember | null;
  recentChats: RawChatData[] | null;
  currentChat: RawChatData | null;
};

export default function Providers({
  children,
  currentMember,
  recentChats,
  currentChat,
}: Props) {
  const router = useRouter();

  return (
    <StoreProvider
      currentMember={currentMember}
      recentChats={recentChats}
      currentChat={currentChat}
    >
      <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
    </StoreProvider>
  );
}
