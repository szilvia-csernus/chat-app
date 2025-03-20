import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatData, ChatsData } from "@/types";

export type ChatsState = {
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
      const unreadCount = action.payload.reduce(
        (acc, chat) => acc + chat.unreadMessageCount,
        0
      );
      state.allUnreadMessageCount = unreadCount;
    },
    addNewChat(state, action: PayloadAction<ChatData>) {
      if (!state.chats[action.payload.id]) {
        state.chats[action.payload.id] = action.payload;
      }
      state.allUnreadMessageCount += action.payload.unreadMessageCount;
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
        state.allUnreadMessageCount -= chat.unreadMessageCount;
        chat.unreadMessageCount = 0;
        chat.inactive = true;
      }
    },
    addMsgId(
      state,
      action: PayloadAction<{
        chatId: string;
        senderId: string;
        messageId: string;
        date: string;
      }>
    ) {
      const chat = state.chats[action.payload.chatId];
      // find the last date in the chat
      const lastDate =
        chat.msgGroupData.msgGroupChronList[
          chat.msgGroupData.msgGroupChronList.length - 1
        ];
      const lastMsgGroupData = chat.msgGroupData.msgGroups[lastDate];
      // find the last cluster in the last date (cluster by sender)
      const lastClusterId =
        lastMsgGroupData.clusterIds[lastMsgGroupData.clusterIds.length - 1];
      const lastCluster = lastMsgGroupData.msgClusters[lastClusterId];
      const lastSenderId = lastCluster.senderId;

      if (state.currentChatId === action.payload.chatId) {
        // if msg is in the same date
        if (lastDate === action.payload.date) {
          // if msg is from the same sender, add it to the last cluster
          if (lastSenderId === action.payload.senderId) {
            lastCluster.msgIds.push(action.payload.messageId);
          } else {
            // if msg is from a new sender, create a new cluster
            lastMsgGroupData.msgClusters[action.payload.messageId] = {
              id: action.payload.messageId,
              senderId: action.payload.senderId,
              msgIds: [action.payload.messageId],
            };
            lastMsgGroupData.clusterIds.push(action.payload.messageId);
          }
        } else {
          // if msg is in a new date, create a new msg group and cluster
          chat.msgGroupData.msgGroupChronList.push(action.payload.date);
          chat.msgGroupData.msgGroups[action.payload.date] = {
            msgClusters: {
              [action.payload.messageId]: {
                id: action.payload.messageId,
                senderId: action.payload.senderId,
                msgIds: [action.payload.messageId],
              },
            },
            clusterIds: [action.payload.messageId],
          };
        }
      }
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
    resetChatUnreadCount(state, action: PayloadAction<string>) {
      const chat = state.chats[action.payload];
      if (chat) {
        chat.unreadMessageCount = 0;
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
    selectCurrentChatPartnerId: (chatsState) => {
      const chatId = chatsState.currentChatId;
      const chat = chatId ? chatsState.chats[chatId] : null;
      return chat ? chat.chatPartnerId : null;
    },
    selectLastMsgIdByChatId: (chatsState, chatId: string) => {
      const chat = chatsState.chats[chatId];
      if (
        !chat ||
        !chat.msgGroupData ||
        !chat.msgGroupData.msgGroupChronList ||
        chat.msgGroupData.msgGroupChronList.length === 0
      )
        return null;

      const lastDate =
        chat.msgGroupData.msgGroupChronList[
          chat.msgGroupData.msgGroupChronList.length - 1
        ];
      const lastMsgGroupData = chat.msgGroupData.msgGroups[lastDate];
      if (!lastMsgGroupData) return null;

      const lastClusterId =
        lastMsgGroupData.clusterIds[lastMsgGroupData.clusterIds.length - 1];
      const lastCluster = lastMsgGroupData.msgClusters[lastClusterId];
      if (!lastCluster) return null;

      const lastMessageId = lastCluster.msgIds[lastCluster.msgIds.length - 1];
      return lastMessageId;
    },
    selectAllUnreadMsgCount: (chatsState) => chatsState.allUnreadMessageCount,
  },
});

export const {
  setChats,
  setCurrentChat,
  addNewChat,
  setCurrentChatId,
  deactivateChat,
  addMsgId,
  updateUnreadCount,
  resetChatUnreadCount,
} = chatsSlice.actions;

export const {
  selectChats,
  selectCurrentChatPartnerId,
  selectLastMsgIdByChatId,
  selectAllUnreadMsgCount,
} = chatsSlice.selectors;

// memoized selectors
export const selectChatIds = createSelector([selectChats], (chats) =>
  Object.keys(chats)
);

export const selectActiveChatIds = createSelector([selectChats], (chats) =>
  Object.keys(chats).filter((chatId) => !chats[chatId].inactive)
);

export const selectChatById = createSelector(
  (state: ChatsState) => state.chats,
  (state: ChatsState, chatId: string) => chatId,
  (chats, chatId) => chats[chatId]
);

export const selectCurrentChat = createSelector(
  (state: ChatsState) => state.currentChatId,
  (state: ChatsState) => state.chats,
  (currentChatId, chats) => (currentChatId ? chats[currentChatId] : null)
);

export const selectCurrentChatMsgClustersDataByDate = createSelector(
  (state: ChatsState) => state.currentChatId,
  (state: ChatsState, date: string) => date,
  (state: ChatsState) => state.chats,
  (currentChatId, date, chats) => {
    const chat = currentChatId ? chats[currentChatId] : null;
    return chat ? chat.msgGroupData.msgGroups[date] : null;
  }
);

export const selectCurrentChatMsgClusterById = createSelector(
  (state: ChatsState) => state.currentChatId,
  (state: ChatsState, date: string) => date,
  (state: ChatsState, date: string, clusterId: string) => clusterId,
  (state: ChatsState) => state.chats,
  (currentChatId, date, clusterId, chats) => {
    const chat = currentChatId ? chats[currentChatId] : null;
    const msgGroupData = chat?.msgGroupData.msgGroups[date];
    return msgGroupData?.msgClusters[clusterId] || null;
  }
);

export const selectCurrentChatMsgGroupChronList = createSelector(
  (state: ChatsState) => state.currentChatId,
  (state: ChatsState) => state.chats,
  (currentChatId, chats) => {
    const chat = currentChatId ? chats[currentChatId] : null;
    return chat ? chat.msgGroupData.msgGroupChronList : [];
  }
);

export default chatsSlice.reducer;
