import React from "react";

type PresenceDotProps = {
  outlineColor?: string;
  children: React.ReactNode;
  online?: boolean;
  deleted?: boolean;
  own?: boolean;
};

export default function PresenceDot({
  children,
  online,
  deleted,
  own,
}: PresenceDotProps) {
  return (
    <div className="relative">
      {children}
      {online && !deleted && !own && (
        <div className="border-1 border-primary w-[13px] h-[13px] rounded-full bg-teal-400 animate-pulse absolute bottom-0 right-0"></div>
      )}
    </div>
  );
}
