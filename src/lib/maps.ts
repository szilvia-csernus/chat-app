import {
  ChatData,
  ProfileData,
  Member,
  SerializedMessage,
  RawChatData,
  CurrentMember,
  CurrentProfileData,
  GroupedMessageIds,
} from "@/types";
import {
  serializeCurrentProfileDataToCurrentMember,
  serializeProfileDataToMember,
  serializeMessage,
} from "@/lib/serialize";

function mapProfileDataToMember(profile: ProfileData): Member {
  return serializeProfileDataToMember(profile);
}

export function mapProfilesDataToMembers(profiles: ProfileData[]): Member[] {
  return profiles.map((profile) => mapProfileDataToMember(profile));
}

export function mapProfileDataToCurrentMember(
  profile: CurrentProfileData
): CurrentMember {
  return serializeCurrentProfileDataToCurrentMember(profile);
}

export function mapRawChatDataListToChatsAndMessages(
  rcData: RawChatData[] | null
): { chats: ChatData[]; messages: SerializedMessage[] } {
  if (!rcData) return { chats: [], messages: [] };

  const chats: ChatData[] = [];
  const messages: SerializedMessage[] = [];
  rcData.forEach((rc) => {
    const result = mapRawChatDataToChatAndMessages(rc);
    if (result && result.chat && result.messages) {
      chats.push(result.chat);
      messages.push(...result.messages);
    }
  });

  return { chats, messages };
}

export function mapRawChatDataToChatAndMessages(
  rawChatData: RawChatData | null
): { chat: ChatData; messages: SerializedMessage[] } | null {
  if (!rawChatData) return null;

  // const messageIds: string[] = [];
  const messages: SerializedMessage[] = [];
  const msgGroupChronList: string[] = [];
  const msgGroups: GroupedMessageIds = {};
  let currentDate: string = rawChatData.messages[0].createdAt
    .toISOString()
    .split("T")[0];
  msgGroupChronList.push(currentDate);
  msgGroups[currentDate] = [];

  rawChatData.messages.map((message) => {
    messages.push(serializeMessage(message));
    // messageIds.push(message.id);
    const messageDate = message.createdAt.toISOString().split("T")[0];

    if (messageDate === currentDate) {
        msgGroups[messageDate].push(message.id);
      } else {
        msgGroups[messageDate] = [message.id];
         msgGroupChronList.push(messageDate);
         currentDate = messageDate;
      }
  });

  const chat = {
    id: rawChatData.id,
    chatPartnerId: rawChatData.profiles[0].id,
    msgGroups,
    msgGroupChronList,
    inactive: rawChatData.inactive,
    unreadMessageCount: rawChatData._count.messages,
  };

  return { chat, messages };
}
