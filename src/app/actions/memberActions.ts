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
  return prisma.profile.findUnique({
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
}


export async function getCurrentProfile() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return await prisma.profile.findUnique({
    where: {
      userId: session.user.id,
    },
  });
}
