import { Conversation } from "@prisma/client";
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
  msgGroupsData: MsgGroupsData;
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
  time: string;
  senderId: string | null;
  read: boolean;
  deleted: boolean;
  createdAt: string;
};

type SerializedMessages = {
  [key: string]: SerializedMessage;
};

// MsgGroup ids (dates) are in chronological order in msgGroupChronList
type MsgGroupsData = {
  msgGroups: MsgGroups;
  msgGroupChronList: string[];
}

// Messages are grouped by date
type MsgGroups = {
  [date: string]: MsgClustersData;
};

// MsgCluster ids are in chronological order in clusterIds
type MsgClustersData = {
  msgClusters: MsgClusters;
  clusterIdsChronList: string[];
}

type MsgClusters = {
  [key: string]: MsgCluster;
};

// Inside message groups, messages are clustered by senderId
// the cluster's id is the first message's id that was added to the cluster
// which is not necessarily the first message in the cluster
type MsgCluster = {
  id: string;
  senderId: string;
  msgIds: string[];
};