"use client";

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import Link from "next/link";
import { signOutUser } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";


type UserMenuProps = {
  userName: string;
  photoUrl: string;
};

export default function UserMenu({ userName, photoUrl }: UserMenuProps) {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/profile");
  };
  
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
        <DropdownItem
          key="profile"
          color="secondary"
          textValue="Profile"
          onPress={handleProfileClick}
        >
          Profile
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
