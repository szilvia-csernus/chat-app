"use server";

import { auth, signOut } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import { deleteImageFromCloudinary } from "./photoActions";

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

    // Mark conversations inactive
    await prisma.conversation.updateMany({
      where: { profiles: { some: { id: profileId } } },
      data: { inactive: true },
    });

    console.log("Conversations marked as inactive");

    // Mark messages as deleted
    await prisma.message.updateMany({
      where: { senderId: profileId },
      data: { content: "Deleted message", deleted: true },
    });

    console.log("Messages marked as deleted");

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

    await signOutUser();

    console.log("User signed out");

    // Delete the user account
    await prisma.user.delete({
      where: { id: userId },
    });

    console.log("User deleted");

    // Delete profile records and mark profile as deleted
    await prisma.profile.update({
      where: { id: profileId },
      data: {
        country: "",
        gender: "",
        deleted: true,
      },
    });

    console.log("Profile deleted");
    
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting user");
  }
}
