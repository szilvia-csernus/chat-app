"use client";

import { useCallback, useEffect, useRef } from "react";
import usePresenceStore from "./usePresenceStore";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "@/lib/pusher";

export const usePresenceChannel = (currentProfileId: string | null) => {
  const set = usePresenceStore((state) => state.set);
  const add = usePresenceStore((state) => state.add);
  const remove = usePresenceStore((state) => state.remove);

  // this is used to prevent the creation of multiple channels when the component re-renders
  const channelRef = useRef<Channel | null>(null);

  const handleSetMembers = useCallback(
    (memberIds: string[]) => {
      set(memberIds);
    },
    [set]
  );

  const handleAddMember = useCallback(
    (memberId: string) => {
      add(memberId);
    },
    [add]
  );

  const handleRemoveMember = useCallback(
    (memberId: string) => {
      remove(memberId);
    },
    [remove]
  );

  useEffect(() => {
    if (!currentProfileId) return;

    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe("presence-chat-app");

      channelRef.current.bind(
        "pusher:subscription_succeeded",
        (members: Members) => {
          console.log("Members:", members); // Debugging statement
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

    return () => {
      if (channelRef.current && channelRef.current.subscribed) {
        channelRef.current.unsubscribe();
        channelRef.current.unbind(
          "pusher:subscription_succeeded",
          handleSetMembers
        );
        channelRef.current.unbind("pusher:member_added", handleAddMember);
        channelRef.current.unbind("pusher:member_removed", handleRemoveMember);
      }
    };
  }, [handleSetMembers, handleAddMember, handleRemoveMember, currentProfileId]);
};
