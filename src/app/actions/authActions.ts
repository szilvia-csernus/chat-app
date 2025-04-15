"use server";

import { auth, signOut } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import { deleteImageFromCloudinary } from "./photoActions";
import { pusherServer } from "@/lib/pusher";
import { revalidateTag } from "next/cache";
import { getMemberIdsServerFn } from "./memberActions";

/** Authentication function that returns null if
 * user is authenticated, otherwise redirects to login */
export async function authWithRedirect() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return redirect("/login");
    }
    return null;
  } catch {
    return redirect("/login");
  }
}

/** Authentication function that returns null if
 * user is authenticated, otherwise throws an error */
export async function authWithError() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }
    return null;
  } catch {
    throw new Error("User not authenticated");
  }
}

/** Authentication function that returns true if
 * user is authenticated, otherwise return false */
export async function isAuthenticated() {
  const session = await auth();
  if (session?.user?.id) {
    return true;
  }
  return false;
}

/** Fetches the authenticated user's id */
export async function getCurrentUserId() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }
    return session?.user?.id;
  } catch {
    return null;
  }
}

/** Fetches the authenticated user's User data */
export async function getCurrentUser() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }
    return prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
    });
  } catch {
    return null;
  }
}

/** Signs out user */
export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}

/** Delete User */
export async function deleteUser(id: string) {
  try {
    // Find the user's id
    const user = await prisma.user.findFirst({
      where: { profile: { id } },
    });
    if (!user) {
      throw new Error("User not found");
    }
    // Find the user's profile
    const profile = await prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    console.log("Profile found: ", profile);

    const profileId = profile.id;

    const messagesToUpdate = await prisma.message.findMany({
      where: { senderId: profileId },
      select: { id: true }, // Only fetch the IDs
    });

    const messageIds = messagesToUpdate.map((message) => message.id);

    // Mark user's messages as deleted
    await prisma.message.updateMany({
      where: { senderId: profileId },
      data: { content: "Deleted message", deleted: true },
    });

    console.log("Messages marked as deleted", messageIds);

    // Delete user's already inactive conversations
    await prisma.conversation.deleteMany({
      where: { profiles: { some: { id: profileId } }, inactive: true },
    });

    console.log("Inactive conversations deleted");

    // Mark rest of conversations inactive
    await prisma.conversation.updateMany({
      where: { profiles: { some: { id: profileId } } },
      data: { inactive: true },
    });

    console.log("Conversations marked as inactive");

    // Select these inactivated chats and chat partners
    const inactiveConversations = await prisma.conversation.findMany({
      where: {
        inactive: true,
      },
      include: {
        profiles: {
          where: {
            NOT: {
              id: profileId,
            },
          },
          select: {
            id: true,
          },
        },
      },
    });

    // Trigger chat partners' browsers to update inactivated chats and deleted user profile
    inactiveConversations.forEach(async (chat) => {
      const chatPartnerId = chat.profiles[0].id;
      pusherServer.trigger(`private-${chatPartnerId}`, "chat-inactive", {
        chatId: chat.id,
        messageIds: messageIds,
      });
    });

    // Find the user's photo
    const userPhoto = await prisma.photo.findFirst({
      where: { userId: user.id },
    });

    console.log("User photo found: ", userPhoto);

    if (userPhoto) {
      // Delete the photo from Cloudinary
      await deleteImageFromCloudinary(userPhoto.cloudinaryImageId);
    }

    console.log("User photo deleted");

    // Delete the user account
    await prisma.user.delete({
      where: { id: user.id },
    });

    console.log("User deleted");

    // This should not be executed here as we'll need the profile ID to sign out the user in the client
    // side to clear the session!!
    // // Delete profile record if they have no conversations
    // await prisma.profile.delete({
    //   where: {
    //     id: profileId,
    //     conversations: {
    //       every: {
    //         inactive: true,
    //       }
    //     }
    //   },
    // });

    // Delete profile records and mark profile as deleted
    await prisma.profile.update({
      where: { id: profileId },
      data: {
        country: "",
        gender: "",
        deleted: true,
      },
    });
    console.log("Profile data deleted");

    const members = await getMemberIdsServerFn();

    if (members) {
      for (const member of members) {
        if (member.id === profileId) {
          continue;
        }
        // Trigger chat partners' browsers to update inactivated chats and deleted user profile
        pusherServer.trigger(`private-${member.id}`, "delete-member", {
          memberId: profileId,
        });
      }
    }

    // Trigger private channel to remove user from members list
    pusherServer.trigger(`private-${profileId}`, "delete-member", {
      memberId: profileId,
    });

    // Trigger presence channel to remove user from online list
    pusherServer.trigger("presence-chat-app", "remove_member", profileId);

    revalidateTag("all-members");
    revalidateTag("all-memberIds");
    revalidateTag("user-photo");

    return profileId;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting user");
  }
}
