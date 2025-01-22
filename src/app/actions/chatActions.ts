"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";

/** fetches the list of ChatPartners for the Members page,
 * in order to decide if current user has ever chatted with
 * the given member.
 * @returns CPData[]
 */
export async function getChatPartners() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
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

/** fetches the list of recent chats for the "Your Chats" sidebar.
 * @returns Conversation[]
 */
export async function getRecentChats() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
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
                read: false,
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

export async function getChat(chatId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
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
            content: true,
            createdAt: true,
            senderId: true,
            read: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function createChat(memberId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return redirect("/login");
    }
    const currentMember = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
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

