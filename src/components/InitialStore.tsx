"use client";
import { useRef } from "react";
import { CurrentMember, ProfileData, RawChatData } from "@/types";
import { usePopulateStore } from "@/redux-store/hooks";


type Props = {
  currentMember: CurrentMember | null;
  membersData: ProfileData[] | null;
  recentChats: RawChatData[] | null;
  currentChat: RawChatData | null;
};

export default function InitialStore({
  currentMember,
  membersData,
  recentChats,
  currentChat,
}: Props) {
  const initialized = useRef(false);

  if (!initialized.current) {
    console.log("InitialStore: Setting initial store data", 
      "currentMember", !!currentMember,
      "recentChats", !!recentChats,
      "currentChat", !!currentChat
    );

    if (!currentMember) return;

    usePopulateStore({
      currentMember,
      membersData,
      recentChats,
      currentChat,
    });

    initialized.current = true;
  }

  return null;
}

