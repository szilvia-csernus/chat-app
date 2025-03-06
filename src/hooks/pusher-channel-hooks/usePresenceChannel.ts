"use client";

import { useCallback, useEffect, useRef } from "react";
import { Members, PresenceChannel } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import { useActivityChange } from "../misc-hooks/useActivityChange";
import { AppStore } from "@/redux-store/store";
import { CurrentMember } from "@/types";
import { setMembersOnlineStatus, updateMemberLastActive, updateOnlineStatus } from "@/redux-store/features/membersSlice";

type Props = {
  store: AppStore;
  currentMember: CurrentMember | null;
};

export const usePresenceChannel = ({ store, currentMember }: Props) => {
  console.log("Presence")
  
  // Ref is used to prevent the creation of multiple channels when the component re-renders
  const presenceChannelRef = useRef<PresenceChannel | null>(null);

  const currentMemberId = currentMember?.id;

  const isActive = useActivityChange();

  const handleSetMembers = useCallback(
    (memberIds: string[]) => {
      console.log("Setting members", memberIds);
      store.dispatch(setMembersOnlineStatus({memberIds}));
    },
    [store]
  );

  const handleAddMember = useCallback(
    async (memberId: string) => {
      console.log("Adding member", memberId);
      // add member to online members' list
      store.dispatch(updateOnlineStatus({memberId, online: true}));
    },
    [store]
  );

  // when a member gets inactive
  const handleRemoveMember = useCallback(
    async (memberId: string | null) => {
      if (!memberId) return;

      console.log("usePresenceChannel: Removing member", memberId);
      store.dispatch(updateOnlineStatus({ memberId, online: false }));

      console.log("usePresenceChannel: Updating chat partner last active");
      store.dispatch(updateMemberLastActive(memberId));

    },
    [store, currentMemberId]
  );

  const subscribeToChannel = () => {
    if (!presenceChannelRef.current) {
      console.log("Subscribing to presence channel...");
      presenceChannelRef.current = pusherClient.subscribe(
        "presence-chat-app"
      ) as PresenceChannel;

      presenceChannelRef.current.bind(
        "pusher:subscription_succeeded",
        (members: Members) => {
          if (members && members.members) {
            handleSetMembers(Object.keys(members.members));
          } else {
            console.error("Unexpected members object structure:", members);
          }
        }
      );

      presenceChannelRef.current.bind(
        "pusher:member_added",
        (member: Record<string, never>) => {
          handleAddMember(member.id);
        }
      );

      presenceChannelRef.current.bind(
        "pusher:member_removed",
        (member: Record<string, never>) => {
          handleRemoveMember(member.id);
        }
      );

      presenceChannelRef.current.bind("add_member", (memberId: string) => {
        handleAddMember(memberId);
      });

      presenceChannelRef.current.bind("remove_member", (memberId: string) => {
        handleRemoveMember(memberId);
      });
    }
  };

  const unsubscribeFromChannel = () => {
    console.log("Unsubscribing from presence channel...");
    if (presenceChannelRef.current && presenceChannelRef.current.subscribed) {
      presenceChannelRef.current.unbind();
      presenceChannelRef.current.unsubscribe();
    }
  };

  useEffect(() => {
    if (!currentMemberId) return;

    subscribeToChannel();

    // Cleanup
    return () => {
      if (presenceChannelRef.current) {
        console.log("Cleaning up presence channel subscription");
        unsubscribeFromChannel();
      }
    };
  }, [currentMemberId]);

  useEffect(() => {
    if (currentMemberId && presenceChannelRef.current) {
      if (isActive) {
        // Tab is active, subscribing to channel
        console.log("User is active, subscribing to presence channel");
        presenceChannelRef.current.emit("add_member", currentMemberId);
      } else {
        // Tab is inactive, unsubscribing from channel
        console.log("User is inactive, unsubscribing from presence channel");
        presenceChannelRef.current.emit("remove_member", currentMemberId);
      }
    }
  }, [isActive, currentMemberId]);

  return presenceChannelRef.current;
};
