"use server";

import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import { authWithError, getCurrentUserId } from "./authActions";
import { getCurrentProfile, getCurrentProfileId } from "./profileActions";

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

    return prisma.conversation.findMany({
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
      name: chatPartnerProfile.user.name || "",
      image: chatPartnerProfile.user.image || "",
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

    return prisma.conversation.findMany({
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
            content: true,
            createdAt: true,
            senderId: true,
            read: true,
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
  } catch (error) {
    throw error;
  }
}

/** Fetches chat data */
export async function getChat(chatId: string) {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

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

    return prisma.conversation.findUnique({
      where: {
        id: chatId,
      },
      include: {
        profiles: {
          select: {
            id: true,
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
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
}

/** Fetches current member's last chatId */
export async function getLastChatId() {
  const currentProfile = await getCurrentProfile();
  if (!currentProfile) return null;

  return currentProfile.lastActiveConversationId;
}

/** Creates a chat between current user and another member */
export async function createChat(memberId: string) {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) return redirect("/login");

    const currentProfileId = await getCurrentProfileId();
    if (!currentProfileId) {
      return redirect("/profile/complete-profile");
    }

    const chatPartner = await prisma.profile.findUnique({
      where: {
        id: memberId,
      },
    });
    if (!chatPartner) {
      return null;
    }
    return prisma.conversation.create({
      data: {
        profiles: {
          connect: [{ id: currentProfileId }, { id: chatPartner.id }],
        },
      },
    });
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
