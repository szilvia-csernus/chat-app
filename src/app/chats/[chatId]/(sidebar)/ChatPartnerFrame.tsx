import Link from "next/link";
import React, { useMemo } from "react";
import { ChatPartner as ChatPartnerType } from "@/types";

type Props = {
  children: React.ReactNode;
  chatPartner: ChatPartnerType;
  chatId: string;
};


const ChatPartnerFrame: React.FC<Props> = ({
  children,
  chatPartner,
  chatId,
}) => {

  const additionalStyles = useMemo(() => {
    return chatPartner.chatId === chatId
      ? "border-1 border-secondary rounded-lg"
      : "";
  }, [chatPartner.chatId, chatId]);
  console.log("additionalStyles", additionalStyles);

  return (
    <Link
      key={chatPartner.chatPartner.id}
      className={`relative flex flex-row items-center gap-2 w-full cursor-pointer ${additionalStyles}`}
      href={`/chats/${chatPartner.chatId}`}
    >
      {children}
    </Link>
  );
};

export default React.memo(ChatPartnerFrame);
