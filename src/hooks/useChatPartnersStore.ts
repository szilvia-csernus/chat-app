import { ChatPartner } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type ChatPartnersState = {
  chatPartners: ChatPartner[];
  set: (chatPartners: ChatPartner[]) => void;
  add: (chatPartner: ChatPartner) => void;
  remove: (id: string) => void;
}


export const useChatPartnersStore = create<ChatPartnersState>()(
  devtools(
    (set) => ({
      chatPartners: [],
      set: (chatPartners) => {
        console.log("Setting chatPartners:", chatPartners);
        set((state) => {
          if (state.chatPartners !== chatPartners) {
            return { chatPartners };
          }
          return state;
        });
      },
      add: (chatPartner) => {
        console.log("Adding chatPartner:", chatPartner);
        set((state) => {
          if (!state.chatPartners.find((c) => c.chatId === chatPartner.chatId)) {
            return { chatPartners: [chatPartner, ...state.chatPartners] };
          }
          return state;
        });
      },
      remove: (id) => {
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
