import { Conversation } from "@prisma/client";
import { ZodIssue } from "zod";

type ActionResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string | ZodIssue[] };

type Member = {
  id: string;
  name: string;
  image: string;
}

type Chat = {
  id: string;
  participant1: Member;
  participant2: Member;
  messages: Message[];
}

type CPData = {
  profile2: {
    id: string;
    user: {
      name: string | null;
      image: string | null;
    };
  };
  profile1: {
    id: string;
    user: {
      name: string | null;
      image: string | null;
    };
  };
} & Conversation;

type ChatPartner = {
  chatPartner: Member;
  chatId: string;
}

type RCData = {
    profile1: {
        id: string;
        user: {
            name: string | null;
            image: string | null;
        };
    };
    profile2: {
        id: string;
        user: {
            name: string | null;
            image: string | null;
        };
    };
    messages: {
        content: string;
        createdAt: Date;
        senderId: string;
    }[];
    _count: { messages: number};
} & Conversation;


type RecentChat = {
  id: string;
  participant1: Member;
  participant2: Member;
  lastMessage: string;
  unreadMessages: number;
}

// type MessageDto = {
//   id: string;
//   content: string;
//   createdAt: string;
//   read: boolean;
//   senderId?: string;
//   senderName?: string | null;
//   senderImage?: string | null;
//   recipientId?: string;
//   recipientName?: string | null;
//   recipientImage?: string | null;
// };