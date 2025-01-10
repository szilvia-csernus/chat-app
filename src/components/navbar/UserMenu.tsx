'use client';

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Avatar } from "@nextui-org/avatar";
import Link from "next/link";
import { signOutUser } from "@/app/actions/authActions";
import { User } from "@prisma/client";

type UserMenuProps = {
  user: User;
  photoUrl: string;
};

export default function UserMenu({ user, photoUrl }: UserMenuProps) {

  return (
    <Dropdown placement="bottom-end" className="shadow-sm shadow-foreground">
      <DropdownTrigger>
        <Avatar
          className="transition-transform cursor-pointer"
          size="md"
          radius="full"
          src={photoUrl}
        />
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        aria-label="User actions menu"
        className="text-foreground"
      >
        <DropdownSection>
          <DropdownItem
            showDivider
            isReadOnly
            as="span"
            className="h-14 flex flex-row"
            aria-label="username"
          >
            Signed in as {user.name}
          </DropdownItem>
          <DropdownItem color="secondary" as={Link} href="/profile">
            Profile
          </DropdownItem>
          <DropdownItem color="secondary" onClick={async () => signOutUser()}>
            Sign Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
