"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Session } from "next-auth";
import { unstable_cache as nextCache } from "next/cache";
import { redirect } from "next/navigation";


export async function getMembersFn(session: Session) {
  if (!session?.user?.email) {
    return null;
  }

  try {
    return prisma.profile.findMany({
      where: {
        NOT: {
          userId: session.user.id,
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

const cachedGetMembers = nextCache(
  async (session: Session) => {
    return await getMembersFn(session);
  },
  ["members"],
  { tags: ["members"] }
);

export async function getMembers() {
  const session = await auth(); // Access dynamic data outside the cached function
  if (!session) {
    redirect("/login");
  }
  return await cachedGetMembers(session);
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
