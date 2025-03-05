"use client";

import { useRef } from "react";
import { Card } from "@heroui/card";
import ChatThread from "./ChatThread";
import ChatForm from "./ChatForm";
import CurrentChatPartner from "./CurrentChatPartner";
import { RawChatData } from "@/types";
import { useAppDispatch } from "@/redux-store/hooks";
import { setCurrentChat } from "@/redux-store/features/chatsSlice";
import { mapRawChatDataToChatAndMessages } from "@/lib/maps";
import { setMessages } from "@/redux-store/features/messagesSlice";

type Props = {
  initialChat: RawChatData | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
};

export default function Chat({
  initialChat,
  isSidebarOpen,
  setIsSidebarOpen,
}: Props) {
  const dispatch = useAppDispatch();


  const initialized = useRef(false);
  if (!initialized.current && initialChat) {
    const result = mapRawChatDataToChatAndMessages(initialChat);
    if (result) {
      const { chat, messages } = result;
      dispatch(setCurrentChat(chat));
      dispatch(setMessages(messages));
      initialized.current = true;
    }
  }

  return (
    <Card
      radius="none"
      className="h-[calc(100dvh-80px)] m-0 border-1 border-slate-300 dark:border-slate-800 bg-zig-zag relative"
    >
      <div className="sticky space-x-2">
        <CurrentChatPartner
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div className="flex flex-col-reverse h-svh overflow-scroll scrollbar-hide scroll-smooth">
        <ChatThread />
      </div>
      <div className="sticky mb-3">
        {initialChat?.inactive && (
          <div className="bg-gray-300 dark:bg-gray-700 px-2 py-3 text-center text-sm">
            This chat is inactive. Your chat partner has deleted their account.
          </div>
        )}
        {!initialChat?.inactive && <ChatForm />}
      </div>
    </Card>
  );
}
