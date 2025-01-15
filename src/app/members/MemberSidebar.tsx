"use client";

import React from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Button, Divider } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@prisma/client";
import MemberImage from "./MemberImage";
import PresenceDot from "@/components/PresenceDot";
import usePresenceStore from "@/hooks/usePresenceStore";

export type MemberSidebarProps = {
  member: User;
  ownProfile?: boolean;
  liked?: boolean;
};

export default function MemberSidebar({ member, ownProfile, liked }: MemberSidebarProps) {
  const basePath = `/members/${member.id}`;
  const pathName = usePathname();
  const router = useRouter();
  const firstName = member.name?.split(" ")[0];

  const membersOnline = usePresenceStore((state) => state.membersOnline);

  const navLinks = [];

  if (ownProfile) {
    navLinks.push({ name: "Your Profile", href: `${basePath}` });
  } else {
    navLinks.push({ name: "Profile", href: `${basePath}` });
    navLinks.push({ name: `Chat with ${firstName}`, href: `${basePath}/chat` });
    navLinks.push({ name: `${firstName}'s Classes`, href: `${basePath}/classes` });
  }
  

  return (
    <Card className="w-full items-center h-[80vh] p-1 ">
      <MemberImage
        member={member}
        height={150}
        width={150}
        className="rounded-full mt-6 aspect-square object-cover border-accent border-2"
      />

      <CardBody className="flex flex-col h-full items-center text-primary">
        <div className="text-2xl font-bold mt-4 flex flex-row gap-2">
          <span>{member.name}</span>
          {!ownProfile && (

              <div className="relative">
                {membersOnline.includes(member.id) && (
                  <PresenceDot outlineColor="slate-500" />
                )}
              </div>

          )}
        </div>

        <Divider className="my-3 bg-accent" />
        <nav className="flex flex-col p-4 text-xl gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`block rounded text-lg ${
                pathName === link.href
                  ? "text-secondary"
                  : "hover:text-secondary/50"
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </CardBody>

      <CardFooter className="h-full flex flex-col justify-end mb-2">
        <Button
          onClick={() => router.back()}
          color="secondary"
          variant="bordered"
          className="w-full"
        >
          Go back
        </Button>
      </CardFooter>
    </Card>
  );
}
