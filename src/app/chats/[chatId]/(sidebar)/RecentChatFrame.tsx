"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

type Props = {
  chatId: string;
  children: React.ReactNode;
};


export default function RecentChatFrame({
  chatId,
  children,
}: Props) {

  const params = useParams();
  const currentChatId = params.chatId;

  const additionalStyles = currentChatId === chatId
      ? "border-1 border-slate-400 rounded-2xl bg-white"
      : "";

  return (
    <Link
      className={`relative flex flex-row items-center w-full cursor-pointer ${additionalStyles}`}
      href={`/chats/${chatId}`}
    >
      {children}
    </Link>
  );
};
