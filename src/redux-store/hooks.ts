import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";
import { CurrentMember, ProfileData, RawChatData } from "@/types";
import { setCurrentMember } from "./features/currentMemberSlice";
import {
  mapProfilesDataToMembers,
  mapRawChatDataListToChatsAndMessages,
} from "@/lib/maps";
import { setMembers } from "./features/membersSlice";
import { setChats, setCurrentChatId } from "./features/chatsSlice";
import { setMessages } from "./features/messagesSlice";

// Typed store functions
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

type PopulateStore = {
  currentMember: CurrentMember | null;
  membersData: ProfileData[] | null;
  recentChats: RawChatData[] | null;
};

export const usePopulateStore = ({
  currentMember,
  membersData,
  recentChats,
}: PopulateStore) => {
  const dispatch = useAppDispatch();

  if (!currentMember) return;

  dispatch(setCurrentMember(currentMember));

  const members = membersData && mapProfilesDataToMembers(membersData);
  if (members) {
    dispatch(setMembers(members));
  }

  if (!recentChats) return;

  const { chats, messages } = mapRawChatDataListToChatsAndMessages(recentChats);

  dispatch(setChats(chats));
  dispatch(setMessages(messages));

  const lastChatId = currentMember.lastActiveConversationId;

  if (lastChatId) {
    dispatch(setCurrentChatId(lastChatId));
  }
};
