import { Conversation } from "@prisma/client";
import { ZodIssue } from "zod";

type ActionResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string | ZodIssue[] };

type ChatProfile = {
  id: string;
  user: {
    name: string | null;
    image: string | null;
  };
  lastActive: Date;
};

type Member = {
  id: string;
  name: string;
  image: string;
  lastActive: string;
}

type SerializedMessage = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  read: boolean;
};

type Chat = {
  id: string;
  participants: Member[];
  messages: SerializedMessage[];
}

type CPData = {
  profiles: ChatProfile[];
} & Conversation;

type ChatPartner = {
  chatPartner: Member;
  chatId: string;
}

type RCData = {
  profiles: ChatProfile[];
  messages: {
    content: string;
    createdAt: Date;
    senderId: string;
    read: boolean;
  }[];
  _count: { messages: number };
} & Conversation;


type RecentChat = {
  id: string;
  participants: Member[];
  lastMessage: string;
  unreadMessageCount: number;
}

type CDataMessage = {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string;
  read: boolean;
}

type CData = {
  profiles: ChatProfile[];
  messages: CDataMessage[];
} & Conversation;

