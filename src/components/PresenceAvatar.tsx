import { Avatar, Badge } from "@heroui/react";
import React from 'react'

type Props = {
  src?: string;
  online: boolean;
  deleted: boolean;
  className?: string;
  own?: boolean;
}

export default function PresenceAvatar({ src, online, deleted, className="", own }: Props) {
  return (
    <div className="relative flex">
      <Badge
        content=""
        color="success"
        shape="circle"
        placement="bottom-right"
        isInvisible={!online || deleted || own}
      >
        <Avatar
          src={src || "/images/user.png"}
          alt="User avatar"
          className={className}
        />
      </Badge>
      {deleted && (
        <div className="absolute bottom-[-9px] bg-gray-400 dark:bg-gray-600 px-1 text-[10px] border-1 rounded-full ">Deleted</div>
      )}
    </div>
  );
}
