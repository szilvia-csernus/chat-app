"use client";

import { Card, CardFooter } from "@nextui-org/card";
import { User } from "@prisma/client";
import Link from "next/link";
import MemberImage from "./MemberImage";
import PresenceDot from "@/components/PresenceDot";

export type MemberCardProps = {
  member: User;
  online: boolean;
};

export default function MemberCard({ member, online }: MemberCardProps) {

  return (
    <>
      <Card fullWidth as={Link} href={`/members/${member.id}`}>
        <MemberImage member={member} />
        

        {online && (
          <div className="absolute top-2 left-3 z-20">
            <PresenceDot outlineColor="white"/>
          </div>
        )}

        <CardFooter className="flex justify-start bg-dark-gradient overflow-hidden absolute bottom-0 z-10">
          <div className="flex flex-col text-white">
            <span className="">{member.name}</span>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
