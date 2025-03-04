"use client";

import { Skeleton } from "@heroui/react";

export default function Loading() {
  return (
    <div className="grid grid-cols-12 gap-1">
      <Skeleton className="rounded-xl col-span-5 lg:col-span-4 h-[85vh] dark:bg-gray-700">
        <div className="flex flex-row gap-2">
          <Skeleton className="m-1 rounded-full h-[52px] w-[52px]" />

          <div className="my-2 flex flex-col gap-2">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
          </div>
        </div>
      </Skeleton>
      <Skeleton className="rounded-xl col-span-7 lg:col-span-8 h-[85vh] dark:bg-gray-700" />
    </div>
  );
}
