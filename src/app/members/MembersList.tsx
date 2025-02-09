import MemberCard from "./MemberCard";
import { Member } from "@/types";


type MembersListProps = {
  members: Member[] | null;
  currentMember: Member;
};

export default function MembersList({
  members,
  currentMember,
}: MembersListProps) {
  
  console.log("Executing MemberList on the server")

  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8 text-primary">
      {members &&
        members.map((member) => {
          return (
            <MemberCard
              key={member.id}
              member={member}
              currentMember={currentMember}
            />
          )
        })}
    </div>
  )
}
