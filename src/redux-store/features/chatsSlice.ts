import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatData, ChatsData, MsgClustersData } from "@/types";
import dayjs from "dayjs";


export type ChatsState = {
  chats: ChatsData;
  chatIds: string[];
  currentChatId: string | null;
  allUnreadMessageCount: number;
  populated: boolean;
  allOldMsgsLoaded: { [key: string]: boolean };
};

const initialState: ChatsState = {
  chats: {} as ChatsData,
  chatIds: [],
  currentChatId: null,
  allUnreadMessageCount: 0,
  populated: false,
  allOldMsgsLoaded: {},
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
          // count all the messages in this chat and if it's less than
          // 10, set allOldMsgsLoaded to true
          if (chat.msgGroupsData.msgGroupChronList.length < 10) {
            state.allOldMsgsLoaded[chat.id] = true;
          }
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
      state.allOldMsgsLoaded[action.payload.id] = true;
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
    addNewMsgGroup(state, action: PayloadAction<{chatId: string, dateString: string}>) {
      const chat = state.chats[action.payload.chatId];
      const msgGroupData = chat.msgGroupsData;
      const newDate = dayjs.utc(action.payload.dateString);
      // Check if the date is already in the list
      if (!msgGroupData.msgGroups[action.payload.dateString]) {
        msgGroupData.msgGroups[action.payload.dateString] = {
          msgClusters: {},
          clusterIdsChronList: [],
        };
        const chronList = msgGroupData.msgGroupChronList;
        for (let i = 0; i < chronList.length; i++) {
          const groupDate = dayjs.utc(chronList[i]);
          // If the date is less than group date, insert it before
          if (newDate < groupDate) {
            // Insert the date in the right position
            chronList.splice(i, 0, action.payload.dateString);
            return;
          }
        }
        // If the date is greater than all the dates in the list, push it to the end
        chronList.push(action.payload.dateString);
      }
    },
    updateMsgGroup(state, action: PayloadAction<{chatId: string, date: string, msgGroup: MsgClustersData}>) {
      const chat = state.chats[action.payload.chatId];
      chat.msgGroupsData.msgGroups[action.payload.date] = action.payload.msgGroup;
    },
    setAllOldMsgsLoadedForChatId(state, action: PayloadAction<string | null>) {
      if (action.payload) {
        state.allOldMsgsLoaded[action.payload] = true;
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
    selectLastMsgIdByChatId: (chatsState, chatId: string | null) => {
      if (!chatId) return null;

      const chat = chatsState.chats[chatId];
      if (
        !chat ||
        !chat.msgGroupsData ||
        !chat.msgGroupsData.msgGroupChronList ||
        chat.msgGroupsData.msgGroupChronList.length === 0
      )
        return null;

      const lastDate =
        chat.msgGroupsData.msgGroupChronList[
          chat.msgGroupsData.msgGroupChronList.length - 1
        ];
      const lastMsgGroupData = chat.msgGroupsData.msgGroups[lastDate];
      if (!lastMsgGroupData) return null;

      const lastClusterId =
        lastMsgGroupData.clusterIdsChronList[
          lastMsgGroupData.clusterIdsChronList.length - 1
        ];
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
        !chat.msgGroupsData ||
        !chat.msgGroupsData.msgGroupChronList ||
        chat.msgGroupsData.msgGroupChronList.length === 0
      )
        return null;

      const firstDate = chat.msgGroupsData.msgGroupChronList[0];
      const firstMsgGroupData = chat.msgGroupsData.msgGroups[firstDate];
      if (!firstMsgGroupData) return null;

      const firstClusterId = firstMsgGroupData.clusterIdsChronList[0];
      const firstCluster = firstMsgGroupData.msgClusters[firstClusterId];
      if (!firstCluster) return null;

      const firstMessageId = firstCluster.msgIds[0];
      return firstMessageId;
    },
    selectAllOldMsgsLoadedForCurrentChat: (chatsState) =>
      chatsState.allOldMsgsLoaded[chatsState.currentChatId || ""],
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
  addNewMsgGroup,
  updateMsgGroup,
  setAllOldMsgsLoadedForChatId,
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
  selectAllOldMsgsLoadedForCurrentChat,
  selectAllUnreadMsgCount,
  selectChatsPopulated,
} = chatsSlice.selectors;

// memoized selectors

export const selectActiveChatIds = createSelector([selectChats], (chats) =>
  Object.keys(chats).filter((chatId) => !chats[chatId].inactive)
);

export const selectChatById = createSelector(
  (state: ChatsState) => state.chats,
  (_, chatId: string) => chatId,
  (chats, chatId) => chats[chatId]
);

export const selectCurrentChat = createSelector(
  (state: ChatsState) => state.currentChatId,
  (state: ChatsState) => state.chats,
  (currentChatId, chats) => (currentChatId ? chats[currentChatId] : null)
);

export const selectCurrentChatMsgClustersDataByDate = createSelector(
  (state: ChatsState) => state.currentChatId,
  (_, date: string) => date,
  (state: ChatsState) => state.chats,
  (currentChatId, date, chats) => {
    const chat = currentChatId ? chats[currentChatId] : null;
    return chat ? chat.msgGroupsData.msgGroups[date] : null;
  }
);

export const selectCurrentChatMsgClusterById = createSelector(
  (state: ChatsState) => state.currentChatId,
  (_, date: string) => date,
  (_, __, clusterId: string) => clusterId,
  (state: ChatsState) => state.chats,
  (currentChatId, date, clusterId, chats) => {
    const chat = currentChatId ? chats[currentChatId] : null;
    const msgGroupData = chat?.msgGroupsData.msgGroups[date];
    return msgGroupData?.msgClusters[clusterId] || null;
  }
);

export const selectCurrentChatMsgGroupChronList = createSelector(
  (state: ChatsState) => state.currentChatId,
  (state: ChatsState) => state.chats,
  (currentChatId, chats) => {
    const chat = currentChatId ? chats[currentChatId] : null;
    return chat ? chat.msgGroupsData.msgGroupChronList : [];
  }
);

export default chatsSlice.reducer;
