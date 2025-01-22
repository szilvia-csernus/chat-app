import { ChatPartner, CPData } from "@/types";
import { Conversation, Profile } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";

export const calculateAge = (dateString: string) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

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

export function mapCPDataToChatPartnerType(currentProfile: Profile | null, chatPartnersData: CPData[] | null): ChatPartner[] {
  if (!currentProfile || !chatPartnersData) return [];

  return chatPartnersData.map(cp => {
    if (cp.profile1.id === currentProfile?.id) {
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