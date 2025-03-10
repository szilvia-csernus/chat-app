"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/react";
import RecentChatsList from "./RecentChatsList";
import { useAppSelector } from "@/redux-store/hooks";
import { selectCurrentMember } from "@/redux-store/features/currentMemberSlice";
import { selectIsSidebarOpen } from "@/redux-store/features/uiSlice";


export default function SidebarMobile() {
  const currentMember = useAppSelector(selectCurrentMember);
  console.log("SidebarMobile currentMember", currentMember);
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen);
  const [additionalStyles, setAdditionalStyles] = useState(
    "-left-[200vw]"
  );
  
  useEffect(() => {
    if (isSidebarOpen) {
      setAdditionalStyles("left-0 inset-x-0 size-auto");
    } else {
      setAdditionalStyles("-left-[200vw]");
    }
    return () => {
      setAdditionalStyles("-left-[200vw]");
    }
  }, [isSidebarOpen]);

  return (
    <div
      className={`absolute top-[80px] bottom-0 ${additionalStyles} transition-all duration-400 items-center h-screen m-0 border-1 border-slate-300 dark:border-slate-800 bg-zig-zag z-10`}
    >
      <Card radius="none" className="bg-background">
        <CardBody className="flex flex-col h-full items-center p-0">
          <div className="text-xl w-full font-bold pt-4 pb-3 flex justify-center border-b-1 border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-200">
            <span>Your Chats</span>
          </div>
          {currentMember && <RecentChatsList />}
        </CardBody>
      </Card>
    </div>
  );
}
