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
    updateChatPartnerLastActive(
      state,
      action: PayloadAction<{ chatPartnerId: string; lastActive: string }>
    ) {
      if (state.chatPartners) {
        state.chatPartners.find(
          (p) => p.chatPartner.id === action.payload.chatPartnerId
        )!.chatPartner.lastActive = action.payload.lastActive;
      }
    },
  },
  selectors: {
    selectAllChatPartners: (chatPartnersState) =>
      chatPartnersState.chatPartners,
  },
});

export const {
  setChatPartners,
  addChatPartner,
  removeChatPartner,
  updateChatPartnerLastActive,
} = chatPartnersSlice.actions;

export const { selectAllChatPartners } = chatPartnersSlice.selectors;

export const selectChatPartnerById =
  (memberId: string) => (state: { chatPartners: ChatPartnersState }) => {
    return state.chatPartners.chatPartners.find(
      (cp) => cp.chatPartner.id === memberId
    );
  };

export default chatPartnersSlice.reducer;
