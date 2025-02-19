"use server";

import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import { authWithError, getCurrentUserId } from "./authActions";
import { getCurrentProfile, getCurrentProfileId } from "./profileActions";
import { formatShortDateTime } from "@/lib/utils";
import { mapChatDataToChatType, mapCPDataListToChatPartnerList, mapRCDataListToRecentChatsList } from "@/lib/maps";
import { pusherServer } from "@/lib/pusher";

/** Fetches the list of ChatPartners for the Members page,
 * in order to decide if current user has ever chatted with
 * the given member. */
export async function getChatPartners() {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  try {
    const profileId = await getCurrentProfileId();

    if (!profileId) {
      return null;
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        profiles: {
          some: {
            id: profileId,
          },
        },
      },
      include: {
        profiles: {
          select: {
            id: true,
            lastActive: true,
            deleted: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return mapCPDataListToChatPartnerList(
        profileId,
        conversations
      );

  } catch (error) {
    throw error;
  }
}

/** Fetches current user's chat partner for a given chat */
export async function getChatPartner(chatId: string) {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  try {
    const currentProfileId = await getCurrentProfileId();

    if (!currentProfileId) {
      return null;
    }

    const chat = await prisma.conversation.findFirst({
      where: {
        id: chatId,
      },
      select: {
        profiles: {
          where: {
            id: {
              not: currentProfileId,
            },
          },
          select: {
            id: true,
            lastActive: true,
            deleted: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const chatPartner = chat?.profiles.find((p) => p.id !== currentProfileId) || null;
    if (!chatPartner) {
      return null;
    }

    const chatPartnerProfile = await prisma.profile.findUnique({
      where: {
        id: chatPartner.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!chatPartnerProfile) {
      return null;
    }

    return {
      id: chatPartner.id,
      name: chatPartnerProfile.user?.name || "",
      image: chatPartnerProfile.user?.image || null,
      lastActive: formatShortDateTime(chatPartnerProfile.lastActive),
      deleted: chatPartnerProfile.deleted,
    }
  } catch (error) {
    throw error;
  }
}

/** Fetches the list of recent chats for the "Your Chats" sidebar. */
export async function getRecentChats() {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  try {
    const profileId = await getCurrentProfileId();

    if (!profileId) {
      return null;
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        profiles: {
          some: {
            id: profileId,
          },
        },
      },
      include: {
        profiles: {
          select: {
            id: true,
            lastActive: true,
            deleted: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        messages: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            read: true,
            deleted: true
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                AND: {
                  senderId: {
                    not: profileId,
                  },
                  read: false,
                },
              },
            },
          },
        },
      },
    });

    return mapRCDataListToRecentChatsList(conversations)

  } catch (error) {
    throw error;
  }
}

/** Fetches chat data */
export async function getChat(chatId: string) {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  // for testin loading state
  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    const profileId = await getCurrentProfileId();

    if (!profileId) {
      return redirect("/profile/complete-profile");
    }

    const chat = await prisma.conversation.findUnique({
      where: {
        id: chatId,
      },
      select: {
        profiles: {
          select: {
            id: true,
          },
        },
      },
    });

    // If the chat doesn't exist or the current user is not a participant
    if (!chat || !chat.profiles.some((p) => p.id === profileId)) {
      return null;
    }

    await prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        lastActiveConversationId: chatId,
      },
    })

    const conversations = await prisma.conversation.findUnique({
      where: {
        id: chatId,
      },
      include: {
        profiles: {
          select: {
            id: true,
            lastActive: true,
            deleted: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        messages: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            read: true,
            deleted: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return mapChatDataToChatType(conversations)

  } catch (error) {
    throw error;
  }
}

/** Fetches current member's last chatId */
export async function getLastChatId() {
  const currentProfile = await getCurrentProfile();
  if (!currentProfile) return null;

  if (currentProfile.lastActiveConversationId) {
    return currentProfile.lastActiveConversationId;
  }

  const firstChat = await prisma.conversation.findFirst({
    where: {
      profiles: {
        some: {
          id: currentProfile.id,
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (firstChat) {
    return firstChat.id;
  }

  return null;
}

/** Creates a chat between current user and another member */
export async function createChat(memberId: string) {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) return redirect("/login");

    const currentProfile = await getCurrentProfile();
    if (!currentProfile) {
      return redirect("/profile/complete-profile");
    }

    const chatPartner = await prisma.profile.findUnique({
      where: {
        id: memberId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      }
    });

    if (!chatPartner || chatPartner.deleted) {
      return null;
    }

    // Check if a chat already exists between the two members
    const existingChat = await prisma.conversation.findFirst({
      where: {
        profiles: {
          every: {
            id: {
              in: [currentProfile.id, memberId],
            },
          },
        },
      },
    });

    if (existingChat) {
      return existingChat;
    }

    console.log(
      "Creating new chat with profiles:",
      currentProfile.id,
      chatPartner.id
    );

    const newChat = await prisma.conversation.create({
      data: {
        profiles: {
          connect: [{ id: currentProfile.id }, { id: chatPartner.id }],
        },
      },
    });

    // Notify the other member of the new chat
    const newRecentChat = {
      id: newChat.id,
      participants: [
        {
          id: currentProfile.id,
          name: currentProfile.user?.name || "",
          image: currentProfile.user?.image || null,
          lastActive: new Date(),
          deleted: false,
        },
        {
          id: chatPartner.id,
          name: chatPartner.user?.name || "",
          image: chatPartner.user?.image || null,
          lastActive: chatPartner.lastActive,
          deleted: chatPartner.deleted,
        },
      ],
      lastMessage: "",
      unreadMessageCount: 0,
      inactive: false,
    };

    await pusherServer.trigger(`private-${memberId}`, "new-chat", newRecentChat);

    return newChat;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

/** Fetches the number of unread messages in a chat */
export async function getUnreadMessageCount(chatId: string) {
  await authWithError();

  try {
    return prisma.message.count({
      where: {
        conversationId: chatId,
        read: false,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
