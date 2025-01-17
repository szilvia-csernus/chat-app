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

type ChatPartner = {
  chatPartner: Member;
  chatId: string;
}

type RecentChat = {
  id: string;
  participant1: Member;
  participant2: Member;
  lastMessage: string;
  unreadMessages: number;
}