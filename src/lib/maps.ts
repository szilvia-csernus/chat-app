import {
  ChatData,
  ProfileData,
  Member,
  SerializedMessage,
  RawChatData,
  CurrentMember,
  CurrentProfileData,
  MsgGroups,
  MsgClusters,
  MessageData,
  MsgClustersData,
  MsgGroupsData,
} from "@/types";
import {
  serializeCurrentProfileDataToCurrentMember,
  serializeProfileDataToMember,
  serializeMessage,
} from "@/lib/serialize";


function mapProfileDataToMember(profile: ProfileData): Member {
  return serializeProfileDataToMember(profile);
}

export function mapProfilesDataToMembers(profiles: ProfileData[]): Member[] {
  return profiles.map((profile) => mapProfileDataToMember(profile));
}

export function mapProfileDataToCurrentMember(
  profile: CurrentProfileData
): CurrentMember {
  return serializeCurrentProfileDataToCurrentMember(profile);
}

export function mapRawChatDataListToChatsAndMessages(
  rcData: RawChatData[] | null
): { chats: ChatData[]; messages: SerializedMessage[] } {
  if (!rcData) return { chats: [], messages: [] };

  const chats: ChatData[] = [];
  const messages: SerializedMessage[] = [];
  rcData.forEach((rc) => {
    const result = mapRawChatDataToChatAndMessages(rc);
    if (result && result.chat && result.messages) {
      chats.push(result.chat);
      messages.push(...result.messages);
    }
  });

  return { chats, messages };
}

function mapRawChatDataToChatAndMessages(
  rawChatData: RawChatData | null
): { chat: ChatData; messages: SerializedMessage[] } | null {
  if (!rawChatData) return null;

  const messages = rawChatData.messages.map((message) => serializeMessage(message));
  const msgGroupsData = groupMessagesByDate(rawChatData.messages);

  const chat = {
    id: rawChatData.id,
    chatPartnerId: rawChatData.profiles[0].id,
    msgGroupsData,
    inactive: rawChatData.inactive,
    unreadMessageCount: rawChatData._count.messages,
  };

  return { chat, messages };
}


function clusterMessagesBySender(messages: MessageData[]): MsgClustersData {
  const msgClusters: MsgClusters = {};
  const clusterIds: string[] = [];
  let currentSenderId: string = "";
  let currentClusterId: string = "";
  messages.forEach((message) => {
    if (message.senderId !== currentSenderId) {
      currentSenderId = message.senderId!;
      currentClusterId = message.id;
      msgClusters[currentClusterId] = {
        id: currentClusterId,
        senderId: currentSenderId,
        msgIds: [message.id],
      };
      clusterIds.push(currentClusterId);
    } else {
      msgClusters[currentClusterId].msgIds.push(message.id);
    }
  });

  return { msgClusters, clusterIdsChronList: clusterIds };
}

function groupMessagesByDate(mesages: MessageData[]): MsgGroupsData {
  if (mesages.length === 0) {
    return {
      msgGroups: {} as MsgGroups,
      msgGroupChronList: []
    };
  }
  let currentDate: string = mesages[0].createdAt.toISOString().split("T")[0];
  const msgGroups: MsgGroups = {};
  const msgGroupChronList: string[] = [];
  let startIndex: number = 0;
  let endIndex: number = 0;

  mesages.forEach((message, idx) => {
    const messageDate = message.createdAt.toISOString().split("T")[0];

    if (messageDate !== currentDate) {
      endIndex = idx;
      const msgClusterData = clusterMessagesBySender(
        mesages.slice(startIndex, endIndex)
      );
      msgGroups[currentDate] = msgClusterData
      msgGroupChronList.push(currentDate);

      startIndex = idx;
      currentDate = messageDate;
    }
  });

  // Add the last group
  const msgClusterData = clusterMessagesBySender(
    mesages.slice(startIndex)
  );
  msgGroups[currentDate] = msgClusterData;
  msgGroupChronList.push(currentDate);

  return { msgGroups, msgGroupChronList };
}
