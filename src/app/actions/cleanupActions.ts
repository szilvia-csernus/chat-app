import { prisma } from "@/prisma";

// This function is not currently in use. It supposed to be part of a 
// scheduled task that runs periodically to clean up ghost profiles
// and conversations. Ghost profiles are profiles that are deleted
// and have no active conversations. Conversations are deleted if
// both participants are deleted.
export async function cleanupGhostProfilesAndConversations() {
  try {
    // Find conversations where both participants are deleted
    const conversations = await prisma.conversation.findMany({
      where: {
        profiles: {
          every: {
            deleted: true,
          },
        },
      },
      include: {
        profiles: true,
      },
    });

    // Delete these conversations
    const conversationIds = conversations.map(
      (conversation) => conversation.id
    );
    await prisma.conversation.deleteMany({
      where: {
        id: {
          in: conversationIds,
        },
      },
    });

    // Find ghost profiles (profiles that are deleted and have no active conversations)
    const ghostProfiles = await prisma.profile.findMany({
      where: {
        deleted: true,
        conversations: {
          none: {},
        },
      },
    });

    // Delete these ghost profiles
    const profileIds = ghostProfiles.map((profile) => profile.id);
    await prisma.profile.deleteMany({
      where: {
        id: {
          in: profileIds,
        },
      },
    });

    console.log(
      `Deleted ${conversationIds.length} conversations and ${profileIds.length} ghost profiles.`
    );
  } catch (error) {
    console.error("Error cleaning up ghost profiles and conversations:", error);
  }
}
