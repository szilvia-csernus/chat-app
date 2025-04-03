"use server";

import { messageSchema, MessageSchema } from "@/lib/schemas/messageSchema";
import { ActionResult } from "@/types";
import { getCurrentProfileId } from "./profileActions";
import { prisma } from "@/prisma";
import { Message } from "@prisma/client";
import { pusherServer } from "@/lib/pusher";
import { authWithError, getCurrentUserId } from "./authActions";
import { serializeMessage } from "@/lib/serialize";

/** Creates a message in the given chat. */
export async function createMessage(
  chatId: string,
  data: MessageSchema
): Promise<ActionResult<Message>> {
  await authWithError();

  try {
    const profileId = await getCurrentProfileId();
    if (!profileId) {
      return { status: "error", error: "Profile not found" };
    }
    const validated = messageSchema.safeParse(data);

    if (!validated.success) {
      return { status: "error", error: validated.error.errors };
    }

    const { content } = validated.data;

    const chat = await prisma.conversation.findUnique({
      where: {
        id: chatId,
      },
      select: {
        inactive: true,
        profiles: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!chat) {
      return { status: "error", error: "Chat not found" };
    }

    if (chat.inactive) {
      return {
        status: "error",
        error:
          "Chat is inactive. Your chat partner may have deleted their account.",
      };
    }

    // If the current user is not part of the conversation
    if (!chat.profiles.some((p) => p.id === profileId)) {
      return {
        status: "error",
        error: `${profileId} is not authorized to send messages to this chat`,
      };
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: profileId,
        conversationId: chatId,
      },
    });

    const serializedMessage = serializeMessage(message);

    await pusherServer.trigger(`private-chat-${chatId}`, "new-message", {
      chatId: chatId,
      message: serializedMessage,
    });

    return { status: "success", data: message };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/** Updates all messages with a read:true status in a given
 * chat as if the current member has read them. */
export async function updateMessagesWithReadStatus(chatId: string) {
  await authWithError();

  const currentProfileId = await getCurrentProfileId();

  // Find the message IDs first so we don't have to fetch them twice
  const messages = await prisma.message.findMany({
    where: {
      conversationId: chatId,
      senderId: { not: currentProfileId },
      deleted: false,
      read: false,
    },
    select: { id: true },
  });

  const messageIds = messages.map((message) => message.id);

  // Update the messages to set read status
  await prisma.message.updateMany({
    where: { id: { in: messageIds }, deleted: false },
    data: { read: true },
  });

  // Trigger Pusher events for each message
  for (const messageId of messageIds) {
    await pusherServer.trigger(`private-chat-${chatId}`, "message-read", {
      messageId,
    });
  }
}

/** Updates a message with a read:true status. */
export async function updateReadStatus(messageId: string) {
  await authWithError();

  try {
    const currentProfileId = await getCurrentProfileId();
    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
        deleted: false,
      },
    });

    if (
      !currentProfileId ||
      !message ||
      message.senderId === currentProfileId
    ) {
      return null;
    }

    await prisma.message.update({
      where: {
        id: messageId,
        deleted: false,
      },
      data: {
        read: true,
      },
    });

    await pusherServer.trigger(
      `private-chat-${message.conversationId}`,
      "message-read",
      { messageId }
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getMoreOldMessages(chatId: string, cursor?: string) {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  const currentProfileId = await getCurrentProfileId();
  if (!currentProfileId) return null;

  try {
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

    const messages = await prisma.message.findMany({
      where: {
        conversationId: chatId,
      },
      orderBy: {
        createdAt: "desc", // Fetch the most recent messages first
      },
      take: 10, // Limit the number of messages
      ...(cursor && {
        cursor: {
          id: cursor, // Use the cursor to fetch messages before this ID
        },
        skip: 1, // Skip the cursor itself
      }),
    });

    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}
