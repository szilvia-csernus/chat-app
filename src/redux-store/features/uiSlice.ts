import { createSlice } from "@reduxjs/toolkit";


type UiState = {
  isSidebarOpen: boolean;
};

const initialState: UiState = {
  isSidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openSidebar(state) {
      state.isSidebarOpen = true;
    },
    closeSidebar(state) {
      state.isSidebarOpen = false;
    },
  },
  selectors: {
    selectIsSidebarOpen: (uiState) =>
      uiState.isSidebarOpen
  },
});

export const { openSidebar, closeSidebar } =
  uiSlice.actions;

export const { selectIsSidebarOpen } =
  uiSlice.selectors;


export default uiSlice.reducer;
