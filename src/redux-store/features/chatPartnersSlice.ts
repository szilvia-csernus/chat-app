import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatPartner } from "@/types";


type ChatPartnersState = {
  chatPartners: ChatPartner[];
};

const initialState: ChatPartnersState = {
  chatPartners: [],
};

const chatPartnersSlice = createSlice({
  name: "chatPartners",
  initialState,
  reducers: {
    setChatPartners(state, action: PayloadAction<ChatPartner[]>) {
      state.chatPartners = action.payload;
    },
    addChatPartner(state, action: PayloadAction<ChatPartner>) {
      state.chatPartners.push(action.payload);
    },
    removeChatPartner(state, action: PayloadAction<string>) {
      state.chatPartners = state.chatPartners.filter(
        (partner) => partner.chatId !== action.payload
      );
    },
  },
  selectors: {
    selectAllChatPartners: (chatPartnersState) => chatPartnersState.chatPartners,
  },
});

export const { setChatPartners, addChatPartner, removeChatPartner } =
  chatPartnersSlice.actions;

export const { selectAllChatPartners } = chatPartnersSlice.selectors;

export default chatPartnersSlice.reducer;
