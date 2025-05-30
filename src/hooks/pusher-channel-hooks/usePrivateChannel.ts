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
const privateChannelRef: { [key: string]: Channel | null } = {};

export const usePrivateChannel = () => {
  console.log("Private");

  const dispatch = useAppDispatch();
  const currentMemberId = useAppSelector(selectCurrentMemberId);

  const handleNewChat = useCallback(
    (data: { newChat: ChatData; chatPartnerId: string }) => {
      console.log("usePrivateChannel: New chat received", data.newChat.id);
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
      console.log("usePrivateChannel: handleChatInactive", chatId);
      dispatch(deactivateChat(chatId));
      dispatch(updateMsgsWithDeletedStatus(messageIds));
    },
    [dispatch]
  );

  const handleNewMember = useCallback(
    async (newMember: Member) => {
      // add newly-signed-up member to redux store on other people's devices
      console.log("usePrivateChannel: New member data", newMember);
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
      console.log("usePrivateChannel: Updating member data", memberWithLocalTime);
      if (memberWithLocalTime) {
        console.log(
          "usePrivateChannel: Dispatching updateMember for updated member",
          memberWithLocalTime
        );
        dispatch(updateMember(memberWithLocalTime));
      }
    },
    [dispatch]
  )

  // when a member is deleted from the database
  const handleDeleteMember = useCallback(
    async (memberId: string) => {
      // remove member from redux store on other people's devices
      console.log("usePrivateChannel: Deleting member", memberId);
      dispatch(updateMemberWithDeletedStatus(memberId));
    },
    [dispatch]
  );

  useEffect(() => {
    if (currentMemberId) {
      console.log(
        "usePrivateChannel: Subscribing to private channel",
        `private-${currentMemberId}`
      );
      if (!privateChannelRef["presence"]) {
        privateChannelRef["presence"] = pusherClient.subscribe(
          `private-${currentMemberId}`
        );
        const privateChannel = privateChannelRef["presence"];
        privateChannel.bind(
          "new-chat",
          (data: { newChat: ChatData; chatPartnerId: string }) => {
            handleNewChat(data);
          }
        );
        privateChannel.bind(
          "chat-inactive",
          (data: { chatId: string; messageIds: string[] }) => {
            console.log(
              "usePrivateChannel: Chat inactive event received",
              data.chatId
            );
            handleChatInactive(data.chatId, data.messageIds);
          }
        );
        privateChannel.bind("new-member", (data: { newMember: Member }) => {
          console.log(
            "usePrivateChannel: New member event received",
            data.newMember
          );
          handleNewMember(data.newMember);
        });
        privateChannel.bind("update-member", (data: { member: Member }) => {
          console.log(
            "usePrivateChannel: Update member event received",
            data.member
          );
          handleUpdateMember(data.member);
        });
        privateChannel.bind("delete-member", (data: { memberId: string }) => {
          console.log(
            "usePrivateChannel: Member deleted event received",
            data.memberId
          );
          handleDeleteMember(data.memberId);
        });
      }
    }

    // Cleanup function to unsubscribe from channels
    return () => {
      if (privateChannelRef["presence"]) {
        console.log(
          "usePrivateChannel: Unsubscribing from private channel",
          `private-${currentMemberId}`
        );
        privateChannelRef["presence"].unbind();
        pusherClient.unsubscribe(`private-${currentMemberId}`);
        privateChannelRef["presence"] = null;
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
