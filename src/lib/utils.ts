import { ChatPartner, CPData, RCData, RecentChat, Chat, CData } from "@/types";
import { format, formatDistanceToNow } from "date-fns";
import { FieldValues, UseFormSetError, Path } from "react-hook-form";
import { ZodIssue } from "zod";


export function handleFormServerErrors<TFieldValues extends FieldValues>(
  errorResponse: { error: string | ZodIssue[] },
  setError: UseFormSetError<TFieldValues>
) {
  // Handle server errors by Zod
  if (Array.isArray(errorResponse.error)) {
    errorResponse.error.forEach((e) => {
      const fieldName = e.path.join(".") as Path<TFieldValues>;
      setError(fieldName, { message: e.message });
    });
  } else {
    setError("root.serverError", { message: errorResponse.error });
  }
}

export const calculateAge = (dateString: string) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

export function formatShortDateTime(date: Date) {
  return format(date, "dd MMM yy h:mm:a");
}

export function timeAgo(date: string) {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    return date;
  }
}

export function mapCPDataToChatPartnerType(
  currentProfileId: string | null,
  chatPartnersData: CPData[] | null
): ChatPartner[] {
  if (!currentProfileId || !chatPartnersData) return [];

  return chatPartnersData.map((cp) => {
    if (cp.profile1.id === currentProfileId) {
      return {
        chatId: cp.id,
        chatPartner: {
          id: cp.profile2.id,
          name: cp.profile2.user.name || "",
          image: cp.profile2.user.image || "",
        },
      };
    } else {
      return {
        chatId: cp.id,
        chatPartner: {
          id: cp.profile1.id,
          name: cp.profile1.user.name || "",
          image: cp.profile1.user.image || "",
        },
      };
    }
  });
}

export function mapRCDataToRecentChatsType(
  rcData: RCData[] | null
): RecentChat[] {
  if (!rcData) return [];

  return rcData.map((chat) => {
    return {
      id: chat.id,
      participant1: {
        id: chat.profile1.id,
        name: chat.profile1.user.name || "",
        image: chat.profile1.user.image || "",
      },
      participant2: {
        id: chat.profile2.id,
        name: chat.profile2.user.name || "",
        image: chat.profile2.user.image || "",
      },
      lastMessage: chat.messages[0]?.content || "",
      unreadMessageCount: chat._count.messages,
    };
  });
}

export function mapChatDataToChatType(
  chatData: CData | null
): Chat | null {
  if (!chatData) return null;

  return {
    id: chatData.id,
    participant1: {
      id: chatData.profile1Id,
      name: chatData.profile1.user.name || "",
      image: chatData.profile1.user.image || "",
    },
    participant2: {
      id: chatData.profile2Id,
      name: chatData.profile2.user.name || "",
      image: chatData.profile2.user.image || "",
    },
    messages: chatData.messages,
  };
}
