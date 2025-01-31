"use client";

import { useCallback, useEffect, useRef } from "react";
import usePresenceStore from "../zustand-stores/usePresenceStore";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import{ useVisibilityChange}  from "../misc-hooks/useVisibilityChange";

export const usePresenceChannel = (currentProfileId: string | null) => {
  const setMembers = usePresenceStore((state) => state.set);
  const addMember = usePresenceStore((state) => state.add);
  const removeMember = usePresenceStore((state) => state.remove);

  // Ref is used to prevent the creation of multiple channels when the component re-renders
  const channelRef = useRef<Channel | null>(null);
  

  const handleSetMembers = useCallback(
    (memberIds: string[]) => {
      setMembers(memberIds);
    },
    [setMembers]
  );

  const handleAddMember = useCallback(
    (memberId: string) => {
      addMember(memberId);
    },
    [addMember]
  );

  const handleRemoveMember = useCallback(
    (memberId: string) => {
      removeMember(memberId);
    },
    [removeMember]
  );

  const subscribeToChannel = () => {
    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe("presence-chat-app");

      channelRef.current.bind(
        "pusher:subscription_succeeded",
        (members: Members) => {
          if (members && members.members) {
            handleSetMembers(Object.keys(members.members));
          } else {
            console.error("Unexpected members object structure:", members);
          }
        }
      );

      channelRef.current.bind(
        "pusher:member_added",
        (member: Record<string, never>) => {
          handleAddMember(member.id);
        }
      );

      channelRef.current.bind(
        "pusher:member_removed",
        (member: Record<string, never>) => {
          handleRemoveMember(member.id);
        }
      );
    }
  };

  const unsubscribeFromChannel = () => {
    if (channelRef.current && channelRef.current.subscribed) {
      channelRef.current.unbind(
        "pusher:subscription_succeeded",
        handleSetMembers
      );
      channelRef.current.unbind("pusher:member_added", handleAddMember);
      channelRef.current.unbind("pusher:member_removed", handleRemoveMember);
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
  };

  const isTabVisible = useVisibilityChange();


  useEffect(() => {
    if (!currentProfileId) return;

    if (isTabVisible) {
      // Tab is visible, subscribing to channel
      subscribeToChannel();
    } else {
      // Tab is hidden, unsubscribing from channel
      unsubscribeFromChannel();
    }

    // Cleanup
    return () => {
      if (channelRef.current) {
        unsubscribeFromChannel();
      }
    };
  }, [currentProfileId, isTabVisible])
}
