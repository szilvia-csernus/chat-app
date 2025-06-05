import { Member, SerializedMessage } from "@/types";
import { AppThunk, RootState } from "./store";
import {
  addNewMsgGroup,
  resetChatUnreadCount,
  selectLastMsgIdByChatId,
  setAllOldMsgsLoadedForChatId,
  updateUnreadCount,
} from "./features/chatsSlice";
import {
  getRecentChats,
  getUnreadMessageCount,
  loadNewMessagesAndUnreadCount,
} from "@/app/actions/chatActions";
import {
  getMoreOldMessages,
  updateMessagesWithReadStatus,
  updateReadStatus,
} from "@/app/actions/messageActions";
import { addNewMsg, selectMsgById } from "./features/messagesSlice";
import {
  getCurrentProfile,
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
import { usePopulateStore } from "./hooks";
import { serializeMessage } from "@/lib/serialize";
import { setLastMessageInFocus } from "./features/uiSlice";
import { insertMsgIdIntoGroup } from "./utilityFunctions";
import dayjs from "dayjs";

export function fetchCurrentMember(): AppThunk {
  return async (dispatch) => {
    const currentProfile = await getCurrentProfile();
    const currentMember =
      currentProfile && mapProfileDataToCurrentMember(currentProfile);
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
    const membersData = (await getMembers()) || null;
    const members = membersData && mapProfilesDataToMembers(membersData);

    if (currentMember && members) {
      dispatch(setMembers(members));
    }
  };
}

// This function runs on all online members devices and updates the removed 
// (i.e. removed from the online list) member's last active time in the 
// client side code.
export function updateMemberLastActive(id: string): AppThunk {
  return async (dispatch) => {
    const lastActive = dayjs.utc().tz(dayjs.tz.guess()).toISOString();
    dispatch(updateMemberWithLastActiveTime({ id, lastActive }));
    
    // UPDATING THE CURRENT MEMBER'S LAST ACTIVE TIME IN THE DATABASE
    // IS HANDLED BY A WEBHOOK!!
    
  };
}

export function addNewMessage(
  chatId: string,
  message: SerializedMessage,
): AppThunk {
  return async (dispatch, getState) => {
    const state: RootState = getState();
    const currentChatId = state.chats.currentChatId;
    const chatVisible = state.ui.chatVisible;
    const currentMemberId = state.currentMember.currentMember?.id;

    // Both sides: add the message to the store
    dispatch(addNewMsg(message));
    dispatch(insertMsgId(message, chatId));

    // Receiver side: if chat is not visible,
    // update the unread count for that chat
    if (!chatVisible && message.senderId !== currentMemberId) {
      const unreadCount = await getUnreadMessageCount(chatId);
      if (unreadCount !== null) {
        dispatch(updateUnreadCount({ chatId, count: unreadCount }));
      }
    }

    // Receiver side: if the message is for the current chat and the chat is visible,
    // update the read status of the message in the database
    if (
      chatVisible &&
      currentChatId === chatId &&
      message.senderId !== currentMemberId
    ) {
      await updateReadStatus(message.id);
    }

    // Both sides: if the message is for the current chat and the chat is visible,
    // scroll the new message into view
    if (chatVisible && currentChatId === chatId) {
      dispatch(setLastMessageInFocus(true));
    }
  };
}

// when user opens a chat, mark the messages as "read" and 
// reset the unread count for that chat
export function resetUnreadMsgCount(chatId: string): AppThunk {
  return async (dispatch) => {
    // Update the read status of the messages in the database
    await updateMessagesWithReadStatus(chatId);
    // Reset the unread count for the chat
    dispatch(resetChatUnreadCount(chatId));
  };
}

// export function updateUnreadCount(): AppThunk {
//   return async (dispatch, getState) => {
//     const state = getState();
//     const currentChatId = state.chats.currentChatId;
//     const unreadCount = await getAllUnreadMessageCount();
//     console.log("updateUnreadCount: Unread count", unreadCount);
//     if (unreadCount !== null) {
//       dispatch(updateUnreadCount({ chatId: currentChatId, count: unreadCount }));
//     }
//   }
// }

export function fetchDataAndPopulateStore(): AppThunk {
  return async () => {
    const currentProfile = await getCurrentProfile();
    const currentMember =
      currentProfile && mapProfileDataToCurrentMember(currentProfile);
    if (currentMember) return;
    const membersData = await getMembers();
    const recentChats = await getRecentChats();
    usePopulateStore({ currentMember, membersData, recentChats });
  };
}

export function loadMoreMessages(
  chatId: string | null,
  oldestMsgId: string
): AppThunk {
  return async (dispatch, getState) => {

    if (!chatId) return null;

    const messages = await getMoreOldMessages(chatId, oldestMsgId);

    if (!messages) {
      return null;
    }

    if (messages.length === 0) {
      return null;
    }

    if (messages.length < 10) {
      dispatch(setAllOldMsgsLoadedForChatId(chatId));
    }

    const messagesState = getState().messages.messages;

    for (const message of messages) {
      const isMsgAlreadyInStore = messagesState[message.id];
      if (!!isMsgAlreadyInStore) {
        continue;
      }
      if (!isMsgAlreadyInStore) {
        const serializedMessage = serializeMessage(message);
        dispatch(addNewMsg(serializedMessage));
        dispatch(insertMsgId(serializedMessage, chatId));
      }
    }
  };
}

export function refreshChat(chatId: string | null): AppThunk {
  return async (dispatch, getState) => {

    if (!chatId) return null;

    const state = getState();
    const latestMsgId = selectLastMsgIdByChatId(state, chatId);
    const lastMsgDate =
      selectMsgById(state.messages, latestMsgId)?.createdAt || null;

    const result = await loadNewMessagesAndUnreadCount(chatId, lastMsgDate);
    if (!result) {
      return null;
    }
    const { messages, unreadCount } = result;

    if (!messages) {
      return null;
    }

    if (messages.length === 0) {
      console.log("No more messages to load.");
      return null;
    }

    const messagesState = getState().messages;

    for (const message of messages) {
      const isMsgAlreadyInStore = messagesState.messages[message.id];
      console.log(
        "Is Message already in store?",
        message.id,
        !!isMsgAlreadyInStore
      );
      if (!!isMsgAlreadyInStore) {
        continue;
      }
      if (!isMsgAlreadyInStore) {
        console.log("Adding new message to store", message.id);
        const serializedMessage = serializeMessage(message);
        dispatch(addNewMsg(serializedMessage));
        dispatch(insertMsgId(serializedMessage, chatId));
      }
    }

    dispatch(updateUnreadCount({ chatId, count: unreadCount }));
  };
}

export function insertMsgId(message: SerializedMessage, chatId: string): AppThunk {
  return async (dispatch) => {
    const dateString = message.createdAt.split("T")[0];
    dispatch(addNewMsgGroup({ chatId, dateString }));
    dispatch(insertMsgIdIntoGroup(chatId, message));
  };
}
