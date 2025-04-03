"use client";

import { useCallback, useEffect, useRef } from "react";
import { Channel, Members, PresenceChannel } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import {
  setMembersOnlineStatus,
  updateOnlineStatus,
} from "@/redux-store/features/membersSlice";
import {
  resetUnreadMsgCount,
  updateMemberLastActive,
} from "@/redux-store/thunks";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  selectCurrentMemberId,
  selectIsActive,
} from "@/redux-store/features/currentMemberSlice";
import { selectCurrentChatId } from "@/redux-store/features/chatsSlice";
import { selectChatVisible } from "@/redux-store/features/uiSlice";

export const usePresenceChannel = () => {
  console.log("Presence");

  // Ref is used for the channel to prevent the creation of multiple channels
  //  when the component re-renders (Singleton would be equally valid)
  const presenceChannelRef = useRef<Channel | null>(null);

  const dispatch = useAppDispatch();
  const currentMemberId = useAppSelector(selectCurrentMemberId);
  const isActive = useAppSelector(selectIsActive);
  const currentChatId = useAppSelector(selectCurrentChatId);
  const chatVisible = useAppSelector(selectChatVisible);

  const handleSetMembers = useCallback(
    (memberIds: string[]) => {
      console.log("Setting members' online list", memberIds);
      dispatch(setMembersOnlineStatus({ memberIds }));
      // if the member has a chat open, update the messages' read status
      // and reset the unread message count
      console.log(
        "usePresenceChannel: currentChatId",
        currentChatId,
        "chatVisible",
        chatVisible
      );
      if (currentChatId && chatVisible) {
        dispatch(resetUnreadMsgCount(currentChatId));
      }
    },
    [dispatch, currentChatId, chatVisible]
  );

  const handleAddMember = useCallback(
    async (memberId: string) => {
      console.log("Adding member to online list", memberId);
      // add member to online members' list
      dispatch(updateOnlineStatus({ memberId, online: true }));
    },
    [dispatch]
  );

  // when a member gets inactive
  const handleRemoveMember = useCallback(
    async (memberId: string | null) => {
      if (!memberId) return;

      console.log(
        "usePresenceChannel: Removing member from online list",
        memberId
      );
      dispatch(updateOnlineStatus({ memberId, online: false }));

      console.log("usePresenceChannel: Updating chat partner last active");
      dispatch(updateMemberLastActive(memberId));
    },
    [dispatch]
  );

  const subscribeToChannel = useCallback(() => {
    if (presenceChannelRef.current && presenceChannelRef.current.subscribed) {
      console.log("Already subscribed to presence channel.");
      return;
    }
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
  }, [handleSetMembers, handleAddMember, handleRemoveMember]);

  const unsubscribeFromChannel = useCallback(() => {
    console.log("Unsubscribing from presence channel...");
    if (presenceChannelRef.current && presenceChannelRef.current.subscribed) {
      presenceChannelRef.current.unbind();
      presenceChannelRef.current.unsubscribe();
      presenceChannelRef.current = null;
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

  return null;
};
