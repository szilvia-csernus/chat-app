"use client";
import { useRef } from "react";
import { CurrentMember, ProfileData, RawChatData } from "@/types";
import { useAppDispatch} from "@/redux-store/hooks";
import { setCurrentMember } from "@/redux-store/features/currentMemberSlice";
import {
  mapProfilesDataToMembers,
  mapRawChatDataListToChatsAndMessages,
} from "@/lib/maps";
import { setMembers } from "@/redux-store/features/membersSlice";
import { setChats, setCurrentChatId } from "@/redux-store/features/chatsSlice";
import { setMessages } from "@/redux-store/features/messagesSlice";

type Props = {
  currentMember: CurrentMember | null;
  membersData: ProfileData[] | null;
  recentChats: RawChatData[] | null;
};

export default function InitialStore({
  currentMember,
  membersData,
  recentChats,
}: Props) {
  const initialized = useRef(false);

  // The dispatch functions below are not in a useEffect because
  // in useEffect they would be called on client-side only,
  // which would cause hydration errors.
  // This way, they are executed server-side first, 
  // then re-hydrated on the client.
  // This is a workaround to avoid hydration errors
  // when the user is already signed in when the app loads.

  const dispatch = useAppDispatch();

  if (initialized.current || !currentMember) return null;

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

  initialized.current = true;

  return null;
}
