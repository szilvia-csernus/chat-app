import { Conversation, Profile } from "@prisma/client";
import { ZodIssue } from "zod";

type ActionResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string | ZodIssue[] };

type CurrentProfileData = {
  id: string;
  user: {
    name: string | null;
    image: string | null;
  } | null;
  lastActive: Date;
  deleted: boolean;
  lastActiveConversationId?: string | null;
};

type ProfileData = {
  id: string;
  user: {
    name: string | null;
    image: string | null;
  } | null;
  conversations: { id: string }[];
  lastActive: Date;
  deleted: boolean;
};

type Member = {
  id: string;
  name: string;
  image: string | null;
  lastActive: string;
  deleted: boolean;
  chatting?: string | null;
  online: boolean;
};

type Members = {
  [key: string]: Member;
};

type CurrentMember = {
  id: string;
  name: string;
  image: string | null;
  lastActive: string;
  deleted: boolean;
  online: boolean;
  lastActiveConversationId?: string | null;
};

type RawChatData = {
  profiles: {
    id: string;
  }[];
  messages: MessageData[];
  _count: { messages: number };
} & Conversation;

type ChatData = {
  id: string;
  chatPartnerId: string;
  messageIds: string[];
  inactive: boolean;
  unreadMessageCount: number;
};

type ChatsData = {
  [key: string]: ChatData;
};

type MessageData = {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string | null;
  read: boolean;
  deleted: boolean;
};

type SerializedMessage = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string | null;
  read: boolean;
  deleted: boolean;
};

type SerializedMessages = {
  [key: string]: SerializedMessage;
};


// type CPData = {
//   profiles: ProfileData[];
// } & Conversation;

// type ChatPartner = {
//   chatPartner: Member;
//   chatId: string;
// };



// type RecentChat = {
//   id: string;
//   chatPartnerId: string;
//   lastMessage: string;
//   unreadMessageCount: number;
//   inactive: boolean;
// };



// type CData = {
//   profiles: {
//     id: string;
//   }[];
//   messages: MessageData[];
// } & Conversation;
