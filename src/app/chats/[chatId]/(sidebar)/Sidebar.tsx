"use client";

import React from "react";
import { Card, CardBody, CardFooter, Divider, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import usePresenceStore from "@/hooks/usePresenceStore";
import { useChatPartnersStore } from "@/hooks/useChatPartnersStore";
import ChatPartnerList from "./ChatPartnerList";

type SidebarProps = {
  chatId: string;
};

const Sidebar: React.FC<SidebarProps> = ({ chatId }) => {
  console.log("chatId", chatId);
  const membersOnline = usePresenceStore((state) => state.membersOnline);
  const router = useRouter();
  const chatPartners = useChatPartnersStore((state) => state.chatPartners);

  return (
    <Card className="w-full items-center h-full">
      <CardBody className="flex flex-col h-full items-center text-primary ">
        <div className="text-2xl font-bold mt-4 flex flex-row gap-2">
          <span>Your Chats</span>
        </div>
        <Divider className="my-3 bg-accent" />
        <ChatPartnerList
          chatPartners={chatPartners}
          chatId={chatId}
          membersOnline={membersOnline}
        />
      </CardBody>
      <CardFooter className="h-full flex flex-col justify-end mb-2">
        <Button
          onClick={() => router.back()}
          color="secondary"
          variant="bordered"
          className="w-full"
        >
          Go back
        </Button>
      </CardFooter>
    </Card>
  );
};

export default React.memo(Sidebar);
