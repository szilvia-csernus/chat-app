"use client";

import React, { useEffect, useState } from "react";
import SidebarDesktop from "./(sidebar)/SidebarDesktop";
import SidebarMobile from "./(sidebar)/SidebarMobile";
import { ChatData, RawChatData } from "@/types";
import Chat from "./(main)/Chat";

type Props = {
  initialChat: RawChatData | null;
};

export default function Chats({
  initialChat,
}: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [additionalStyles, setAdditionalStyles] = useState("");

  useEffect(() => {
    if (isSidebarOpen) {
      setAdditionalStyles("visible");
    } else {
      setAdditionalStyles("collapse");
    }
  }, [isSidebarOpen]);

  return (
    <div className=" w-full h-full sm:grid sm:grid-cols-12 sm:gap-1 mx-0 my-0 sm:my-1 relative">
      {isSidebarOpen && (
        <div
          className={`absolute left-0 right-0 top-0 bottom-0 z-30 bg-inherit min-w-md sm:hidden ${additionalStyles}`}
        >
          <SidebarMobile
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
      )}
      <div className="hidden sm:flex sm:col-span-5">
        <SidebarDesktop />
      </div>
      <div className="w-full sm:col-span-7 relative">
        <Chat
          initialChat={initialChat}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
    </div>
  );
}
