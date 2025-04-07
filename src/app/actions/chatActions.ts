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
            createdAt: "desc", // Order messages within each conversation by createdAt
          },
          take: 20, // Only fetch the most recent messages
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
      orderBy: {
        updatedAt: "desc", // Order conversations by the most recent update
      },
    });

    // Reverse the messages array for each conversation to return them in ascending order
    const conversationsWithReversedMessages = conversations.map(
      (conversation) => ({
        ...conversation,
        messages: conversation.messages.reverse(),
      })
    );

    return conversationsWithReversedMessages;
  } catch (error) {
    throw error;
  }
}

/** Updates the Last chat Id */
export async function updateLastChatId(chatId: string) {
  const currentProfileId = await getCurrentProfileId();
  if (!currentProfileId) return null;

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
    if (!currentProfileId) return redirect("/profile/complete-profile");

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
      chatPartnerId: currentProfileId,
      msgGroupsData: { msgGroups: {}, msgGroupChronList: [] },
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

  const currentProfileId = await getCurrentProfileId();
  if (!currentProfileId) return null;

  try {
    return prisma.message.count({
      where: {
        conversationId: chatId,
        senderId: {
          not: currentProfileId,
        },
        read: false,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function loadNewMessagesAndUnreadCount(
  chatId: string,
  cursor: string | null
) {
  if (!cursor) return null;

  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  const currentProfileId = await getCurrentProfileId();
  if (!currentProfileId) return null;

  try {
    const chat = await prisma.conversation.findUnique({
      where: {
        id: chatId,
      },
      include: {
        profiles: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: {
                  not: currentProfileId,
                },
                read: false,
              },
            },
          },
        },
      },
    });

    // If the chat doesn't exist or the current user is not a participant
    if (!chat || !chat.profiles.some((p) => p.id === currentProfileId)) {
      return null;
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId: chatId,
        createdAt: {
          gt: new Date(cursor), // Fetch messages created after the cursor
        },
      },
      orderBy: {
        createdAt: "asc", // Fetch the most recent messages first
      },
      take: 20, // Fetch the most recent messages
    });

    return { messages, unreadCount: chat._count.messages };
  } catch (error) {
    console.error("Error refreshing chat:", error);
    return null;
  }
}

// export async function getAllUnreadMessageCount() {
//   await authWithError();

//   const currentProfileId = await getCurrentProfileId();
//   if (!currentProfileId) return null;

//   try {
//     const conversationsData = await prisma.conversation.findMany({
//       where: {
//         profiles: {
//           some: {
//             id: currentProfileId}
//         }
//       }
//     })
//     const chatIds = conversationsData.map((chat) => chat.id);
//     return prisma.message.count({
//       where: {
//         conversationId: {
//           in: chatIds,
//         },
//         senderId: {
//           not: currentProfileId,
//         },
//         read: false,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }
