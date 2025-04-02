// Serialization of data is required by redux

import { ProfileData, Member, SerializedMessage, CurrentMember, CurrentProfileData, MessageData } from "@/types";
import { formatShortTime } from "./utils";


export function serializeMessage(message: MessageData): SerializedMessage {
  return {
    id: message.id,
    content: message.content,
    time: formatShortTime(message.createdAt),
    senderId: message.senderId || null,
    read: message.read,
    deleted: message.deleted,
    createdAt: message.createdAt.toISOString(),
  };
}

export function serializeMessages(messages: MessageData[]): SerializedMessage[] {
  return messages.map((message) => serializeMessage(message));
}

export function serializeProfileDataToMember(profile: ProfileData): Member {
  return {
    id: profile.id,
    name: profile.user?.name || "",
    image: profile.user?.image || null,
    lastActive: (profile.lastActive).toISOString(),
    deleted: profile.deleted,
    chatting:
      profile.conversations.length > 0 ? profile.conversations[0].id : null,
    online: false,
  };
}

export function serializeCurrentProfileDataToCurrentMember(profile: CurrentProfileData): CurrentMember {
  return {
    id: profile.id,
    name: profile.user?.name || "",
    image: profile.user?.image || null,
    lastActive: (profile.lastActive).toISOString(),
    deleted: profile.deleted,
    online: false,
    lastActiveConversationId: profile.lastActiveConversationId || null,
  };
}
