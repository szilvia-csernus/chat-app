"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { useRouter } from "next/navigation";
import RecentChatsList from "./RecentChatsList";

type Props = {
  currentMemberId: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
};

export default function SidebarMobile({
  currentMemberId,
  isSidebarOpen,
  setIsSidebarOpen,
}: Props) {
  const router = useRouter();

  return (
    <>
      <Card
        radius="none"
        className="items-center h-full m-0 border-1 border-slate-300 dark:border-slate-500 bg-zig-zag"
      >
        <CardBody className="flex flex-col h-full items-center p-0">
          <div className="text-xl w-full font-bold pt-4 pb-2 flex justify-center border-b-1 border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-200">
            <span>Your Chats</span>
          </div>
          <RecentChatsList
            currentMemberId={currentMemberId}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </CardBody>
      </Card>
    </>
  );
}
