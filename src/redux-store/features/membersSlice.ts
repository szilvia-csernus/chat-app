import { Member, Members } from "@/types";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MembersState = {
  members: Members;
  populated: boolean;
};

const initialState: MembersState = {
  members: {} as Members,
  populated: false,
};

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setMembers(state, action: PayloadAction<Member[]>) {
      action.payload.forEach((member) => {
        if (state.members[member.id]) {
          return;
        }
        state.members[member.id] = member;
        state.populated = true;
      });
    },
    addMember(state, action: PayloadAction<Member>) {
      state.members[action.payload.id] = { ...action.payload };
    },
    updateMemberWithLastActiveTime(
      state,
      action: PayloadAction<{ id: string; lastActive: string }>
    ) {
      if (state.members[action.payload.id]) {
        state.members[action.payload.id].lastActive = action.payload.lastActive;
      }
    },
    updateMemberWithDeletedStatus(state, action: PayloadAction<string>) {
      if (state.members[action.payload]) {
        state.members[action.payload] = {
          ...state.members[action.payload],
          deleted: true,
          name: "",
          image: "",
          lastActive: new Date().toISOString(),
        };
      }
    },
    updateMember(state, action: PayloadAction<Member>) {
      if (state.members[action.payload.id]) {
        state.members[action.payload.id] = {
          ...state.members[action.payload.id],
          ...action.payload,
        };
      }
    },
    updateChatting(
      state,
      action: PayloadAction<{ memberId: string; chatId: string }>
    ) {
      if (state.members[action.payload.memberId]) {
        state.members[action.payload.memberId].chatting = action.payload.chatId;
      }
    },
    setMembersOnlineStatus(
      state,
      action: PayloadAction<{ memberIds: string[] }>
    ) {
      action.payload.memberIds.forEach((id) => {
        if (state.members[id]) {
          state.members[id].online = true;
        }
      });
    },
    updateOnlineStatus(
      state,
      action: PayloadAction<{ memberId: string; online: boolean }>
    ) {
      if (state.members[action.payload.memberId]) {
        state.members[action.payload.memberId].online = action.payload.online;
      }
    },
  },
  selectors: {
    selectMembers: (membersState) => membersState.members,
    selectMembersPopulated: (membersState) => membersState.populated,
    selectMemberOnlineStatus: (membersState, id: string | null) =>
      id && membersState.members[id] && membersState.members[id].online
        ? membersState.members[id].online
        : false,
  },
});

export const {
  setMembers,
  addMember,
  updateMemberWithLastActiveTime,
  updateMemberWithDeletedStatus,
  updateMember,
  updateChatting,
  setMembersOnlineStatus,
  updateOnlineStatus,
} = membersSlice.actions;

export const { selectMembers, selectMembersPopulated, selectMemberOnlineStatus } =
  membersSlice.selectors;

  
// Memoized selectors (created with createSelector)

export const selectMemberIds = createSelector([selectMembers], (members) =>
  Object.keys(members)
);

export const selectMemberById = createSelector(
  (state: MembersState) => state.members,
  (state: MembersState, memberId: string | null) => memberId,
  (members, memberId) => memberId ? members[memberId] : null
);

export const selectExistingMemberIds = createSelector(
  [selectMembers], // cannot put selectMemberIds here because input selectors should not have a reference (array, object etc.) as a return value
  (members) => {
    const existingMemberIds = [] as string[];
    Object.keys(members).forEach((id) => {
      if (!members[id].deleted) {
        existingMemberIds.push(id);
      }
    });
    return existingMemberIds;
  }
);

export default membersSlice.reducer;
