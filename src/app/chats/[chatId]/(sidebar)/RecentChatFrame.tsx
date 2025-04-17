"use client";

import { closeSidebar } from "@/redux-store/features/uiSlice";
import { useAppDispatch } from "@/redux-store/hooks";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

type Props = {
  chatId: string;
  children: React.ReactNode;
};

export default function RecentChatFrame({ chatId, children }: Props) {
  const params = useParams();
  const currentChatId = params.chatId;
  const dispatch = useAppDispatch();

  const additionalStyles =
    currentChatId === chatId ? "bg-white dark:bg-gray-800" : "";
  

  return (
    <Link
      className={`relative flex flex-row justify-between items-center h-18 
        rounded-none cursor-pointer border-b-1 border-slate-300 dark:border-slate-700  
        ${additionalStyles}`}
      href={`/chats/${chatId}`}
      onClick={() => dispatch(closeSidebar())}
    >
      {children}
    </Link>
  );
}
