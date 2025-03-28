import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatData, ChatsData, SerializedMessage } from "@/types";


export type ChatsState = {
  chats: ChatsData;
  chatIds: string[];
  currentChatId: string | null;
  allUnreadMessageCount: number;
  populated: boolean;
  allMsgsLoaded: {[key: string]: boolean};
};

const initialState: ChatsState = {
  chats: {} as ChatsData,
  chatIds: [],
  currentChatId: null,
  allUnreadMessageCount: 0,
  populated: false,
  allMsgsLoaded: {},
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<ChatData[]>) {
      action.payload.forEach((chat) => {
        if (!state.chats[chat.id]) {
          state.chats[chat.id] = chat;
          state.chatIds.push(chat.id);
          state.populated = true;
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
        state.chatIds.push(action.payload.id);
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
    appendMsgId(
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
    prependMsgId(
      state,
      action: PayloadAction<{ message: SerializedMessage, date: string, chatId: string }>
    ) {
      const message = action.payload.message;
      if (!message.senderId) return;

      const chat = state.chats[action.payload.chatId];
      // find the first date in the chat
      const firstDate = chat.msgGroupData.msgGroupChronList[0];
      const firstMsgGroupData = chat.msgGroupData.msgGroups[firstDate];
      const firstClusterId = firstMsgGroupData.clusterIds[0];
      const firstCluster = firstMsgGroupData.msgClusters[firstClusterId];
      const firstSenderId = firstCluster.senderId;
      const msgDate = action.payload.date;

      if (state.currentChatId === action.payload.chatId) {
       
        if (firstDate === msgDate) {
          if (firstSenderId === message.senderId) {
            firstCluster.msgIds.unshift(message.id);
          } else {
            firstMsgGroupData.msgClusters[message.id] = {
              id: message.id,
              senderId: message.senderId,
              msgIds: [message.id],
            };
            firstMsgGroupData.clusterIds.unshift(message.id);
          }
        } else {
          chat.msgGroupData.msgGroupChronList.unshift(msgDate);
          chat.msgGroupData.msgGroups[msgDate] = {
            msgClusters: {
              [message.id]: {
                id: message.id,
                senderId: message.senderId,
                msgIds: [message.id],
              },
            },
            clusterIds: [message.id],
          };
        }
      }
    },
    setAllMsgsLoadedForChatId(state, action: PayloadAction<string | null>) {
      if (action.payload) {
        state.allMsgsLoaded[action.payload] = true;
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
    selectChatIds: (chatsState) => chatsState.chatIds,
    selectCurrentChatId: (chatsState) => chatsState.currentChatId,
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
    selectFirstLoadedMsgIdByChatId: (chatsState, chatId: string | null) => {
      if (!chatId) return null;
      const chat = chatsState.chats[chatId];
      if (
        !chat ||
        !chat.msgGroupData ||
        !chat.msgGroupData.msgGroupChronList ||
        chat.msgGroupData.msgGroupChronList.length === 0
      )
        return null;

      const firstDate = chat.msgGroupData.msgGroupChronList[0];
      const firstMsgGroupData = chat.msgGroupData.msgGroups[firstDate];
      if (!firstMsgGroupData) return null;

      const firstClusterId = firstMsgGroupData.clusterIds[0];
      const firstCluster = firstMsgGroupData.msgClusters[firstClusterId];
      if (!firstCluster) return null;

      const firstMessageId = firstCluster.msgIds[0];
      return firstMessageId;
    },
    selectAllMsgsLoadedForCurrentChat: (chatsState) =>
      chatsState.allMsgsLoaded[chatsState.currentChatId || ""],
    selectAllUnreadMsgCount: (chatsState) => chatsState.allUnreadMessageCount,
    selectChatsPopulated: (chatsState) => chatsState.populated,
  },
});

export const {
  setChats,
  setCurrentChat,
  addNewChat,
  setCurrentChatId,
  deactivateChat,
  appendMsgId,
  prependMsgId,
  setAllMsgsLoadedForChatId,
  updateUnreadCount,
  resetChatUnreadCount,
} = chatsSlice.actions;

export const {
  selectChats,
  selectChatIds,
  selectCurrentChatId,
  selectCurrentChatPartnerId,
  selectLastMsgIdByChatId,
  selectFirstLoadedMsgIdByChatId,
  selectAllMsgsLoadedForCurrentChat,
  selectAllUnreadMsgCount,
  selectChatsPopulated,
} = chatsSlice.selectors;

// memoized selectors

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
