import Link from "next/link";
import React from "react";

type Props = {
  chatId: string;
  children: React.ReactNode;
  currentChatId: string;
};


export default function RecentChatFrame({
  chatId,
  children,
  currentChatId,
}: Props) {

  console.log("currentChatId", currentChatId);
  console.log("chatId", chatId);

  const additionalStyles = currentChatId === chatId
      ? "border-1 border-secondary rounded-lg"
      : "";

  return (
    <Link
      key={chatId}
      className={`relative flex flex-row items-center gap-2 w-full cursor-pointer ${additionalStyles}`}
      href={`/chats/${chatId}`}
    >
      {children}
    </Link>
  );
};
