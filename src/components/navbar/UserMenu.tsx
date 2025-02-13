"use client";

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import Link from "next/link";
import { signOutUser } from "@/app/actions/authActions";

type UserMenuProps = {
  userName: string;
  photoUrl: string;
};

export default function UserMenu({ userName, photoUrl }: UserMenuProps) {
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
        disabledKeys={["username"]}
      >
        <DropdownItem
          key="username"
          showDivider
          isReadOnly
          as="span"
          className="h-10 flex flex-row"
          aria-label="username"
        >
          Signed in as {userName}
        </DropdownItem>
        <DropdownItem key="profile" color="secondary" textValue="Profile">
          <Link href="/profile">
            <div className="w-full h-full">Profile</div>
          </Link>
        </DropdownItem>
        <DropdownItem
          key="signout"
          color="secondary"
          onPress={async () => signOutUser()}
        >
          Sign Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
