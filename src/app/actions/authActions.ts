"use server";

import { prisma } from "@/prisma";
import { auth, signOut } from "@/auth";

import { unstable_cache as nextCache } from "next/cache";


/** Fetches the authenticated user's id */
export async function getCurrentUserId() {
  const session = await auth();
  return session?.user?.id;
}

/** Finds User in the User table by id
 * @param id - string
 * @returns User
 */
export async function getUserByIdFn(id: string) {
  if (!id) {
    throw new Error("User ID is undefined");
  }
  return prisma.user.findUnique({
    where: { id },
  });
}

export const getUserById = nextCache(
  async (data) => await getUserByIdFn(data),
  ["user"],
  { tags: ["user"] }
);

/** Finds User in the User table by unique email
 * @param email - string
 * @returns User
 */
export async function getUserByEmail(email: string) {
  if (!email) {
    throw new Error("User ID is undefined");
  }
  return prisma.user.findUnique({
    where: { email },
  });
}

/** Signs out user
 * @returns void
 */
export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
