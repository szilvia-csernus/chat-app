"use server";

import { prisma } from "@/prisma";
import { getCurrentUserId, authWithError } from "./authActions";


/** Fetches all the members data, inc. name and image except for 
 * the current user. */
export async function getMembers() {
  await authWithError();

  try {
    const currentUserId = await getCurrentUserId();

    return prisma.profile.findMany({
      where: {
        NOT: {
          userId: currentUserId,
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
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) return null;

  try{
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