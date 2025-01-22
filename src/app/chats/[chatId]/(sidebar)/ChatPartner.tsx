import React, { useMemo } from "react";
import PresenceDot from "@/components/PresenceDot";
import MemberImage from "@/app/members/MemberImage";
import { ChatPartner as ChatPartnerType } from "@/types";
import ChatPartnerFrame from "./ChatPartnerFrame";

type Props = {
  chatPartner: ChatPartnerType;
  chatId: string;
  membersOnline: string[];
};

const ChatPartner: React.FC<Props> = ({
  chatPartner,
  chatId,
  membersOnline,
}) => {
  const online = useMemo(() => {
    return membersOnline.includes(chatPartner.chatPartner.id);
  }, [membersOnline, chatPartner.chatPartner.id]);

  return (
    <ChatPartnerFrame chatPartner={chatPartner} chatId={chatId}>
      <div className="m-1 rounded-full border-2 border-slate-500 overflow-hidden">
        <MemberImage
          memberImage={
            chatPartner.chatPartner.image ? chatPartner.chatPartner.image : ""
          }
          memberName={
            chatPartner.chatPartner.name ? chatPartner.chatPartner.name : ""
          }
          width={50}
          height={50}
        />
        {online && (
          <div className="absolute top-9 left-11 z-20">
            <PresenceDot outlineColor="white" />
          </div>
        )}
      </div>
      <div className="flex flex-col relative">
        <div>{chatPartner.chatPartner.name}</div>
        <div className="text-xs text-gray-500">{"No messages yet"}</div>
      </div>
    </ChatPartnerFrame>
  );
};

export default React.memo(ChatPartner);
