import { Chat } from "@/types";
import { Message } from "@prisma/client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type CurrentChatState = {
  chat: Chat | null;
  setCurrentChat: (chat: Chat) => void;
  addMessage: (message: Message) => void;
  updateMessageReadStatus: (messageId: string) => void;
  resetCurrentChat: () => void;
};

export const useCurrentChatStore = create<CurrentChatState>()(
  devtools(
    (set) => ({
      chat: null,
      setCurrentChat: (chat) => {
        console.log("Setting chat:", chat);
        set({ chat });
      },
      addMessage: (message) => {
        console.log("Adding message:", message);
        set((state) => {
          if (state.chat) {
            return {
              chat: {
                ...state.chat,
                messages: [...state.chat.messages, message],
              },
            };
          }
          return state;
        });
      },
      updateMessageReadStatus: (messageId) => {
        set((state) => {
          console.log("Updating message read status:", messageId);
          if (state.chat) {
            const updatedMessages = state.chat.messages.map((message) => {
              if (message.id === messageId) {
                return { ...message, read: true };
              }
              return message;
            });

            return {
              chat: {
                ...state.chat,
                messages: updatedMessages,
              },
            };
          }
          return state;
        });
      },
      resetCurrentChat: () => {
        set({ chat: null });
      },
    }),
    { name: "currentChatStore" }
  )
);
