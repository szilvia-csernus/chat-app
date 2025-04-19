// Serialization of data is required by redux

import {
  ProfileData,
  Member,
  SerializedMessage,
  CurrentMember,
  CurrentProfileData,
  MessageData,
} from "@/types";
import { formatShortDateTime, formatShortTime } from "./utils";

export function serializeMessage(message: MessageData): SerializedMessage {
  return {
    id: message.id,
    content: message.content,
    time: formatShortTime(message.createdAt),
    senderId: message.senderId || null,
    read: message.read,
    deleted: message.deleted,
    createdAt: formatShortDateTime(message.createdAt),
  };
}

export function serializeMessages(
  messages: MessageData[]
): SerializedMessage[] {
  return messages.map((message) => serializeMessage(message));
}

export function serializeProfileDataToMember(profile: ProfileData): Member {
  // This conversion is neccesary because after page-reloads, the members
  // data is either fetched from the server (where lasActive is a Date) or
  // from the redux store (where lastActive is a string).
  const lastActiveDate =
    typeof profile.lastActive === "string"
      ? profile.lastActive
      : new Date(profile.lastActive).toISOString();

  return {
    id: profile.id,
    name: profile.user?.name || "",
    image: profile.user?.image || null,
    lastActive: lastActiveDate,
    deleted: profile.deleted,
    chatting:
      profile.conversations.length > 0 ? profile.conversations[0].id : null,
    online: false,
  };
}

export function serializeCurrentProfileDataToCurrentMember(
  profile: CurrentProfileData
): CurrentMember {
  return {
    id: profile.id,
    name: profile.user?.name || "",
    image: profile.user?.image || null,
    lastActive: profile.lastActive.toISOString(),
    deleted: profile.deleted,
    online: false,
    lastActiveConversationId: profile.lastActiveConversationId || null,
  };
}
