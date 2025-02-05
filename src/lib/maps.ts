import { ChatPartner, CPData, RCData, RecentChat, Chat, CData } from "@/types";
import { Message } from "@prisma/client";
import { serializeDate } from "@/lib/serialize";

export function mapMessageToSerializedMessage(message: Message) {
  return {
    id: message.id,
    content: message.content,
    createdAt: serializeDate(message.createdAt),
    senderId: message.senderId,
    read: message.read,
  };
}

export function mapCPDataToChatPartnerType(
  currentProfileId: string | null,
  chatPartnersData: CPData[] | null
): ChatPartner[] {
  if (!currentProfileId || !chatPartnersData) return [];

  return chatPartnersData.map((cp) => {
    if (cp.profile1.id === currentProfileId) {
      return {
        chatId: cp.id,
        chatPartner: {
          id: cp.profile2.id,
          name: cp.profile2.user.name || "",
          image: cp.profile2.user.image || "",
        },
      };
    } else {
      return {
        chatId: cp.id,
        chatPartner: {
          id: cp.profile1.id,
          name: cp.profile1.user.name || "",
          image: cp.profile1.user.image || "",
        },
      };
    }
  });
}

export function mapRCDataToRecentChatsType(
  rcData: RCData[] | null
): RecentChat[] {
  if (!rcData) return [];

  return rcData.map((chat) => {
    return {
      id: chat.id,
      participant1: {
        id: chat.profile1.id,
        name: chat.profile1.user.name || "",
        image: chat.profile1.user.image || "",
      },
      participant2: {
        id: chat.profile2.id,
        name: chat.profile2.user.name || "",
        image: chat.profile2.user.image || "",
      },
      lastMessage: chat.messages[0]?.content || "",
      unreadMessageCount: chat._count.messages,
    };
  });
}

export function mapChatDataToChatType(chatData: CData | null): Chat | null {
  if (!chatData) return null;

  return {
    id: chatData.id,
    participant1: {
      id: chatData.profile1Id,
      name: chatData.profile1.user.name || "",
      image: chatData.profile1.user.image || "",
    },
    participant2: {
      id: chatData.profile2Id,
      name: chatData.profile2.user.name || "",
      image: chatData.profile2.user.image || "",
    },
    messages: chatData.messages.map((message) => ({
      ...message,
      createdAt: serializeDate(message.createdAt),
    })),
  };
}
