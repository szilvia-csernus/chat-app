import { CurrentMember } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type CurrentMemberState = {
  currentMember: CurrentMember | null;
};

const initialState: CurrentMemberState = {
 currentMember: null,
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
    }
  },
  selectors: {
    selectCurrentMember: (currentMemberState) => currentMemberState.currentMember,
    selectCurrentMemberId: (currentMemberState) => currentMemberState.currentMember?.id
  },
});

export const { setCurrentMember, resetCurrentMember } = currentMemberSlice.actions;

export const { selectCurrentMember, selectCurrentMemberId } = currentMemberSlice.selectors;


export default currentMemberSlice.reducer;
