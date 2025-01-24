"use server";

import { prisma } from "@/prisma";
import { ActionResult } from "@/types";
import { auth } from "@/auth";
import {
  CompleteProfileSchema,
  photoSchema,
  profileSchema,
} from "@/lib/schemas/completeProfileSchema";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import {
  editProfileSchema,
  EditProfileSchema,
} from "@/lib/schemas/editProfileSchema";


/** Finds Profile in the Profile table by userId
 * @param userId - string
 * @returns Profile
 */
export async function getProfileByUserIdFn(userId: string) {
  return prisma.profile.findUnique({
    where: { userId },
  });
}

export const getProfileByUserId = nextCache(
  async (userId) => await getProfileByUserIdFn(userId),
  ["user-profile"],
  { tags: ["user-profile"] }
);

export async function getCurrentProfileId() {
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
    return profile.id;
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function completeProfile(
  data: CompleteProfileSchema
): Promise<ActionResult<string>> {
  let session = await auth();

  if (!session?.user) return { status: "error", error: "User not found" };

  try {
    // Safe parse and validate data with Zod
    const validated = profileSchema.and(photoSchema).safeParse(data);
    if (!validated.success) {
      return { status: "error", error: "Invalid data" };
    }

    const userId = session.user.id as string;

    const user = await prisma.user.update({
      where: { id: userId },
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
            },
            update: {
              country: data.country,
              gender: data.gender,
              dateOfBirth: new Date(data.dateOfBirth),
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

export async function editProfileDetails(
  data: EditProfileSchema
): Promise<ActionResult<string>> {
  let session = await auth();

  if (!session?.user) return { status: "error", error: "User not found" };

  try {
    // Safe parse and validate data with Zod
    const validated = editProfileSchema.safeParse(data);
    if (!validated.success) {
      return { status: "error", error: "Invalid data" };
    }
    const userId = session.user.id as string;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        profile: {
          update: {
            country: data.country,
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
