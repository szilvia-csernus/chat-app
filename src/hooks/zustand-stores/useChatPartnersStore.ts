import { ChatPartner } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type ChatPartnersState = {
  chatPartners: ChatPartner[];
  setChatPartners: (chatPartners: ChatPartner[]) => void;
  addChatPartner: (chatPartner: ChatPartner) => void;
  removeChatPartner: (id: string) => void;
}


export const useChatPartnersStore = create<ChatPartnersState>()(
  devtools(
    (set) => ({
      chatPartners: [],
      setChatPartners: (chatPartners) => {
        set((state) => {
          if (state.chatPartners !== chatPartners) {
            return { chatPartners };
          }
          return state;
        });
      },
      addChatPartner: (chatPartner) => {
        console.log("Adding chatPartner:", chatPartner);
        set((state) => {
          if (!state.chatPartners.find((c) => c.chatId === chatPartner.chatId)) {
            return { chatPartners: [chatPartner, ...state.chatPartners] };
          }
          return state;
        });
      },
      removeChatPartner: (id) => {
        console.log("Removing chatPartner with id:", id);
        set((state) => {
          const newChatPartners = state.chatPartners.filter(
            (c) => c.chatId !== id
          );
          if (state.chatPartners.length !== newChatPartners.length) {
            return { chatPartners: newChatPartners };
          }
          return state;
        });
      },
    }),
    { name: "chatPartnersStore" }
  )
);
