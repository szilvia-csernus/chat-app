"use server";

import { prisma } from "@/prisma";
import { getCurrentUserId, authWithError } from "./authActions";
import { getCurrentProfileId } from "./profileActions";


/** Fetches all the members data, inc. name and image except for 
 * the current user. */
export async function getMembers() {
  await authWithError();

  try {
    const currentProfileId = await getCurrentProfileId();
    if (!currentProfileId) return null;

    return prisma.profile.findMany({
      where: {
        NOT: {
          id: currentProfileId,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        },
      }
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}

/** Fetches a member's data by its id. */
export async function getMemberById(id: string) {
  await authWithError();

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        id,
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
    return {
      id: profile.id,
      name: profile.user.name || "",
      image: profile.user.image || "",
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

/** Fetches the current member's data. */
export async function getCurrentMember() {
    const currentProfileId = await getCurrentProfileId();
    if (!currentProfileId) return null;

  try{
    const profile = await prisma.profile.findUnique({
      where: {
        id: currentProfileId,
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
    return {
      id: profile.id,
      name: profile.user.name || '',
      image: profile.user.image || '',
    }
  } catch (error) {
    console.log(error)
    return null;
  }
}