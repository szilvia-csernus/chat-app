"use client";

import { useCallback, useEffect } from "react";
import { Channel, Members, PresenceChannel } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import { setMembersOnlineStatus, updateOnlineStatus } from "@/redux-store/features/membersSlice";
import { updateMemberLastActive } from "@/redux-store/thunks";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { selectCurrentMemberId, selectIsActive } from "@/redux-store/features/currentMemberSlice";


// Singleton constant is used for the channel to prevent the creation of 
// multiple channels when the component re-renders
const presenceChannelRef: { [key: string]: Channel | null } = {}; 

export const usePresenceChannel = () => {
  console.log("Presence")
  
  const dispatch = useAppDispatch();
  const currentMemberId = useAppSelector(selectCurrentMemberId);
  const isActive = useAppSelector(selectIsActive);

  const handleSetMembers = useCallback(
    (memberIds: string[]) => {
      console.log("Setting members' online list", memberIds);
      dispatch(setMembersOnlineStatus({memberIds}));
    },
    [dispatch]
  );

  const handleAddMember = useCallback(
    async (memberId: string) => {
      console.log("Adding member to online list", memberId);
      // add member to online members' list
      dispatch(updateOnlineStatus({memberId, online: true}));
    },
    [dispatch]
  );

  // when a member gets inactive
  const handleRemoveMember = useCallback(
    async (memberId: string | null) => {
      if (!memberId) return;

      console.log("usePresenceChannel: Removing member from online list", memberId);
      dispatch(updateOnlineStatus({ memberId, online: false }));

      console.log("usePresenceChannel: Updating chat partner last active");
      dispatch(updateMemberLastActive(memberId));

    },
    [dispatch]
  );

  const subscribeToChannel = useCallback(() => {
    if (
      presenceChannelRef["presence-chat-app"] &&
      presenceChannelRef["presence-chat-app"].subscribed
    ) {
      console.log("Already subscribed to presence channel.");
      return;
    }
    if (!presenceChannelRef["presence-chat-app"]) {
      console.log("Subscribing to presence channel...");
      presenceChannelRef["presence-chat-app"] = pusherClient.subscribe(
        "presence-chat-app"
      ) as PresenceChannel;

      presenceChannelRef["presence-chat-app"].bind(
        "pusher:subscription_succeeded",
        (members: Members) => {
          if (members && members.members) {
            handleSetMembers(Object.keys(members.members));
          } else {
            console.error("Unexpected members object structure:", members);
          }
        }
      );

      presenceChannelRef["presence-chat-app"].bind(
        "pusher:member_added",
        (member: Record<string, never>) => {
          handleAddMember(member.id);
        }
      );

      presenceChannelRef["presence-chat-app"].bind(
        "pusher:member_removed",
        (member: Record<string, never>) => {
          handleRemoveMember(member.id);
        }
      );

      presenceChannelRef["presence-chat-app"].bind("add_member", (memberId: string) => {
        handleAddMember(memberId);
      });

      presenceChannelRef["presence-chat-app"].bind("remove_member", (memberId: string) => {
        handleRemoveMember(memberId);
      });
    }
  }, [handleSetMembers, handleAddMember, handleRemoveMember]);


  const unsubscribeFromChannel = useCallback(() => {
    console.log("Unsubscribing from presence channel...");
    if (presenceChannelRef["presence-chat-app"] && presenceChannelRef["presence-chat-app"].subscribed) {
      presenceChannelRef["presence-chat-app"].unbind();
      presenceChannelRef["presence-chat-app"].unsubscribe();
      presenceChannelRef["presence-chat-app"] = null;
    }
  }, []);

  useEffect(() => {
    if (!currentMemberId) {
      unsubscribeFromChannel();
      return;
    }

    if (isActive) {
      subscribeToChannel();
    } else {
      unsubscribeFromChannel();
    }

    // Cleanup
    return () => {
      unsubscribeFromChannel();
    };
  }, [currentMemberId, isActive, subscribeToChannel, unsubscribeFromChannel]);


  return presenceChannelRef["presence-chat-app"];
};
