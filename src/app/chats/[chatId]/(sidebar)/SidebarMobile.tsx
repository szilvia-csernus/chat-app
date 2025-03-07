"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import RecentChatsList from "./RecentChatsList";
import { useAppSelector } from "@/redux-store/hooks";
import { selectCurrentMember } from "@/redux-store/features/currentMemberSlice";

type Props = {
  setIsSidebarOpen: (isOpen: boolean) => void;
};

export default function SidebarMobile({
  setIsSidebarOpen,
}: Props) {
  const currentMember = useAppSelector(selectCurrentMember);
  console.log("SidebarMobile currentMember", currentMember);

  return (
    <>
      <Card
        radius="none"
        className="items-center h-screen m-0 border-1 border-slate-300 dark:border-slate-800 bg-zig-zag"
      >
        <CardBody className="flex flex-col h-full items-center p-0">
          <div className="text-xl w-screen font-bold pt-4 pb-3 flex justify-center border-b-1 border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-200">
            <span>Your Chats</span>
          </div>
          {currentMember && (
            <RecentChatsList
              setIsSidebarOpen={setIsSidebarOpen}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
}
