import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PresenceState = {
  membersOnline: string[];
};

const initialState: PresenceState = {
  membersOnline: [],
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    addMember(state, action: PayloadAction<string>) {
      state.membersOnline.push(action.payload);
    },
    removeMember(state, action: PayloadAction<string>) {
      state.membersOnline = state.membersOnline.filter(
        (id) => id !== action.payload
      );
    },
    setPresentMembers(state, action: PayloadAction<string[]>) {
      state.membersOnline = action.payload;
    },
  },
  selectors: {
    selectMembersOnline: (PresenceState) => PresenceState.membersOnline,
  },
});

export const { addMember, removeMember, setPresentMembers } = presenceSlice.actions;
export const { selectMembersOnline } = presenceSlice.selectors;

export const selectMemberOnlineStatus =
  (memberId: string) => (state: { presence: PresenceState }) =>
    state.presence.membersOnline.includes(memberId);

export default presenceSlice.reducer;
