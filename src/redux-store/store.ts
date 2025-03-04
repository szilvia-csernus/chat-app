import { configureStore, ThunkAction, UnknownAction} from "@reduxjs/toolkit";
import membersReducer from "./features/membersSlice";
import currentMemberReducer from "./features/currentMemberSlice";
import chatsReducer from "./features/chatsSlice";
import messagesReducer from "./features/messagesSlice";


export const makeStore = () => {
  return configureStore({
    reducer: {
      currentMember: currentMemberReducer,
      members: membersReducer,
      chats: chatsReducer,
      messages: messagesReducer
  },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;
