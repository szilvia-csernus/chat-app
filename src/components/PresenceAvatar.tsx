import { Avatar, Badge } from "@heroui/react";
import React from "react";
import MemberImage from "./MemberImage";

type Props = {
  src?: string;
  online: boolean;
  deleted: boolean;
  className?: string;
  own?: boolean;
};

export default function PresenceAvatar({
  src,
  online,
  deleted,
  own,
}: Props) {
  return (
    <div className="relative flex items-end">
      <Badge
        content=""
        color="success"
        shape="circle"
        placement="bottom-right"
        isInvisible={!online || deleted || own}
      >
        <MemberImage
          memberImage={src || "/images/user.png"}
          memberName="User avatar"
          width={40}
          height={40}
          className="h-[40px] border-1 border-slate-300 dark:border-slate-500 rounded-full z-5"
        />
      </Badge>
      {deleted && (
        <div className="absolute bottom-[-9px] bg-gray-400 dark:bg-gray-600 px-1 text-[10px] border-1 rounded-full ">
          Deleted
        </div>
      )}
    </div>
  );
}
