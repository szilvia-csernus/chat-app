import { RecentChat } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type RecentChatsState = {
  recentChats: RecentChat[];
  setRecentChats: (recentChats: RecentChat[]) => void;
  addRecentChat: (recentChat: RecentChat) => void;
  removeRecentChat: (id: string) => void;
  addLastMessageToRecentChat: (id: string, message: string) => void;
  updateUnreadCount: (id: string, count: number) => void;
}


export const useRecentChatsStore = create<RecentChatsState>()(
  devtools(
    (set) => ({
      recentChats: [],
      setRecentChats: (recentChats) => {
        set((state) => {
          if (state.recentChats !== recentChats) {
            return { recentChats };
          }
          return state;
        });
      },
      addRecentChat: (recentChat) => {
        console.log("Adding recentChat:", recentChat);
        set((state) => {
          if (!state.recentChats.find((c) => c.id === recentChat.id)) {
            return { recentChats: [recentChat, ...state.recentChats] };
          }
          return state;
        });
      },
      removeRecentChat: (id) => {
        console.log("Removing recentChat with id:", id);
        set((state) => {
          const newRecentChats = state.recentChats.filter(
            (c) => c.id !== id
          );
          if (state.recentChats.length !== newRecentChats.length) {
            return { recentChats: newRecentChats };
          }
          return state;
        });
      },
      addLastMessageToRecentChat: (id, message) => {
        set((state) => {
          const updatedRecentChats = state.recentChats.map((rc) => {
            if (rc.id === id) {
              return { ...rc, lastMessage: message };
            }
            return rc;
          });

          return { recentChats: updatedRecentChats };
        });
      },
      updateUnreadCount: (id: string, count: number) => {
        set((state) => {
          const updatedRecentChats = state.recentChats.map((rc) => {
            if (rc.id === id) {
              return { ...rc, unreadMessageCount: count };
            }
            return rc;
          });

          return { recentChats: updatedRecentChats };
        });
      }
    }),
    { name: "recentChatsStore" }
  )
);
