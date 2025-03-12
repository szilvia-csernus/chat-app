"use server";

import { messageSchema, MessageSchema } from "@/lib/schemas/messageSchema";
import { ActionResult } from "@/types";
import { getCurrentProfileId } from "./profileActions";
import { prisma } from "@/prisma";
import { Message } from "@prisma/client";
import { pusherServer } from "@/lib/pusher";
import { authWithError } from "./authActions";
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
      return { status: "error", error: "Chat is inactive" };
    }

    // If the current user is not part of the conversation
    if (!chat.profiles.some((p) => p.id === profileId)) {
      return {
        status: "error",
        error: "You are not authorized to send messages to this chat",
      };
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: profileId,
        conversationId: chatId,
      },
    });

    const serializedMessage = serializeMessage(message)

    await pusherServer.trigger(`private-chat-${chatId}`, "new-message", {
      chatId: chatId,
      message: serializedMessage,
      date: message.createdAt.toISOString().split("T")[0],
    });

    return { status: "success", data: message };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/** Updates all messages with a read:true status in a given
 * chat for a given recipient. */
export const updateMessagesWithReadStatus = async (
  chatId: string
) => {
  await authWithError();

  // Find the message IDs first so we don't have to fetch them twice
  const messages = await prisma.message.findMany({
    where: { conversationId: chatId, deleted: false, read: false },
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
    await pusherServer.trigger(`private-chat-${chatId}`, "message-read", {messageId});
  }
};

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

    if (!currentProfileId || !message || message.senderId === currentProfileId) {
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
      {messageId}
    );
  } catch (error) {
    console.error(error);
    return null
  }
}

