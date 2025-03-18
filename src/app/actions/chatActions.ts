"use server";

import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import { authWithError, getCurrentUser, getCurrentUserId } from "./authActions";
import { getCurrentProfile, getCurrentProfileId } from "./profileActions";
import { pusherServer } from "@/lib/pusher";


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
          where: {
            id: {
              not: profileId,
            },
          },
          select: {
            id: true,
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

    return conversations
    ;
  } catch (error) {
    throw error;
  }
}

/** Fetches chat data */
export async function getChat(chatId: string) {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  try {
    const currentProfileId = await getCurrentProfileId();
    if (!currentProfileId) return redirect("/profile/complete-profile");

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
    if (!chat || !chat.profiles.some((p) => p.id === currentProfileId)) {
      return null;
    }

    // Update the last active chat id for the current user
    await prisma.profile.update({
      where: {
        id: currentProfileId,
      },
      data: {
        lastActiveConversationId: chatId,
      },
    });

    // Fetch the chat data
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: chatId,
      },
      include: {
        profiles: {
          where: {
            id: {
              not: currentProfileId,
            },
          },
          select: {
            id: true,
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
        _count: {
          select: {
            messages: {
              where: {
                AND: {
                  senderId: {
                    not: currentProfileId,
                  },
                  read: false,
                },
              },
            },
          },
        },
      },
    });

    return conversation;
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
    const currentUser = await getCurrentUser();
    if (!currentUser) return redirect("/login");
    
    const currentProfileId = await getCurrentProfileId();
    if (!currentProfileId)
      return redirect("/profile/complete-profile");

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
      },
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
              in: [currentProfileId, memberId],
            },
          },
        },
      },
    });

    if (existingChat) {
      return existingChat;
    }

    console.log(
      "Server: Creating new chat with profiles:",
      currentProfileId,
      chatPartner.id
    );

    const newChat = await prisma.conversation.create({
      data: {
        profiles: {
          connect: [{ id: currentProfileId }, { id: chatPartner.id }],
        },
      },
    });

    // Notify the other member of the new chat
    const newChatData = {
      id: newChat.id,
      chatPartnerId: chatPartner.id,
      msgGroupData: { msgGroups: {}, msgGroupChronList: [] },
      inactive: false,
      unreadMessageCount: 0,
    };

    await pusherServer.trigger(`private-${memberId}`, "new-chat", {
      newChat: newChatData,
      chatPartnerId: currentProfileId,
    });

    return newChatData;
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
