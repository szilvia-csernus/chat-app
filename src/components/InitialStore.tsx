"use client";
import { useRef } from "react";
import { CurrentMember, ProfileData, RawChatData } from "@/types";
import { usePopulateStore } from "@/redux-store/hooks";


type Props = {
  currentMember: CurrentMember | null;
  membersData: ProfileData[] | null;
  recentChats: RawChatData[] | null;
};

export default function InitialStore({
  currentMember,
  membersData,
  recentChats,
}: Props) {
  const initialized = useRef(false);

  if (!initialized.current) {
    if (!currentMember) return;

    usePopulateStore({
      currentMember,
      membersData,
      recentChats,
    });

    initialized.current = true;
  }

  return null;
}

