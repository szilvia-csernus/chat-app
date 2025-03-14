"use client";

import { useEffect, useRef } from "react";
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
};

export default function Chat({
  initialChat,
}: Props) {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && initialChat) {
      console.log("Chat useEffect: Setting initial chat in store", initialChat.id);
      const result = mapRawChatDataToChatAndMessages(initialChat);
      if (result) {
        const { chat, messages } = result;
        dispatch(setCurrentChat(chat));
        dispatch(setMessages(messages));
        initialized.current = true;
      }
    }
  }, [initialChat, dispatch]);

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messageEndRef]);

  return (
    <Card
      radius="none"
      className="h-[calc(100dvh-80px)] m-0 border-1 border-slate-300 dark:border-slate-700 bg-zig-zag"
    >
      <div className="sticky space-x-2 sm:hidden">
        <CurrentChatPartner />
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
        <div ref={messageEndRef} />
        {!initialChat?.inactive && <ChatForm />}
      </div>
    </Card>
  );
}
