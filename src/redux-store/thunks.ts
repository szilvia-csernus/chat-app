// Thunks

import { Member, SerializedMessage } from "@/types";
import { AppThunk, RootState } from "./store";
import {
  addMsgId,
  updateUnreadCount,
} from "./features/chatsSlice";
import { getUnreadMessageCount } from "@/app/actions/chatActions";
import { updateReadStatus } from "@/app/actions/messageActions";
import { addNewMsg } from "./features/messagesSlice";
import { getCurrentProfile, updateProfileLastActive } from "@/app/actions/profileActions";
import { mapProfileDataToCurrentMember, mapProfilesDataToMembers } from "@/lib/maps";
import { setCurrentMember } from "./features/currentMemberSlice";
import { getMembers } from "@/app/actions/memberActions";
import { addMember, setMembers, updateMemberWithLastActiveTime } from "./features/membersSlice";


export function fetchCurrentMember(): AppThunk {
  return async (dispatch) => {
    const currentProfile = await getCurrentProfile();
    const currentMember =
      currentProfile && mapProfileDataToCurrentMember(currentProfile);
    console.log(
      "currentMemberSlice: Current member in fetchCurrentMember",
      !!currentMember
    );
    if (currentMember) {
      dispatch(setCurrentMember(currentMember));
      dispatch(addMember(currentMember as Member));
    }
  };
}

export function fetchAllMembers(): AppThunk {
  return async (dispatch, getState) => {
    const state = getState();
    const currentMember = state.currentMember.currentMember;
    console.log(
      "membersSlice: Current member in fetchAllMembers",
      !!currentMember
    );
    const membersData = (await getMembers()) || null;
    const members = membersData && mapProfilesDataToMembers(membersData);

    console.log("membersSlice: Members in fetchAllMembers", members);
    if (currentMember && members) {
      dispatch(setMembers(members));
    }
  };
}

export function updateMemberLastActive(id: string): AppThunk {
  return async (dispatch) => {
    const lastActive = new Date().toISOString();
    dispatch(updateMemberWithLastActiveTime({ id, lastActive }));
    await updateProfileLastActive(id);
  };
}


export function addNewMessage(
  chatId: string,
  message: SerializedMessage,
  date: string
): AppThunk {
  return async (dispatch, getState) => {
    const state: RootState = getState();
    const currentChatId = state.chats.currentChatId;
    console.log("addNewMessage: Current chat id", currentChatId);
    const currentMemberId = state.currentMember.currentMember?.id;
    console.log("addNewMessage: Current member id", currentMemberId);

    // If the message is for the acctive chat, add it to the chat
    // on either or both the sender and receiver side
    if (currentChatId === chatId) {
      dispatch(addNewMsg(message));
      dispatch(
        addMsgId({
          chatId,
          senderId: message.senderId!,
          messageId: message.id,
          date,
        })
      );
    }

    // Receiver side: if the message is not for the active chat,
    // update the unread count for that chat
    if (currentChatId !== chatId && message.senderId !== currentMemberId) {
      const unreadCount = await getUnreadMessageCount(chatId);
      dispatch(updateUnreadCount({ chatId, count: unreadCount }));
    }

    // Receiver side: if the message is for the active chat,
    // update the read status of the message
    if (currentChatId === chatId && message.senderId !== currentMemberId) {
      await updateReadStatus(message.id);
    }
  };
}

// export function fetchCurrentChat(id: string): AppThunk {
//   return async (dispatch, getState) => {
//     const state = getState();
//     const chat = await getChat(id);
//     if (!chat) return null;

//     dispatch(setChat(chat));
//     dispatch(setCurrentChatId(chat.id));
//   };
// }

// export function fetchRecentChats(id: string): AppThunk {
//   return async (dispatch, getState) => {
//     const state = getState();

//   };
// }
