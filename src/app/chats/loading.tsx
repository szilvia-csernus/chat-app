"use client";

import { Skeleton } from "@heroui/react";

export default function Loading() {
  return (
    <div className="grid grid-cols-12 gap-1">
      <Skeleton className="rounded-xl col-span-5 lg:col-span-4 h-[85vh] dark:bg-gray-700" />
      <Skeleton className="rounded-xl col-span-7 lg:col-span-8 h-[85vh] dark:bg-gray-700" />
    </div>
  );
}
