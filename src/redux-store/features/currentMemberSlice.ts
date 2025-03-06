import { CurrentMember } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { getCurrentProfile } from "@/app/actions/profileActions";
import { mapProfileDataToCurrentMember } from "@/lib/maps";

type CurrentMemberState = {
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

export function fetchCurrentMember(): AppThunk {
    return async (dispatch, getState) => {
      const state = getState();
      const currentProfile = await getCurrentProfile();
      const currentMember = currentProfile && mapProfileDataToCurrentMember(currentProfile);
      console.log(
        "currentMemberSlice: Current member in fetchCurrentMember",
        !!currentMember
      );
      if (currentMember) {
        dispatch(setCurrentMember(currentMember));
      }
    };
  }

export default currentMemberSlice.reducer;
