import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";
import { CurrentMember, ProfileData, RawChatData } from "@/types";
import { setCurrentMember } from "./features/currentMemberSlice";
import { mapProfilesDataToMembers, mapRawChatDataListToChatsAndMessages, mapRawChatDataToChatAndMessages } from "@/lib/maps";
import { setMembers } from "./features/membersSlice";
import { setChats, setCurrentChat } from "./features/chatsSlice";
import { setMessages } from "./features/messagesSlice";

// Typed store functions
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

type PopulateStore = {
  currentMember: CurrentMember | null;
  membersData: ProfileData[] | null;
  recentChats: RawChatData[] | null;
  currentChat: RawChatData | null;
};

export const usePopulateStore = ({
  currentMember,
  membersData,
  recentChats,
  currentChat,
}: PopulateStore) => {
  const dispatch = useAppDispatch();


    if (!currentMember) return;

    dispatch(setCurrentMember(currentMember));

    const members = membersData && mapProfilesDataToMembers(membersData);
    if (members) {
      dispatch(setMembers(members));
    }

    if (!recentChats || !currentChat) return;

    const { chats, messages } =
      mapRawChatDataListToChatsAndMessages(recentChats);

    dispatch(setChats(chats));
    dispatch(setMessages(messages));

    const result = mapRawChatDataToChatAndMessages(currentChat);
    if (result) {
      const { chat, messages } = result;
      dispatch(setCurrentChat(chat));
      dispatch(setMessages(messages));
    }

};
