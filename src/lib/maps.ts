import { ChatPartner, CPData, RCData, RecentChat, Chat, CData, ChatProfile, Member } from "@/types";
import { serializeDate, serializeChatProfile } from "@/lib/serialize";


function mapChatProfileToMemberType(profile: ChatProfile): Member {
  return serializeChatProfile(profile)
}

function mapCPDataToChatPartnerType(currentProfileId: string, chatData: CPData): ChatPartner | null {

  const profile = chatData.profiles.filter(p => p.id !== currentProfileId)[0];
  if (!profile) return null;
  return {
    chatPartner: mapChatProfileToMemberType(profile),
    chatId: chatData.id,
  }
}

export function mapCPDataListToChatPartnerList(
  currentProfileId: string | null,
  chatPartnersData: CPData[] | null
): ChatPartner[] {
  if (!currentProfileId || !chatPartnersData) return [];

  const chatPartnersList = chatPartnersData.map((cp) =>
    mapCPDataToChatPartnerType(currentProfileId, cp)
  ); 

  return chatPartnersList.filter(cp => cp !== null);
  
}

function mapRCDataToRecentChatsType(rcData: RCData): RecentChat {
  return {
    id: rcData.id,
    participants: rcData.profiles.map(mapChatProfileToMemberType),
    lastMessage: rcData.messages[0]?.content || "",
    unreadMessageCount: rcData._count.messages,
  }
}

export function mapRCDataListToRecentChatsList(
  rcData: RCData[] | null
): RecentChat[] {
  if (!rcData) return []

  return rcData.map((chat) => mapRCDataToRecentChatsType(chat));
}

export function mapChatDataToChatType(chatData: CData | null): Chat | null {
  if (!chatData) return null;

  return {
    id: chatData.id,
    participants: chatData.profiles.map(mapChatProfileToMemberType),
    messages: chatData.messages.map((message) => ({
      ...message,
      createdAt: serializeDate(message.createdAt),
    })),
  };
}
