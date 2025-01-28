"use client";

import React from "react";
import { Card, CardBody, CardFooter, Divider, Button, Skeleton } from "@heroui/react";
import { useRouter } from "next/navigation";
import usePresenceStore from "@/hooks/usePresenceStore";
import { useRecentChatsStore } from "@/hooks/useRecentChatsStore";
import RecentChatsList from "./RecentChatsList";
import { Member } from "@/types";
import { Profile } from "@prisma/client";

type SidebarProps = {
  currentProfileId: string;
};

const Sidebar: React.FC<SidebarProps> = ({ currentProfileId }) => {
  const membersOnline = usePresenceStore((state) => state.membersOnline);
  const router = useRouter();
  const recentChats = useRecentChatsStore((state) => state.recentChats);

  return (
    <Card className="w-full items-center h-full border-1 border-gray-300 bg-background">
      <CardBody className="flex flex-col h-full items-center ">
        <div className="text-2xl font-bold mt-4 flex flex-row gap-2">
          <span>Your Chats</span>
        </div>
        <Divider className="mt-3 mb-5 bg-accent" />
        <RecentChatsList
          recentChats={recentChats}
          currentProfileId={currentProfileId}
          membersOnline={membersOnline}
        />
        
      </CardBody>
      <CardFooter className="flex flex-col justify-end">
        <Button
          onPress={() => router.back()}
          color="secondary"
          variant="solid"
          radius="lg"
          className="w-full text-white h-12"
        >
          Go back
        </Button>
      </CardFooter>
    </Card>
  );
};

export default React.memo(Sidebar);
