// Serialization of data is required by redux

import { ProfileData, Member, SerializedMessage, CurrentMember, CurrentProfileData, MessageData } from "@/types";
import { formatShortTime, timeAgoWithSuffix } from "./utils";

export function serializeDate(date: Date) {
  return timeAgoWithSuffix(date); // format is changed from Date to string (in effect, also serialized)
}

export function serializeMessage(message: MessageData): SerializedMessage {
  return {
    id: message.id,
    content: message.content,
    date: serializeDate(message.createdAt),
    time: formatShortTime(message.createdAt),
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
    lastActive: timeAgoWithSuffix(profile.lastActive),
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
    lastActive: timeAgoWithSuffix(profile.lastActive),
    deleted: profile.deleted,
    online: false,
    lastActiveConversationId: profile.lastActiveConversationId || null,
  };
}
