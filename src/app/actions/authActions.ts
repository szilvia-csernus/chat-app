"use server";

import { auth, signOut } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import { deleteImageFromCloudinary } from "./photoActions";
import { pusherServer } from "@/lib/pusher";
import { revalidateTag } from "next/cache";

/** Authentication function that returns null if
 * user is authenticated, otherwise redirects to login */
export async function authWithRedirect() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return redirect("/login");
    }
    return null;
  } catch (error) {
    redirect("/login");
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    return null;
  }
}

/** Signs out user */
export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}

/** Delete User */
export async function deleteUser(userId: string) {
  try {
    // Find the user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    console.log("Profile found: ", profile);

    const profileId = profile.id;

    // Mark user's messages as deleted
    const messages = await prisma.message.updateMany({
      where: { senderId: profileId },
      data: { content: "Deleted message", deleted: true },
    });

    const messageIds = Object.keys(messages);
    
    console.log("Messages marked as deleted", messageIds);


    // Delete already inactive conversations
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
      pusherServer.trigger(`private-${chatPartnerId}`, "chat-inactive",  {chatId: chat.id, messageIds: messageIds});
    });

    // Find the user's photo
    const userPhoto = await prisma.photo.findFirst({
      where: { userId },
    });

    console.log("User photo found: ", userPhoto);

    if (userPhoto) {
      // Delete the photo from Cloudinary
      await deleteImageFromCloudinary(userPhoto.cloudinaryImageId);
    }

    console.log("User photo deleted");

    // Delete the user account
    await prisma.user.delete({
      where: { id: userId },
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

    // Trigger presence channel to remove user from online list
    pusherServer.trigger("presence-chat-app", "remove_member",  profileId);

    revalidateTag("all-members");

    return profileId;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting user");
  }
}
