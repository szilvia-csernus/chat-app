"use server";

import { prisma } from "@/prisma";
import { authWithError } from "./authActions";
import { getCurrentProfile, getCurrentProfileId } from "./profileActions";
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
  ["all-memberIds"],
  { tags: ["all-memberIds"] }
);

/** Fetches all the members data, inc. conversation id for
 * the current user. */
const getMembersServerFn = nextCache(
  async () => {
    try {
      const profiles = await prisma.profile.findMany({
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          conversations: {
            select: {
              id: true,
              profiles: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      return profiles;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  ["all-members"],
  { tags: ["all-members"] }
);

/** Returns all the members data from the server cache, inc. 
 * conversation id for the current user. */
export async function getMembers() {
  try {
    const currentProfileId = await getCurrentProfileId();
    if (!currentProfileId) return null;

    // Fetch all profiles using the cached server function
    const profiles = await getMembersServerFn();

    if (!profiles) return null;

    // Filter conversations for the current user
    const profilesWithFilteredConversations = profiles.map((profile) => {
      const filteredConversations = profile.conversations.filter(
        (conversation) =>
          conversation.profiles.some((p) => p.id === currentProfileId)
      );

      return {
        ...profile,
        conversations: filteredConversations,
      };
    });

    return profilesWithFilteredConversations;
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

/** Triggers update-member function for all members */
export async function triggerMemberUpdateForAllMembers({
  memberData,
}: {
  memberData: Partial<Member>;
}) {
  const members = await getMembersServerFn();
  if (!members) return null;

  const currentMember = await getCurrentProfile();
  if (!currentMember) return null;

  const activeMembers = members.filter((member) => !member.deleted);
  if (activeMembers.length === 0) return null;
  const memberIds = activeMembers.map((member) => member.id);

  const updatedMember = {
    ...currentMember,
    ...memberData,
  };

  memberIds.forEach((memberId) => {
    pusherServer.trigger(`private-${memberId}`, "update-member", {
      member: updatedMember,
    });
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
