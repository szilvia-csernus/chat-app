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
  currentChatId: string;
  currentProfile: Profile;
};

const Sidebar: React.FC<SidebarProps> = ({ currentChatId, currentProfile }) => {
  const membersOnline = usePresenceStore((state) => state.membersOnline);
  const router = useRouter();
  const recentChats = useRecentChatsStore((state) => state.recentChats);

  return (
    <Card className="w-full items-center h-full">
      <CardBody className="flex flex-col h-full items-center text-primary ">
        <div className="text-2xl font-bold mt-4 flex flex-row gap-2">
          <span>Your Chats</span>
        </div>
        <Divider className="mt-3 mb-5 bg-accent" />
        <RecentChatsList
          recentChats={recentChats}
          currentProfile={currentProfile}
          currentChatId={currentChatId}
          membersOnline={membersOnline}
        />
        
      </CardBody>
      <CardFooter className="h-full flex flex-col justify-end mb-2">
        <Button
          onPress={() => router.back()}
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
