import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecentChat } from "@/types";

type RecentChatsState = {
  recentChats: RecentChat[];
  allUnreadMessageCount: number;
};

const initialState: RecentChatsState = {
  recentChats: [],
  allUnreadMessageCount: 0,
};

const recentChatsSlice = createSlice({
  name: "recentChats",
  initialState,
  reducers: {
    setRecentChats(state, action: PayloadAction<RecentChat[]>) {
      state.recentChats = action.payload;
    },
    addRecentChat(state, action: PayloadAction<RecentChat>) {
      state.recentChats.push(action.payload);
    },
    removeRecentChat(state, action: PayloadAction<string>) {
      state.recentChats = state.recentChats.filter(
        (chat) => chat.id !== action.payload
      );
    },
    addLastMessageToRecentChat(
      state,
      action: PayloadAction<{ chatId: string; content: string }>
    ) {
      const chat = state.recentChats.find(
        (chat) => chat.id === action.payload.chatId
      );
      if (chat) {
        chat.lastMessage = action.payload.content;
      }
    },
    updateUnreadCount(
      state,
      action: PayloadAction<{ chatId: string; count: number }>
    ) {
      const chat = state.recentChats.find(
        (chat) => chat.id === action.payload.chatId
      );
      if (chat) {
        chat.unreadMessageCount = action.payload.count;
      }
    },
    setAllUnreadMessageCount(state) {
      state.allUnreadMessageCount = state.recentChats.reduce(
        (acc, chat) => acc + chat.unreadMessageCount,
        0
      );
    }
  },
  selectors: {
    selectRecentChats: (recentChatsState) => recentChatsState.recentChats,
    selectAllUnreadMessageCount: (recentChatsState) =>
      recentChatsState.allUnreadMessageCount
  },
});

export const {
  setRecentChats,
  addRecentChat,
  removeRecentChat,
  addLastMessageToRecentChat,
  updateUnreadCount,
  setAllUnreadMessageCount,
} = recentChatsSlice.actions;

export const { selectRecentChats, selectAllUnreadMessageCount } =
  recentChatsSlice.selectors;

export default recentChatsSlice.reducer;
