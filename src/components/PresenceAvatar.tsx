import React from "react";
import MemberImage from "./MemberImage";
import PresenceDot from "./PresenceDot";

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
    <div
      className={`relative flex justify-center items-end text-xs ${classNames}`}
    >
      <div>
        <PresenceDot online={online} deleted={deleted} own={own}>
          <div
            className={`border-1 border-slate-300 dark:border-slate-500 rounded-full overflow-hidden w-[${imageWidth}px] h-[${imageHeight}px]`}
          >
            <MemberImage
              memberImage={src || "/images/user.png"}
              memberName="User avatar"
              imageWidth={imageWidth}
              imageHeight={imageHeight}
              className=" z-5"
            />
          </div>
        </PresenceDot>
      </div>

      {deleted && (
        <div className="absolute bottom-[-7px] bg-gray-400 dark:bg-gray-600 px-1 py-0 text-[10px] border-1 rounded-full ">
          Deleted
        </div>
      )}
    </div>
  );
}
