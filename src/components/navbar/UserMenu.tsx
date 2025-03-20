"use client";

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { signOutUser } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import PresenceAvatar from "../PresenceAvatar";


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
        <div className="transition-transform cursor-pointer">
          <PresenceAvatar
            imageWidth={50}
            imageHeight={50}
            src={photoUrl}
            own={true}
          />
        </div>
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
          textValue="Profile"
          className="hover:text-secondary hover:dark:text-teal-300 transition-all"
          onPress={handleProfileClick}
        >
          Profile
        </DropdownItem>
        <DropdownItem
          key="signout"
          className="hover:text-secondary hover:dark:text-teal-300 transition-all"
          onPress={async () => signOutUser()}
        >
          Sign Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
