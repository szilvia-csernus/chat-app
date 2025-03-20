import { Member, SerializedMessage } from "@/types";
import { AppThunk, RootState } from "./store";
import {
  addMsgId,
  resetChatUnreadCount,
  updateUnreadCount,
} from "./features/chatsSlice";
import { getUnreadMessageCount } from "@/app/actions/chatActions";
import {
  updateMessagesWithReadStatus,
  updateReadStatus,
} from "@/app/actions/messageActions";
import { addNewMsg } from "./features/messagesSlice";
import {
  getCurrentProfile,
  updateProfileLastActive,
} from "@/app/actions/profileActions";
import {
  mapProfileDataToCurrentMember,
  mapProfilesDataToMembers,
} from "@/lib/maps";
import { setCurrentMember } from "./features/currentMemberSlice";
import { getMembers } from "@/app/actions/memberActions";
import {
  addMember,
  setMembers,
  updateMemberWithLastActiveTime,
} from "./features/membersSlice";

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
    const chatVisible = state.ui.chatVisible;
    console.log("addNewMessage: Chat visible", chatVisible);
    const currentMemberId = state.currentMember.currentMember?.id;
    console.log("addNewMessage: Current member id", currentMemberId);

    // If the message is for the current chat, add it to the chat
    // on either or both the sender and receiver side
    if (currentChatId === chatId) {
      console.log("addNewMessage: Adding message to current chat");
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

    // Receiver side: if chat is not active,
    // update the unread count for that chat
    if (!chatVisible && message.senderId !== currentMemberId) {
      const unreadCount = await getUnreadMessageCount(chatId);
      console.log("addNewMessage: Updating unread count", unreadCount);
      dispatch(updateUnreadCount({ chatId, count: unreadCount }));
    }

    // Receiver side: if the message is for the current chat and the chat is active,
    // update the read status of the message in the database
    if (
      chatVisible &&
      currentChatId === chatId &&
      message.senderId !== currentMemberId
    ) {
      console.log("addNewMessage: Updating read status in the database for message", message.id);
      await updateReadStatus(message.id);
    }
  };
}

// when user opens a chat, update the unread count
export function updateUnreadMsgCount(chatId: string): AppThunk {
  return async (dispatch) => {
    // Reset the unread count for the chat
    dispatch(resetChatUnreadCount(chatId));
    // Update the read status of the messages in the database
    await updateMessagesWithReadStatus(chatId);
  };
}

// export function fetchCurrentChat(id: string): AppThunk {
//   return async (dispatch, getState) => {
//     const state = getState();
//     const chat = await getChat(id);
//     if (!chat) return null;
//     const result = mapRawChatDataToChatAndMessages(chat);
//           if (result) {
//             const { chat, messages } = result;
//             dispatch(setCurrentChat(chat));
//             dispatch(setMessages(messages));
//           }
//   };
// }
