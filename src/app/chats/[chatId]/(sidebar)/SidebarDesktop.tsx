"use client";

import React from "react";
import { Card, CardBody, CardFooter, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import RecentChatsList from "./RecentChatsList";


type Props = {
  currentMemberId: string;
};

export default function SidebarDesktop({ currentMemberId }: Props) {
  const router = useRouter();

  return (
    <Card
      radius="none"
      className="w-full items-center h-full border-1 border-slate-300 dark:border-slate-500 bg-background"
    >
      <CardBody className="flex flex-col h-full items-center p-0">
        <div className="w-full text-xl font-bold pt-4 pb-2 flex justify-center border-b-1 border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-200">
          <span>Your Chats</span>
        </div>
        <RecentChatsList currentMemberId={currentMemberId} />
      </CardBody>
      <CardFooter className="flex flex-col justify-end pb-3">
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