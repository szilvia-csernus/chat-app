import { createSlice } from "@reduxjs/toolkit";

type UiState = {
  isSidebarOpen: boolean;
  chatVisible: boolean;
};

const initialState: UiState = {
  isSidebarOpen: false,
  chatVisible: false,
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
  },
  selectors: {
    selectIsSidebarOpen: (uiState) => uiState.isSidebarOpen,
    selectChatVisible: (uiState) => uiState.chatVisible,
  },
});

export const { openSidebar, closeSidebar, setChatVisible } = uiSlice.actions;

export const { selectIsSidebarOpen, selectChatVisible } = uiSlice.selectors;

export default uiSlice.reducer;
