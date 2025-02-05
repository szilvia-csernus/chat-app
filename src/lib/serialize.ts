// Serialization of data is required by redux

import { SerializedMessage } from "@/types";
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
    senderId: message.senderId,
    read: message.read,
  };
}
