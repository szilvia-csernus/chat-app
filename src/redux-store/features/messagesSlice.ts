import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
  }
});

export const {
  setMessages,
  addNewMsg,
  updateMsgReadStatus,
  updateMsgsWithDeletedStatus,
} = messagesSlice.actions;


// Memoized selector

export const selectMsgById = createSelector(
  (state: MessagesState) => state.messages,
  (state: MessagesState, id: string | null) => id,
  (messages, id) => {
    if (!id) return null;
    return messages[id];
  }
)

export default messagesSlice.reducer;
