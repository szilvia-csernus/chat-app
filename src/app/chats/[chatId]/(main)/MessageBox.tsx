'use client';

import PresenceAvatar from "@/components/PresenceAvatar";
import { Member, SerializedMessage } from "@/types";
import clsx from "clsx";
import { useEffect, useRef } from "react";

type MessageBoxProps = {
  message: SerializedMessage;
  read: boolean;
  currentMember: Member;
  chatPartner: Member;
  isCurrentMemberSender: boolean;
  isChatPartnerOnline: boolean;
};

export default function MessageBox({
  message,
  read,
  currentMember,
  chatPartner,
  isCurrentMemberSender,
  isChatPartnerOnline,
}: MessageBoxProps) {

  const sender = isCurrentMemberSender ? currentMember : chatPartner;
  const online = isCurrentMemberSender ? true : isChatPartnerOnline;

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }
  , [messageEndRef]);

  const renderAvatar = () => (
    <PresenceAvatar
      src={sender.image || "/images/user.png"}
      online={online}
      className="self-end"
    />
  );

  const messageContentClasses = clsx(
    "flex flex-col px-2 py-1 border-1 border-slate-300",
    {
      "rounded-l-2xl rounded-tr-2xl bg-green-100": isCurrentMemberSender,
      "rounded-r-2xl rounded-tl-2xl bg-white":
        !isCurrentMemberSender,
    }
  );

  const rendermessageHeader = () => (
    <div className={clsx('flex items-center w-full mt-1 text-secondary', {
      'justify-end': isCurrentMemberSender,
    })}>
      
      <div className='flex'>
        <span className='text-xs font-semibold '>{sender.name}</span>
        <span className='text-xs ml-2 '>{message.createdAt}</span>
      </div>
    </div>

  )

  const renderMessageContent = () => (
    <div className="flex flex-col">
      <div className={messageContentClasses}>
        {rendermessageHeader()}
        <p className="text-sm py-3 text-gray-900">{message.content}</p>
      </div>
      {read && message.senderId === currentMember.id ? (
        <div className="text-xs text-gray-400 text-italic">Seen &#10003;</div>
      ) : (
        <div></div>
      )}
    </div>
  );


  return (
    <div className="grid grid-rows-1">
      <div
        className={clsx(
          "flex gap-2 mb-3",
          {
            "justify-end text-right": isCurrentMemberSender,
          },
          { "justyfy-start": !isCurrentMemberSender }
        )}
      >
        {!isCurrentMemberSender && renderAvatar()}
        {renderMessageContent()}
        {isCurrentMemberSender && renderAvatar()}
      </div>
      <div ref={messageEndRef} />
    </div>
  );
}
