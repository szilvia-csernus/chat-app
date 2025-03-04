// Serialization of data is required by redux

import { ProfileData, Member, SerializedMessage, CurrentMember, CurrentProfileData } from "@/types";
import { Message } from "@prisma/client";
import { formatShortDateTime } from "./utils";

export function serializeDate(date: Date) {
  return formatShortDateTime(date); // format is changed from Date to string (in effect, also serialized)
}

export function serializeMessage(message: Message): SerializedMessage {
  return {
    id: message.id,
    content: message.content,
    createdAt: serializeDate(message.createdAt),
    senderId: message.senderId || null,
    read: message.read,
    deleted: message.deleted,
  };
}

export function serializeProfileDataToMember(profile: ProfileData): Member {
  return {
    id: profile.id,
    name: profile.user?.name || "",
    image: profile.user?.image || null,
    lastActive: serializeDate(profile.lastActive),
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
    lastActive: serializeDate(profile.lastActive),
    deleted: profile.deleted,
    online: false,
    lastActiveConversationId: profile.lastActiveConversationId || null,
  };
}
