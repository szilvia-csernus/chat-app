"use server";

import { prisma } from "@/prisma";
import { ActionResult } from "@/types";
import {
  CompleteProfileSchema,
  photoSchema,
  profileSchema,
} from "@/lib/schemas/completeProfileSchema";
import { revalidateTag } from "next/cache";
import {
  editProfileSchema,
  EditProfileSchema,
} from "@/lib/schemas/editProfileSchema";
import { getCurrentUserId } from "./authActions";

export async function updateProfileLastActive(profileId: string) {
  return prisma.profile.update({
    where: {
      id: profileId,
    },
    data: {
      lastActive: new Date(),
    },

  });
}

/** Returns the authenticated user's profile Id */
export async function getCurrentProfileId() {
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
    return profile.id;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/** Returns the authenticated user's profile */
export async function getCurrentProfile() {
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
    return profile;
  } catch (error) {
    console.log(error)
    return null
  }
}

/** Completes the user's profile */
export async function completeProfile(
  data: CompleteProfileSchema
): Promise<ActionResult<string>> {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) return { status: "error", error: "User not found" };

  try {
    // Safe parse and validate data with Zod
    const validated = profileSchema.and(photoSchema).safeParse(data);
    if (!validated.success) {
      return { status: "error", error: "Invalid data" };
    }

    const user = await prisma.user.update({
      where: { id: currentUserId },
      data: {
        profileComplete: true,
        name: data.name,
        image: data.imageUrl,
        profile: {
          upsert: {
            create: {
              country: data.country,
              gender: data.gender,
              dateOfBirth: new Date(data.dateOfBirth),
              lastActive: new Date(),
            },
            update: {
              country: data.country,
              gender: data.gender,
              dateOfBirth: new Date(data.dateOfBirth),
              lastActive: new Date(),
            },
          },
        },
        photo: {
          upsert: {
            create: {
              imageUrl: data.imageUrl,
              cloudinaryImageId: data.cloudinaryImageId,
            },
            update: {
              imageUrl: data.imageUrl,
              cloudinaryImageId: data.cloudinaryImageId,
            },
          },
        },
      },
      include: {
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    revalidateTag("user");
    revalidateTag("user-profile");
    revalidateTag("user-photo");
    revalidateTag("members");

    return { status: "success", data: user.accounts[0].provider };
  } catch (error) {
    console.error(error);
    return { status: "error", error: "An unknown error occured" };
  }
}

/** Edits the user's profile details */
export async function editProfileDetails(
  data: EditProfileSchema
): Promise<ActionResult<string>> {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) return { status: "error", error: "User not found" };

  try {
    // Safe parse and validate data with Zod
    const validated = editProfileSchema.safeParse(data);
    if (!validated.success) {
      return { status: "error", error: "Invalid data" };
    }

    const user = await prisma.user.update({
      where: { id: currentUserId },
      data: {
        name: data.name,
        profile: {
          update: {
            country: data.country,
            lastActive: new Date(),
          },
        },
      },
    });

    revalidateTag("user");
    revalidateTag("user-photo");
    revalidateTag("members");

    return { status: "success", data: "Profile updated successfully." };
  } catch (error) {
    console.error(error);
    return { status: "error", error: "An unknown error occured" };
  }
}
