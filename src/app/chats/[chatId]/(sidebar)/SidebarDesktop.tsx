"use client";

import React from "react";
import { Card, CardBody, CardFooter, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import RecentChatsList from "./RecentChatsList";
import { useAppSelector } from "@/redux-store/hooks";
import { selectCurrentMember } from "@/redux-store/features/currentMemberSlice";


export default function SidebarDesktop() {
  const router = useRouter();

  const currentMember = useAppSelector(selectCurrentMember);

  return (
    <Card
      radius="none"
      className="w-full items-center h-full border-1 border-slate-300 dark:border-slate-800 bg-zig-zag"
    >
      <CardBody className="flex flex-col items-center p-0">
        <div className="sticky w-full text-xl font-bold pt-4 pb-2 flex justify-center border-b-1 border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-200">
          <span>Your Chats</span>
        </div>
        {currentMember && (
          <RecentChatsList />
        )}
      </CardBody>
      <CardFooter className="flex flex-col justify-end pb-3">
        <Button
          onPress={() => router.back()}
          color="secondary"
          variant="solid"
          radius="lg"
          className="w-full text-white h-10"
        >
          Go back
        </Button>
      </CardFooter>
    </Card>
  );
};