import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatData, ChatsData } from "@/types";

type ChatsState = {
  chats: ChatsData;
  currentChatId: string | null;
  allUnreadMessageCount: number;
};

const initialState: ChatsState = {
  chats: {} as ChatsData,
  currentChatId: null,
  allUnreadMessageCount: 0,
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<ChatData[]>) {
      action.payload.forEach((chat) => {
        if (!state.chats[chat.id]) {
          state.chats[chat.id] = chat;
        }
      });
    },
    addNewChat(state, action: PayloadAction<ChatData>) {
      if (!state.chats[action.payload.id]) {
        state.chats[action.payload.id] = action.payload;
      }
    },
    setCurrentChat(state, action: PayloadAction<ChatData>) {
      state.chats[action.payload.id] = action.payload;
      state.currentChatId = action.payload.id;
    },
    setCurrentChatId(state, action: PayloadAction<string>) {
      state.currentChatId = action.payload;
    },
    deactivateChat(state, action: PayloadAction<string>) {
      const chat = state.chats[action.payload];
      const chatPartner = chat?.chatPartnerId;
      if (chat && chatPartner) {
        chat.unreadMessageCount = 0;
        chat.inactive = true;
      }
    },
    addMessageId(
      state,
      action: PayloadAction<{ chatId: string; messageId: string; date: string }>
    ) {
      const chat = state.chats[action.payload.chatId];
      const lastDate =
        chat.msgGroupChronList[chat.msgGroupChronList.length - 1];
      if (state.currentChatId === action.payload.chatId) {
        if (lastDate === action.payload.date) {
          chat.msgGroups[lastDate].push(action.payload.messageId);
        } else {
          chat.msgGroups[action.payload.date] = [action.payload.messageId];
          chat.msgGroupChronList.push(action.payload.date);
        }
      }
    },
    decrementChatUnreadCount(state, action: PayloadAction<string>) {
      state.chats[action.payload].unreadMessageCount -= 1;
      state.allUnreadMessageCount -= 1;
    },
    updateUnreadCount(
      state,
      action: PayloadAction<{ chatId: string; count: number }>
    ) {
      const chat = state.chats[action.payload.chatId];
      if (chat) {
        chat.unreadMessageCount = action.payload.count;
      }
      state.allUnreadMessageCount = Object.keys(state.chats).reduce(
        (acc, idx) => acc + state.chats[idx].unreadMessageCount,
        0
      );
    },
    // updateAllUnreadCount(state) {
    //   state.allUnreadMessageCount = state.chatIds.reduce(
    //     (acc, idx) => acc + state.chats[idx].unreadMessageCount,
    //     0
    //   );
    // },
  },
  selectors: {
    selectChats: (chatsState) => chatsState.chats,
    selectChatById: (chatsState, chatId: string) => chatsState.chats[chatId],
    selectCurrentChat: (chatsState) =>
      chatsState.currentChatId && chatsState.chats[chatsState.currentChatId],
    selectCurrentChatPartnerId: (chatsState) => {
      const chatId = chatsState.currentChatId;
      const chat = chatId ? chatsState.chats[chatId] : null;
      return chat ? chat.chatPartnerId : null;
    },
    selectCurrentChatMsgIdGroupChronList: (chatsState) => {
      const chatId = chatsState.currentChatId;
      const chat = chatId ? chatsState.chats[chatId] : null;
      const msgGroupChronList = chat
        ? chat.msgGroupChronList
        : ([] as string[]);
      return msgGroupChronList;
    },
    selectCurrentChatGroupedMessageIdsByDate: (chatsState, date: string) => {
      const chatId = chatsState.currentChatId;
      const chat = chatId ? chatsState.chats[chatId] : null;
      return chat ? chat.msgGroups[date] : [];
    },
    selectLastMessageIdByChatId: (chatsState, chatId: string) => {
      const chat = chatsState.chats[chatId];
      const lastDate = chat
        ? chat.msgGroupChronList[chat.msgGroupChronList.length - 1]
        : null;
      const lastMessageIdIndex = lastDate
        ? chat.msgGroups[lastDate].length - 1
        : null;
      return lastMessageIdIndex && lastDate
        ? chat.msgGroups[lastDate][lastMessageIdIndex]
        : null;
    },
    selectAllUnreadMessageCount: (chatsState) =>
      chatsState.allUnreadMessageCount,
  },
});

export const {
  setChats,
  setCurrentChat,
  addNewChat,
  setCurrentChatId,
  deactivateChat,
  addMessageId,
  decrementChatUnreadCount,
  updateUnreadCount,
} = chatsSlice.actions;

export const {
  selectChats,
  selectChatById,
  selectCurrentChat,
  selectCurrentChatPartnerId,
  selectCurrentChatMsgIdGroupChronList,
  selectCurrentChatGroupedMessageIdsByDate,
  selectLastMessageIdByChatId,
  selectAllUnreadMessageCount,
} = chatsSlice.selectors;

// memoized selectors
export const selectChatIds = createSelector([selectChats], (chats) =>
  Object.keys(chats)
);

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

export default chatsSlice.reducer;
