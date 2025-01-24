"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { getCurrentUserId } from "./authActions";


export async function getMembers() {
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
    throw error;
  }
}

export async function getMemberById(id: string) {
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

export async function getCurrentMember() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  try{
    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
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