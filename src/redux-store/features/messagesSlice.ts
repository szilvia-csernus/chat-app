import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SerializedMessage, SerializedMessages } from "@/types";

export type MessagesState = {
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
    addNewMsg(state, action: PayloadAction<SerializedMessage>) {
      if (!state.messages[action.payload.id]) {
        state.messages[action.payload.id] = action.payload;
      }
    },
    updateMsgReadStatus(state, action: PayloadAction<string>) {
      const message = state.messages[action.payload];
      if (message) {
        message.read = true;
      }
    },
    updateMsgsWithDeletedStatus(state, action: PayloadAction<string[]>) {
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
    selectMsgById: (messagesState, id: string | null) => {
      if (!id) return null;
      return messagesState.messages[id];
    },
  },
});

export const {
  setMessages,
  addNewMsg,
  updateMsgReadStatus,
  updateMsgsWithDeletedStatus,
} = messagesSlice.actions;

export const { selectMsgById } = messagesSlice.selectors;

export default messagesSlice.reducer;
