import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat, SerializedMessage } from "@/types";


type CurrentChatState = {
  currentChat: Chat | null;
};

const initialState: CurrentChatState = {
  currentChat: null,
};

const currentChatSlice = createSlice({
  name: "currentChat",
  initialState,
  reducers: {
    setCurrentChat(state, action: PayloadAction<Chat>) {
      state.currentChat = action.payload;
    },
    addMessage(state, action: PayloadAction<SerializedMessage>) {
      if (state.currentChat) {
        state.currentChat.messages.push(action.payload);
      }
    },
    updateMessageReadStatus(state, action: PayloadAction<string>) {
      if (state.currentChat) {
        state.currentChat.messages = state.currentChat.messages.map(
          (message: SerializedMessage) =>
            message.id === action.payload ? { ...message, read: true } : message
        );
      }
    },
    resetCurrentChat(state) {
      state.currentChat = null;
    },
  },
  selectors: {
    selectCurrentChat: (currentChatState) => currentChatState.currentChat,
  },
});

export const {
  setCurrentChat,
  addMessage,
  updateMessageReadStatus,
  resetCurrentChat,
} = currentChatSlice.actions;

export const { selectCurrentChat } = currentChatSlice.selectors;

export default currentChatSlice.reducer;
