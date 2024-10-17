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
import { Session } from "next-auth";
import Link from "next/link";
import { signOutUser } from "@/app/actions/authActions";

type UserMenuProps = {
  // this user type is from the session object
  user: Session["user"];
};

export default function UserMenu({ user }: UserMenuProps) {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          className="transition-transform"
          color="primary"
          size="sm"
          radius="full"
          src={user?.image || "/images/user.png"}
        />
      </DropdownTrigger>
      <DropdownMenu variant="flat" aria-label="User actions menu" className="text-gray-500">
        <DropdownSection>
          <DropdownItem
            showDivider
            isReadOnly
            as="span"
            className="h-14 flex flex-row"
            aria-label="username"
          >
            Signed in as {user?.name}
          </DropdownItem>
          <DropdownItem as={Link} href="/profile">
            Profile
          </DropdownItem>
          <DropdownItem color="danger" onClick={async () => signOutUser()}>
            Sign Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
