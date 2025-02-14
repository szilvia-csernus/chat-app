"use client";

import { useCallback, useEffect, useRef } from "react";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import { useVisibilityChange}  from "../misc-hooks/useVisibilityChange";
import { setPresentMembers, addMember, removeMember } from "@/redux-store/features/presenceSlice";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { selectCurrentChat } from "@/redux-store/features/currentChatSlice";
import { formatShortDateTime } from "@/lib/utils";
import { updateProfileLastActive } from "@/app/actions/profileActions";
import { updateChatPartnerLastActive } from "@/redux-store/features/chatPartnersSlice";

export const usePresenceChannel = (currentProfileId: string | null) => {
  const dispatch = useAppDispatch();

  // Ref is used to prevent the creation of multiple channels when the component re-renders
  const channelRef = useRef<Channel | null>(null);

  const currentChat = useAppSelector(selectCurrentChat);
  
  const handleSetMembers = useCallback(
    (memberIds: string[]) => {
      dispatch(setPresentMembers(memberIds));
    },
    [setPresentMembers]
  );

  const handleAddMember = useCallback(
    (memberId: string) => {
      dispatch(addMember(memberId));
    },
    [addMember]
  );

  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      dispatch(removeMember(memberId));
      await updateProfileLastActive(memberId);
      // Current chat's chat partner
      const chatPartner = currentChat?.participants?.find(p => p.id !== currentProfileId);
      console.log("Chat partner in usePresenceChannel", chatPartner);
      if (chatPartner?.id === memberId) {
        const date = formatShortDateTime(new Date());
        console.log("Updating chat partner last active", memberId, date);
        dispatch(updateChatPartnerLastActive({chatPartnerId: memberId, lastActive: date}));
      }
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
