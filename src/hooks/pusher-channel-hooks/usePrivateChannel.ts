"use client";

import { useEffect } from "react";
import { Channel } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import { useCallback } from "react";
import { ChatData, Member } from "@/types";
import {
  addMember,
  updateChatting,
  updateMember,
  updateMemberWithDeletedStatus,
} from "@/redux-store/features/membersSlice";
import { addNewChat, deactivateChat } from "@/redux-store/features/chatsSlice";
import { updateMsgsWithDeletedStatus } from "@/redux-store/features/messagesSlice";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { selectCurrentMemberId } from "@/redux-store/features/currentMemberSlice";
import { formatShortDateTime } from "@/lib/utils";


// Singleton constant is used for the channel to prevent the creation of 
// multiple channels when the component re-renders (useRef would be equally valid)
let privateChannel: Channel | null = null;

export const usePrivateChannel = () => {

  const dispatch = useAppDispatch();
  const currentMemberId = useAppSelector(selectCurrentMemberId);

  const handleNewChat = useCallback(
    (data: { newChat: ChatData; chatPartnerId: string }) => {
      dispatch(addNewChat(data.newChat));
      // add new chat partner
      dispatch(
        updateChatting({
          memberId: data.chatPartnerId,
          chatId: data.newChat.id,
        })
      );
    },
    [dispatch]
  );

  const handleChatInactive = useCallback(
    (chatId: string, messageIds: string[]) => {
      dispatch(deactivateChat(chatId));
      dispatch(updateMsgsWithDeletedStatus(messageIds));
    },
    [dispatch]
  );

  const handleNewMember = useCallback(
    async (newMember: Member) => {
      // add newly-signed-up member to redux store on other people's devices
      if (newMember) {
        console.log(
          "usePrivateChannel: Dispatching addMember for new member",
          newMember
        );
        //convert lastActive time to local time
        const lastActive = formatShortDateTime(newMember.lastActive);
        const newMemberWithLocalTime = {
          ...newMember,
          lastActive: lastActive,
        };
        dispatch(addMember(newMemberWithLocalTime));
      }
    },
    [dispatch]
  );

  const handleUpdateMember = useCallback(
    // update member data in redux store on other people's devices
    async (member: Member) => {
      //convert lastActive time to local time
      const lastActive = formatShortDateTime(member.lastActive);
      const memberWithLocalTime = {
        ...member,
        lastActive: lastActive,
      };
      if (memberWithLocalTime) {
        dispatch(updateMember(memberWithLocalTime));
      }
    },
    [dispatch]
  )

  // when a member is deleted from the database
  const handleDeleteMember = useCallback(
    async (memberId: string) => {
      // remove member from redux store on other people's devices
      dispatch(updateMemberWithDeletedStatus(memberId));
    },
    [dispatch]
  );

  useEffect(() => {
    if (currentMemberId) {
      if (!privateChannel) {
        privateChannel = pusherClient.subscribe(
          `private-${currentMemberId}`
        );
        privateChannel.bind(
          "new-chat",
          (data: { newChat: ChatData; chatPartnerId: string }) => {
            handleNewChat(data);
          }
        );
        privateChannel.bind(
          "chat-inactive",
          (data: { chatId: string; messageIds: string[] }) => {
            handleChatInactive(data.chatId, data.messageIds);
          }
        );
        privateChannel.bind("new-member", (data: { newMember: Member }) => {
          handleNewMember(data.newMember);
        });
        privateChannel.bind("update-member", (data: { member: Member }) => {
          handleUpdateMember(data.member);
        });
        privateChannel.bind("delete-member", (data: { memberId: string }) => {
          handleDeleteMember(data.memberId);
        });
      }
    }

    // Cleanup function to unsubscribe from channels
    return () => {
      if (currentMemberId && privateChannel) {
        privateChannel.unbind();
        pusherClient.unsubscribe(`private-${currentMemberId}`);
        privateChannel = null;
      }
    };
  }, [
    currentMemberId,
    handleNewChat,
    handleChatInactive,
    handleNewMember,
    handleUpdateMember,
    handleDeleteMember,
  ]);

  return null;
};
