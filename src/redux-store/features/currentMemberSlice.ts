import { CurrentMember } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CurrentMemberState = {
  currentMember: CurrentMember | null;
  isActive: boolean;
};

const initialState: CurrentMemberState = {
  currentMember: null,
  isActive: true,
};

const currentMemberSlice = createSlice({
  name: "currentMember",
  initialState,
  reducers: {
    setCurrentMember(state, action: PayloadAction<CurrentMember | null>) {
      state.currentMember = action.payload;
    },
    resetCurrentMember(state) {
      state.currentMember = null;
    },
    setIsActive(state, action: PayloadAction<boolean>) {
      state.isActive = action.payload;
    },
  },
  selectors: {
    selectCurrentMember: (currentMemberState) =>
      currentMemberState.currentMember,
    selectCurrentMemberId: (currentMemberState) =>
      currentMemberState.currentMember?.id,
    selectIsActive: (currentMemberState) => currentMemberState.isActive,
  },
});

export const { setCurrentMember, resetCurrentMember, setIsActive } =
  currentMemberSlice.actions;

export const { selectCurrentMember, selectCurrentMemberId, selectIsActive } =
  currentMemberSlice.selectors;

export default currentMemberSlice.reducer;
