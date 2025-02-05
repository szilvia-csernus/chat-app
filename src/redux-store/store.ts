import { configureStore } from "@reduxjs/toolkit";
import currentChatReducer from "./features/currentChatSlice";
import presenceReducer from "./features/presenceSlice";
import recentChatsReducer from "./features/recentChatsSlice";
import chatPartnersReducer from "./features/chatPartnersSlice";


export const makeStore = () => {
  return configureStore({
    reducer: {
    currentChat: currentChatReducer,
    presence: presenceReducer,
    recentChats: recentChatsReducer,
    chatPartners: chatPartnersReducer,
  },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
