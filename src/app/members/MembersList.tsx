'use client';

import MemberCard from "./MemberCard";
import usePresenceStore from "@/hooks/usePresenceStore";
import { User } from "@prisma/client";

type MembersListProps = {
  members: User[] | null;
};

export default function MembersList({members}: MembersListProps) {

  const membersOnline = usePresenceStore(state => state.membersOnline);
  console.log(membersOnline);

  return (
    <>
      {members &&
        members.map((member) => {
          const online = membersOnline.includes(member.id);
          return (
            <MemberCard
              key={member.id}
              member={member}
              online={online}
            />
          );
        })}
    </>
  );
}
