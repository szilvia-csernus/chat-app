import { Badge } from "@heroui/react";
import React from "react";
import MemberImage from "./MemberImage";

type Props = {
  src?: string;
  online?: boolean;
  deleted?: boolean;
  classNames?: string;
  imageWidth?: number;
  imageHeight?: number;
  own?: boolean;
};

export default function PresenceAvatar({
  src,
  online,
  deleted,
  classNames,
  imageWidth,
  imageHeight,
  own,
}: Props) {
  return (
    <div className={`relative flex justify-center items-end text-xs ${classNames}`}>
      <Badge
        content=""
        color="success"
        shape="circle"
        placement="bottom-right"
        isInvisible={!online || deleted || own}
      >
        <div className="1">
          <MemberImage
            memberImage={src || "/images/user.png"}
            memberName="User avatar"
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            className="border-1 border-slate-300 dark:border-slate-500 rounded-full z-5"
          />
        </div>
      </Badge>
      {deleted && (
        <div className="absolute bottom-[-7px] bg-gray-400 dark:bg-gray-600 px-1 py-0 text-[10px] border-1 rounded-full ">
          Deleted
        </div>
      )}
    </div>
  );
}
