"use client";

import { usePresenceChannel } from "@/hooks/pusher-channel-hooks/usePresenceChannel";
import { useActivityChange } from "@/hooks/misc-hooks/useActivityChange";
import { usePrivateChannel } from "@/hooks/pusher-channel-hooks/usePrivateChannel";
import { usePrivateChatChannels } from "@/hooks/pusher-channel-hooks/usePrivateChatChannels";
import { memo } from "react";


function Channels() {

  useActivityChange();
  usePresenceChannel();
  usePrivateChannel();
  usePrivateChatChannels();

  return null;
};

export default memo(Channels);