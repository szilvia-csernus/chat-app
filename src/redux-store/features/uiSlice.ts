import { createSlice } from "@reduxjs/toolkit";

type UiState = {
  isSidebarOpen: boolean;
  chatVisible: boolean;
  lastMessageInFocus: boolean;
};

const initialState: UiState = {
  isSidebarOpen: false,
  chatVisible: false,
  lastMessageInFocus: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openSidebar(state) {
      state.isSidebarOpen = true;
      state.chatVisible = false;
    },
    closeSidebar(state) {
      state.isSidebarOpen = false;
      state.chatVisible = true;
    },
    setChatVisible(state, action) {
      state.chatVisible = action.payload;
    },
    setLastMessageInFocus(state, action) {
      state.lastMessageInFocus = action.payload;
    },
  },
  selectors: {
    selectIsSidebarOpen: (uiState) => uiState.isSidebarOpen,
    selectChatVisible: (uiState) => uiState.chatVisible,
    selectLastMessageInFocus: (uiState) => uiState.lastMessageInFocus,
  },
});

export const { openSidebar, closeSidebar, setChatVisible, setLastMessageInFocus } = uiSlice.actions;

export const { selectIsSidebarOpen, selectChatVisible, selectLastMessageInFocus } = uiSlice.selectors;

export default uiSlice.reducer;
