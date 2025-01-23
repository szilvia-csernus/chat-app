import { Skeleton } from '@heroui/react';
import React from 'react'

export default function RecentChatFallback() {
  return (
    <div className="flex flex-row gap-2">
      <Skeleton className="m-1 rounded-full h-[52px] w-[52px]" />

      <div className="my-2 flex flex-col gap-2">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
      </div>
    </div>
  );
}
