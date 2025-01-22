import React, { useMemo } from "react";
import { ChatPartner as ChatPartnerType } from "@/types";
import ChatPartner from "./ChatPartner";

type ChatPartnerListProps = {
  chatPartners: ChatPartnerType[];
  chatId: string;
  membersOnline: string[];
};

const ChatPartnerList: React.FC<ChatPartnerListProps> = ({
  chatPartners,
  chatId,
  membersOnline,
}) => {
  const memoizedChatPartners = useMemo(() => {
    return chatPartners.map((cp) => (
      <ChatPartner
        key={cp.chatPartner.id}
        chatPartner={cp}
        chatId={chatId}
        membersOnline={membersOnline}
      />
    ));
  }, [chatPartners, chatId, membersOnline]);

  return <>{memoizedChatPartners}</>;
};

export default React.memo(ChatPartnerList);
