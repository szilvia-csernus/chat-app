"use client";

import React, { ReactNode } from "react";
import { usePresenceChannel } from "@/hooks/pusher-channel-hooks/usePresenceChannel";
import { useActivityChange } from "@/hooks/misc-hooks/useActivityChange";
import { usePrivateChannel } from "@/hooks/pusher-channel-hooks/usePrivateChannel";
import { usePrivateChatChannels } from "@/hooks/pusher-channel-hooks/usePrivateChatChannels";


export default function Channels({ children}: {children: ReactNode }) {

  useActivityChange();
  usePresenceChannel();
  usePrivateChannel();
  usePrivateChatChannels();

  return (
    <>
      {children}
    </>
  );
};
