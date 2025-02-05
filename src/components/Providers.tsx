"use client";

import { ChatPartner, RecentChat } from "@/types";
import { HeroUIProvider } from "@heroui/react";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/ReactToastify.min.css";
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
        <ToastContainer
          position="bottom-right"
          hideProgressBar
          className="z-4"
        />
        {children}
      </HeroUIProvider>
    </StoreProvider>
  );
}
