"use client";

import { useEffect, useRef } from "react";
import { Channel } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import { useCallback } from "react";
import { ChatData, CurrentMember, Member } from "@/types";
import {
  addMember,
  updateChatting,
  updateMemberWithDeletedStatus,
} from "@/redux-store/features/membersSlice";
import { getMembers } from "@/app/actions/memberActions";
import { AppStore } from "@/redux-store/store";
import { addNewChat, deactivateChat } from "@/redux-store/features/chatsSlice";
import { updateMessagesWithDeletedStatus } from "@/redux-store/features/messagesSlice";

type Props = {
  store: AppStore;
  currentMember: CurrentMember | null;
};

export const usePrivateChannel = ({ store, currentMember }: Props) => {
  console.log("Private");
  
  // Ref is used to prevent the creation of multiple channels when the component re-renders
  const privateChannelRef = useRef<Channel | null>(null);

  const currentMemberId = currentMember?.id;

  const handleNewChat = useCallback(
    (data: { newChat: ChatData; chatPartnerId: string }) => {
      console.log("usePrivateChannel: New chat received", data.newChat.id);
      store.dispatch(addNewChat(data.newChat));
      // add new chat partner
      store.dispatch(
        updateChatting({
          memberId: data.chatPartnerId,
          chatId: data.newChat.id,
        })
      );
    },
    [store]
  );

  const handleChatInactive = useCallback(
    (chatId: string, messageIds: string[] ) => {
      console.log("usePrivateChannel: handleChatInactive", chatId);
      store.dispatch(deactivateChat(chatId));
      store.dispatch(updateMessagesWithDeletedStatus(messageIds));
    },
    [store]
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
        store.dispatch(addMember(newMember));
      }
    },
    [store]
  );

  // when a member is deleted from the database
  const handleDeleteMember = useCallback(
    async (memberId: string) => {
      // remove member from redux store on other people's devices
      console.log("usePrivateChannel: Deleting member", memberId);
      const currentMembers = await getMembers();
      const allMemberIds = currentMembers?.map((m) => m.id);
      console.log("usePrivateChannel: All member ids", allMemberIds);
      console.log("usePrivateChannel: dispatching removeMember: ", memberId);
      store.dispatch(updateMemberWithDeletedStatus(memberId));
    },
    [store]
  );

  useEffect(() => {
    if (!currentMemberId) return;

    console.log(
      "usePrivateChannel: Subscribing to private channel",
      `private-${currentMemberId}`
    );
    privateChannelRef.current = pusherClient.subscribe(
      `private-${currentMemberId}`
    );
    const privateChannel = privateChannelRef.current;
    privateChannel.bind(
      "new-chat",
      (data: { newChat: ChatData; chatPartnerId: string }) => {
        handleNewChat(data);
      }
    );
    privateChannel.bind(
      "chat-inactive",
      (data: {chatId: string, messageIds: string[]}) => {
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
    privateChannel.bind("delete-member", (data: { memberId: string }) => {
      console.log(
        "usePrivateChannel: Member deleted event received",
        data.memberId
      );
      handleDeleteMember(data.memberId);
    });

    // Cleanup function to unsubscribe from channels
    return () => {
      if (privateChannel) {
        console.log(
          "usePrivateChannel: Unsubscribing from private channel",
          `private-${currentMemberId}`
        );
        privateChannel.unbind();
        pusherClient.unsubscribe(`private-${currentMemberId}`);
      }
    };
  }, [currentMemberId, handleNewChat, handleChatInactive, handleNewMember, handleDeleteMember]);

  return privateChannelRef.current;
};
