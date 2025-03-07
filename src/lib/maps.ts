import {
  ChatData,
  ProfileData,
  Member,
  SerializedMessage,
  RawChatData,
  CurrentMember,
  CurrentProfileData,
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
  rcData.forEach(rc => {
    const result = mapRawChatDataToChatAndMessages(rc);
    if (result && result.chat && result.messages) {
      chats.push(result.chat);
      messages.push(...result.messages);
    }
  })

  return { chats, messages };
}

export function mapRawChatDataToChatAndMessages(
  rawChatData: RawChatData | null
): { chat: ChatData; messages: SerializedMessage[] } | null {
  if (!rawChatData) return null;

  const messages: SerializedMessage[] = [];
  const messageIds: string[] = [];
  rawChatData.messages.map((message) => {
    messages.push(serializeMessage(message));
    messageIds.push(message.id);
  });

  const chat = {
    id: rawChatData.id,
    chatPartnerId: rawChatData.profiles[0].id,
    messageIds,
    inactive: rawChatData.inactive,
    unreadMessageCount: rawChatData._count.messages,
  };

  return { chat, messages };
}
