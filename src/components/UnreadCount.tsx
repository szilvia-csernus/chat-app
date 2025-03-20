import React from 'react'

type Props = {
  unreadCount: number;
  className: string;
}

export default function UnreadCount({unreadCount, className}: Props) {
  return (
    <div className={`bg-accent rounded-full text-slate-700 font-bold text-xs p-[2px] min-w-5 flex items-center justify-center ${className}`}>
      {unreadCount}
    </div>
  );
}
