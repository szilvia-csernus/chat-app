import { Member, Members } from "@/types";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { getMembers } from "@/app/actions/memberActions";
import { updateProfileLastActive } from "@/app/actions/profileActions";
import { mapProfilesDataToMembers } from "@/lib/maps";

type MembersState = {
  members: Members;
};

const initialState: MembersState = {
  members: {} as Members,
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
      });
    },
    addMember(state, action: PayloadAction<Member>) {
      state.members[action.payload.id] = { ...action.payload };
    },
    updateMemberWithLastActiveTime(
      state,
      action: PayloadAction<{ id: string; lastActive: string }>
    ) {
      state.members[action.payload.id] = {
        ...state.members[action.payload.id],
        lastActive: action.payload.lastActive,
      };
    },
    updateMemberWithDeletedStatus(state, action: PayloadAction<string>) {
      state.members[action.payload] = {
        ...state.members[action.payload],
        deleted: true,
        name: "",
        image: "",
        lastActive: new Date().toISOString(),
      };
    },
    updateChatting(
      state,
      action: PayloadAction<{ memberId: string; chatId: string }>
    ) {
      state.members[action.payload.memberId] = {
        ...state.members[action.payload.memberId],
        chatting: action.payload.chatId,
      };
    },
    setMembersOnlineStatus(
      state,
      action: PayloadAction<{ memberIds: string[] }>
    ) {
      action.payload.memberIds.forEach((id) => {
        state.members[id] = {
          ...state.members[id],
          online: true,
        };
      });
    },
    updateOnlineStatus(
      state,
      action: PayloadAction<{ memberId: string; online: boolean }>
    ) {
      state.members[action.payload.memberId] = {
        ...state.members[action.payload.memberId],
        online: action.payload.online,
      };
    },
  },
  selectors: {
    selectMembers: (membersState) => membersState.members,
    selectMemberById: (membersState, id: string | null): Member | null => {
      const member = id && membersState.members[id];
      return member || null;
    },
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
  updateChatting,
  setMembersOnlineStatus,
  updateOnlineStatus,
} = membersSlice.actions;

export const { selectMembers, selectMemberById, selectMemberOnlineStatus } =
  membersSlice.selectors;

// Memoized selectors (created with createSelector)

export const selectMemberIds = createSelector([selectMembers], (members) =>
  Object.keys(members)
);

// export const selectExistingMembers = createSelector(
//   [selectMembers, selectMemberIds],
//   (members, memberIds) => {
//     const existingMembers = {} as Members;
//     memberIds.forEach((id) => {
//           if (!members[id].deleted) {
//             existingMembers[id] = members[id];
//           }
//         });
//     return existingMembers;
// });

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

// Thunks

export function fetchAllMembers(): AppThunk {
  return async (dispatch, getState) => {
    const state = getState();
    const currentMember = state.currentMember.currentMember;
    console.log(
      "membersSlice: Current member in fetchAllMembers",
      !!currentMember
    );
    const membersData = (await getMembers()) || null;
    const members = membersData && mapProfilesDataToMembers(membersData);

    console.log("membersSlice: Members in fetchAllMembers", members);
    if (currentMember && members) {
      dispatch(setMembers(members));
    }
  };
}

export function updateMemberLastActive(id: string): AppThunk {
  return async (dispatch) => {
    const lastActive = new Date().toISOString();
    dispatch(updateMemberWithLastActiveTime({ id, lastActive }));
    await updateProfileLastActive(id);
  };
}

export default membersSlice.reducer;
