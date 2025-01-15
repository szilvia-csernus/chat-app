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
    return prisma.user.findMany({
      where: {
        NOT: {
          id: session.user.id,
        },
      },
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

