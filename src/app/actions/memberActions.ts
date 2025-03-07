"use server";

import { prisma } from "@/prisma";
import { authWithError } from "./authActions";
import { getCurrentProfileId } from "./profileActions";
import { pusherServer } from "@/lib/pusher";
import { unstable_cache as nextCache } from "next/cache";
import { Member } from "@/types";

/** Fetches all the members IDs, to be used on server side only. */
export const getMemberIdsServerFn = nextCache(
  async () => {
    try {
      const profileIds = await prisma.profile.findMany({
        select: {
          id: true,
        },
      });
      return profileIds;

    } catch (error) {
      console.log(error);
      return null;
    }
  },
  ["all-members"],
  { tags: ["all-members"] }
);

/** Fetches all the members data, inc. conversation id for
 * the current user. */
export async function getMembers(){
    try {
      const currentProfileId = await getCurrentProfileId();
      if (!currentProfileId) return null;
      const profiles = await prisma.profile.findMany({
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          conversations: {
            where: {
              profiles: {
                some: {
                  id: currentProfileId,
                },
              },
            },
            select: {
              id: true,
            },
          },
        },
      });
      return profiles;

    } catch (error) {
      console.log(error);
      return null;
    }
  };

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
    return profile;

  } catch (error) {
    console.log(error);
    return null;
  }
}

/** Triggers new-member function in user's private channel, to be used after
 * a new member has signed up. */
export async function triggerUpdateAboutNewMember({
  profileId,
  newMember,
}: {
  profileId: string;
  newMember: Member;
}) {
  console.log("Triggering new-member update", profileId, newMember);
  pusherServer.trigger(`private-${profileId}`, "new-member", {
    newMember: newMember,
  });
}

// /** Triggers delete-member function in user's private channel, to be used after
//  * a member has been deleted. */
// export async function triggerUpdateAboutDeletedMember({
//   profileId,
//   deletedMemberId,
// }: {
//   profileId: string;
//   deletedMemberId: string;
// }) {
//   pusherServer.trigger(`private-${profileId}`, "delete-member", {
//     memberId: deletedMemberId,
//   });
// }
