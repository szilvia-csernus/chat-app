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
      const lastDate =
        chat.msgGroupData.msgGroupChronList[
          chat.msgGroupData.msgGroupChronList.length - 1
        ];
      const lastMsgGroupData = chat.msgGroupData.msgGroups[lastDate];
      const lastClusterId =
        lastMsgGroupData.clusterIds[lastMsgGroupData.clusterIds.length - 1];
      const lastCluster = lastMsgGroupData.msgClusters[lastClusterId];
      const lastSenderId = lastCluster.senderId;

      if (state.currentChatId === action.payload.chatId) {
        if (lastDate === action.payload.date) {
          if (lastSenderId === action.payload.senderId) {
            lastCluster.msgIds.push(action.payload.messageId);
          } else {
            lastMsgGroupData.msgClusters[action.payload.messageId] = {
              id: action.payload.messageId,
              senderId: action.payload.senderId,
              msgIds: [action.payload.messageId],
            };
            lastMsgGroupData.clusterIds.push(action.payload.messageId);
          }
        } else {
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
    selectCurrentChatMsgGroupChronList: (chatsState) => {
      const chatId = chatsState.currentChatId;
      const chat = chatId ? chatsState.chats[chatId] : null;
      const msgGroupChronList = chat
        ? chat.msgGroupData.msgGroupChronList
        : ([] as string[]);
      return msgGroupChronList;
    },
    selectCurrentChatMsgClustersDataByDate: (chatsState, date: string) => {
      const chatId = chatsState.currentChatId;
      const chat = chatId ? chatsState.chats[chatId] : null;
      return chat ? chat.msgGroupData.msgGroups[date] : null;
    },
    selectCurrentChatMsgClusterById: (
      chatsState,
      date: string,
      clusterId: string
    ) => {
      const chatId = chatsState.currentChatId;
      const chat = chatId ? chatsState.chats[chatId] : null;
      const msgGroupData = chat?.msgGroupData.msgGroups[date];
      return msgGroupData?.msgClusters[clusterId] || null;
    },
    selectLastMsgIdByChatId: (chatsState, chatId: string) => {
      const chat = chatsState.chats[chatId];
      if (!chat) return null;

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
  decrementChatUnreadCount,
  updateUnreadCount,
} = chatsSlice.actions;

export const {
  selectChats,
  selectChatById,
  selectCurrentChat,
  selectCurrentChatPartnerId,
  selectCurrentChatMsgGroupChronList,
  selectCurrentChatMsgClustersDataByDate,
  selectCurrentChatMsgClusterById,
  selectLastMsgIdByChatId,
  selectAllUnreadMsgCount,
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
