"use server";

import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import { authWithError, getCurrentUserId } from "./authActions";

/** Fetches the list of ChatPartners for the Members page,
 * in order to decide if current user has ever chatted with
 * the given member. */
export async function getChatPartners() {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: currentUserId,
      }
  });

    if (!profile) {
      return null;
    }

    return prisma.conversation.findMany({
      where: {
        OR: [
          {
            profile1Id: profile.id,
          },
          {
            profile2Id: profile.id,
          },
        ],
      },
      include: {
        profile1: {
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
        profile2: {
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

/** Fetches the list of recent chats for the "Your Chats" sidebar. */
export async function getRecentChats() {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: currentUserId,
      },
    });

    if (!profile) {
      return null;
    }

    return prisma.conversation.findMany({
      where: {
        OR: [
          {
            profile1Id: profile.id,
          },
          {
            profile2Id: profile.id,
          },
        ],
      },
      include: {
        profile1: {
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
        profile2: {
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
                    not: profile.id,
                  },
                  read: false,
                }
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

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: currentUserId,
      },
    });

    if (!profile) {
      return redirect("/complete-profile");
    }

    const chat = await prisma.conversation.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chat || (chat.profile1Id !== profile.id && chat.profile2Id !== profile.id)) {
      return null;
    }

    return prisma.conversation.findUnique({
      where: {
        id: chatId,
      },
      include: {
        profile1: {
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
        profile2: {
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

/** Creates a chat between current user and another member */
export async function createChat(memberId: string) {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) return redirect("/login");
    
    const currentMember = await prisma.profile.findUnique({
      where: {
        userId: currentUserId,
      },
    });
    if (!currentMember) {
      return redirect("/complete-profile");
    }

    const profile2 = await prisma.profile.findUnique({
      where: {
        id: memberId,
      },
    });
    if (!profile2) {
      return null;
    }
    return prisma.conversation.create({
      data: {
        profile1Id: currentMember.id,
        profile2Id: profile2.id,
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