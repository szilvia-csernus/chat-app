"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

type Props = {
  chatId: string;
  children: React.ReactNode;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (isOpen: boolean) => void;
};

export default function RecentChatFrame({ chatId, children, isSidebarOpen, setIsSidebarOpen }: Props) {
  const params = useParams();
  const currentChatId = params.chatId;

  const additionalStyles =
    currentChatId === chatId ? "bg-white dark:bg-gray-800" : "";
  
  const clickHandler = () => {
    if (setIsSidebarOpen) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  }

  return (
    <Link
      className={`relative flex flex-row justify-between items-center w-full cursor-pointer border-b-1 border-slate-300 dark:border-slate-500  ${additionalStyles}`}
      href={`/chats/${chatId}`}
      onClick={clickHandler}
    >
      {children}
    </Link>
  );
}
