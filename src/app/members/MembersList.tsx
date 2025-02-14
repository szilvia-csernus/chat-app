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
  console.log("Executing MemberList on the server");

  return (
    <div className="flex-grow h-full overflow-scroll scrollbar-hide scroll-smooth p-5 border-1 border-slate-300 dark:border-slate-500 bg-zig-zag grid grid-cols-2 min-[500px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8 text-primary">
      {members &&
        members.map((member) => {
          return (
            <MemberCard
              key={member.id}
              member={member}
              currentMember={currentMember}
            />
          );
        })}
    </div>
  );
}
