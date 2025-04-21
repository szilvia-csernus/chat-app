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
import { getCurrentUser, getCurrentUserId } from "./authActions";
import {
  getMemberIdsServerFn,
  triggerMemberUpdateForAllMembers,
  triggerUpdateAboutNewMember,
} from "./memberActions";
import dayjs from "dayjs";


// This action is triggered by the Pusher webhook, when the
// user goes inactive. (Presence channel member_removed event)
// Authentications happens in the webhook api (api/pusher-webhook).
/** Updates the last active time of the user in the database. */
export async function updateProfileLastActive(profileId: string | null) {
  if (!profileId) return null;
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      console.log(`Profile with id ${profileId} not found`);
      return null;
    }

    const update = prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        lastActive: dayjs.utc().toDate(),
      },
    });

    revalidateTag(`member-last-active:${profileId}`);

    return update
    
  } catch (error) {
    console.error(error);
    return null;
  }
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
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    if (!profile) {
      return null;
    }
    return profile;
  } catch (error) {
    console.log(error);
    return null;
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
              dateOfBirth: dayjs.utc(data.dateOfBirth).toDate(),
              lastActive: dayjs.utc().toDate(),
            },
            update: {
              country: data.country,
              gender: data.gender,
              dateOfBirth: dayjs.utc(data.dateOfBirth).toDate(),
              lastActive: dayjs.utc().toDate(),
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
        profile: {
          select: {
            id: true,
            lastActive: true,
            deleted: true,
          },
        },
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    revalidateTag("user-photo");
    revalidateTag("all-memberIds");

    const memberIds = await getMemberIdsServerFn();
    const newMemberId = user.profile?.id;
    
    if (memberIds && newMemberId) {
      const newMember = {
        id: newMemberId,
        name: user.name || "",
        image: user.image,
        lastActive: (user.profile?.lastActive || new Date()).toISOString(),
        deleted: user.profile?.deleted || false,
        online: true,
      };
      memberIds.forEach(async (data: { id: string }) => {
        if (data.id !== newMemberId) {
          console.log(
            "profileActions: Triggering update for member after new signup",
            data.id,
            user.profile?.id
          );
          await triggerUpdateAboutNewMember({
            profileId: data.id,
            newMember: newMember,
          });
        }
      });
    }

    return { status: "success", data: user.profile?.id || "" };
  } catch (error) {
    console.error(error);
    return { status: "error", error: "An unknown error occured" };
  }
}

/** Edits the user's profile details */
export async function editProfileDetails(
  data: EditProfileSchema
): Promise<ActionResult<string>> {
  const currentUser = await getCurrentUser();

  if (!currentUser) return { status: "error", error: "User not found" };

  try {
    // Safe parse and validate data with Zod
    const validated = editProfileSchema.safeParse(data);
    if (!validated.success) {
      return { status: "error", error: "Invalid data" };
    }


    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: data.name,
        profile: {
          update: {
            country: data.country,
            lastActive: dayjs.utc().toDate(),
          },
        },
      },
    });

    revalidateTag("user");
    revalidateTag("user-photo");
    revalidateTag("all-members");

    if (currentUser.name !== data.name) {
      await triggerMemberUpdateForAllMembers({
        memberData: {
          name: data.name,
        },
      });
    }

    return { status: "success", data: "Profile updated successfully." };
  } catch (error) {
    console.error(error);
    return { status: "error", error: "An unknown error occured" };
  }
}
