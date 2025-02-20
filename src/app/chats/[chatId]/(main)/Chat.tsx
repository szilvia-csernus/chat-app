"use client";

import { Card } from "@heroui/card";
import ChatThread from "./ChatThread";
import ChatForm from "./ChatForm";
import CurrentChatPartner from "./CurrentChatPartner";
import { Chat as ChatType, Member } from "@/types";

type Props = {
  chatPartner: Member;
  currentMember: Member;
  initialChat: ChatType | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
};

export default function Chat({
  chatPartner,
  currentMember,
  initialChat,
  isSidebarOpen,
  setIsSidebarOpen,
}: Props) {
  return (
    <Card
      radius="none"
      className="h-[calc(100dvh-80px)] m-0 border-1 border-slate-300 dark:border-slate-800 bg-zig-zag relative"
    >
      <div className="sticky space-x-2">
        <CurrentChatPartner
          chatPartnerId={chatPartner.id}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div className="flex flex-col-reverse h-svh overflow-scroll scrollbar-hide scroll-smooth">
        <ChatThread
          currentMember={currentMember}
          chatPartner={chatPartner}
          initialChat={initialChat}
        />
      </div>
      <div className="sticky px-2">
        {initialChat?.inactive && (
          <div className="bg-gray-300 dark:bg-gray-700 p-2 rounded-md text-center mb-2">
            This chat is inactive. Your chat partner has deleted their account.
          </div>
        )}
        {!initialChat?.inactive && <ChatForm />}
      </div>
    </Card>
  );
}
