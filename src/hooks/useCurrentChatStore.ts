import { Chat } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type CurrentChatState = {
  chat: Chat | null;
  setCurrentChat: (chat: Chat) => void;
  addMessage: (message: string) => void;
  resetCurrentChat: () => void;
}


export const useCurrentChatStore = create<CurrentChatState>()(
  devtools(
    (set) => ({
      chat: {},
      setCurrentChat: (chat) => {
        console.log("Setting chat:", chat);
        set(state => ({ chat }))
      },
      addMessage: (message) => {
        console.log("Adding message:", message);
        set(state => {
          if (state.chat) {
            return { chat: { ...state.chat, messages: [...state.chat.messages, message] } };
          }
          return state;
        })
      },
      resetCurrentChat: () => {
        set({ chat: null });
      },
    }),
    { name: "chatsStore" }
  )
);
