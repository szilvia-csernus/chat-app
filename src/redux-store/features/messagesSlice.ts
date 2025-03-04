import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SerializedMessage, SerializedMessages } from "@/types";

type MessagesState = {
  messages: SerializedMessages;
};

const initialState: MessagesState = {
  messages: {} as SerializedMessages,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<SerializedMessage[]>) {
      action.payload.forEach((msg) => {
        if (!state.messages[msg.id]) {
          state.messages[msg.id] = msg;
        }
      });
    },
    addNewMessage(state, action: PayloadAction<SerializedMessage>) {
      if (!state.messages[action.payload.id]) {
        state.messages[action.payload.id] = action.payload;
      }
    },
    updateMessageReadStatus(state, action: PayloadAction<string>) {
      const message = state.messages[action.payload];
      if (message) {
        message.read = true;
      }
    },
    updateMessagesWithDeletedStatus(state, action: PayloadAction<string[]>) {
      action.payload.forEach((id) => {
        const message = state.messages[id];
        if (message) {
          message.deleted = true;
          message.content = "Deleted message";
        }
      });
    },
  },
  selectors: {
    selectMessageById: (messagesState, id: string) =>
      messagesState.messages[id],
  },
});

export const {
  setMessages,
  addNewMessage,
  updateMessageReadStatus,
  updateMessagesWithDeletedStatus,
} = messagesSlice.actions;

export const { selectMessageById } = messagesSlice.selectors;

export default messagesSlice.reducer;
