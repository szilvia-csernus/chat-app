import {
  ChatData,
  ProfileData,
  Member,
  Members,
  SerializedMessage,
  RawChatData,
  CurrentMember,
  CurrentProfileData,
  SerializedMessages,
} from "@/types";
import {
  serializeDate,
  serializeCurrentProfileDataToCurrentMember,
  serializeProfileDataToMember,
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

// function mapCPDataToChatPartnerType(
//   currentProfileId: string,
//   chatData: CPData
// ): ChatPartner | null {
//   const profile = chatData.profiles.filter((p) => p.id !== currentProfileId)[0];
//   if (!profile) return null;
//   return {
//     chatPartner: mapProfileDataToMemberType(profile),
//     chatId: chatData.id,
//   };
// }

// export function mapCPDataListToChatPartnerList(
//   currentProfileId: string | null,
//   chatPartnersData: CPData[] | null
// ): ChatPartner[] {
//   if (!currentProfileId || !chatPartnersData) return [];

//   const chatPartnersList = chatPartnersData.map((cp) =>
//     mapCPDataToChatPartnerType(currentProfileId, cp)
//   );

//   return chatPartnersList.filter((cp) => cp !== null);
// }

// function mapRCDataToRecentChatsType(rcData: RCData): RecentChat {
//   return {
//     id: rcData.id,
//     chatPartnerId: rcData.profiles[0].id,
//     lastMessage: rcData.messages[0]?.content || "",
//     unreadMessageCount: rcData._count.messages,
//     inactive: rcData.inactive,
//   };
// }

// function mapRCDataToChatData(rcData: RCData): ChatData {
//   let messageList: { [key: string]: SerializedMessage } = {};
//   let messageIds: string[] = [];
//   rcData.messages.forEach((message) => {
//     (messageList[message.id] = {
//       ...message,
//       createdAt: serializeDate(message.createdAt),
//     }),
//       messageIds.push(message.id);
//   });
//   return {
//     id: rcData.id,
//     chatPartnerId: rcData.profiles[0].id,
//     messages: messageList,
//     messageIds,
//     inactive: rcData.inactive,
//     unreadMessageCount: rcData._count.messages,
//   }
// };

// export function mapRCDataListToRecentChatsList(
//   rcData: RCData[] | null
// ): RecentChat[] {
//   if (!rcData) return [];

//   return rcData.map((chat) => mapRCDataToRecentChatsType(chat));
// }

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

  let messages: SerializedMessage[] = [];
  let messageIds: string[] = [];
  rawChatData.messages.map((message) => {
    messages.push({
        ...message,
        createdAt: serializeDate(message.createdAt),
    });
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
