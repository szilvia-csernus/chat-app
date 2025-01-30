"use server";

import { auth, signOut } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";


/** Authentication function that returns null if
 * user is authenticated, otherwise redirects to login */
export async function authWithRedirect() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return redirect("/login");
    }
    return null;
  } catch (error) {
    redirect("/login");
}
}

/** Authentication function that returns null if
 * user is authenticated, otherwise throws an error */
export async function authWithError() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }
    return null;
  } catch (error) {
    throw new Error("User not authenticated");
  }
}

/** Fetches the authenticated user's id */
export async function getCurrentUserId() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null
    }
    return session?.user?.id;
  } catch (error) {
    return null
  }
}

/** Fetches the authenticated user's User data */
export async function getCurrentUser() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null
    }
    return prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
    })
  } catch (error) {
    return null
  }
}

/** Signs out user */
export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
