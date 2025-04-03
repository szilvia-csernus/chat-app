import { Member, MessageData, SerializedMessage } from "@/types";
import { AppThunk, RootState } from "./store";
import {
  addNewMsgGroup,
  appendMsgId,
  resetChatUnreadCount,
  selectLastMsgIdByChatId,
  setAllMsgsLoadedForChatId,
  updateUnreadCount,
} from "./features/chatsSlice";
import {
  // getAllUnreadMessageCount,
  getRecentChats,
  getUnreadMessageCount,
  loadNewMessagesAndUnreadCount,
} from "@/app/actions/chatActions";
import {
  // getMoreNewMessages,
  getMoreOldMessages,
  updateMessagesWithReadStatus,
  updateReadStatus,
} from "@/app/actions/messageActions";
import { addNewMsg, selectMsgById } from "./features/messagesSlice";
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
import { usePopulateStore } from "./hooks";
import { serializeMessage } from "@/lib/serialize";
import { setLastMessageInFocus } from "./features/uiSlice";
import { insertMsgIdIntoGroup } from "./utilityFunctions";

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

    // Both sides: add the message to the store
    dispatch(addNewMsg(message));
    dispatch(
      appendMsgId({
        chatId,
        senderId: message.senderId!,
        messageId: message.id,
        date,
      })
    );

    // Receiver side: if chat is not visible,
    // update the unread count for that chat
    if (!chatVisible && message.senderId !== currentMemberId) {
      const unreadCount = await getUnreadMessageCount(chatId);
      console.log("addNewMessage: Updating unread count", unreadCount);
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
      console.log(
        "addNewMessage: Updating read status in the database for message",
        message.id
      );
      await updateReadStatus(message.id);
    }

    // Both sides: if the message is for the current chat and the chat is visible,
    // scroll the new message into view
    if (chatVisible && currentChatId === chatId) {
      console.log("addNewMessage: Scrolling into view for message");
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
    console.log(
      "loadMoreMessages called with chatId:",
      chatId,
      "and oldestMsgId:",
      oldestMsgId
    );

    if (!chatId) return null;

    const messages = await getMoreOldMessages(chatId, oldestMsgId);
    console.log("Messages fetched in loadMoreOldMessages:", messages);

    if (!messages) {
      return null;
    }

    if (messages.length === 0) {
      console.log("No more messages to load.");
      return null;
    }

    if (messages.length < 10) {
      dispatch(setAllMsgsLoadedForChatId(chatId));
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
        dispatch(insertMsgId(message, chatId));
      }
    }
  };
}

export function refreshChat(chatId: string | null): AppThunk {
  return async (dispatch, getState) => {
    console.log("refreshWidhNewMessages called with chatId:", chatId);

    if (!chatId) return null;

    const state = getState();
    const latestMsgId = selectLastMsgIdByChatId(state, chatId);
    const lastMsgDate =
      selectMsgById(state.messages, latestMsgId)?.createdAt || null;

    console.log("Last message date:", lastMsgDate);

    const result = await loadNewMessagesAndUnreadCount(chatId, lastMsgDate);
    if (!result) {
      console.log("No new messages or unread count available.");
      return null;
    }
    const { messages, unreadCount } = result;
    console.log("Messages fetched in loadMoreNewMessages:", messages);

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
        dispatch(insertMsgId(message, chatId));
      }
    }

    dispatch(updateUnreadCount({ chatId, count: unreadCount }));
  };
}

export function insertMsgId(message: MessageData, chatId: string): AppThunk {
  return async (dispatch) => {
    const dateString = message.createdAt.toISOString().split("T")[0];
    dispatch(addNewMsgGroup({ chatId, dateString }));
    dispatch(insertMsgIdIntoGroup(chatId, dateString, message));
  };
}
