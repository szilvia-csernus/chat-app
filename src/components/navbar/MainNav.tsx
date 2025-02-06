"use client";

import { Button } from "@heroui/button";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import Link from "next/link";
import React, { useState } from "react";
import { FiUser } from "react-icons/fi";
import UserMenu from "./UserMenu";
import NavLink from "./NavLink";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { usePresenceChannel } from "@/hooks/pusher-channel-hooks/usePresenceChannel";
import { useAppSelector } from "@/redux-store/hooks";
import { selectAllUnreadMessageCount } from "@/redux-store/features/recentChatsSlice";
import { usePrivateChatChannels } from "@/hooks/pusher-channel-hooks/usePrivateChatChannels";

type MainNavProps = {
  currentProfileId: string | null;
  userName: string | null;
  photoUrl: string;
};

export default function MainNav({ currentProfileId, userName, photoUrl }: MainNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const allUnreadMessageCount = useAppSelector(selectAllUnreadMessageCount);


  usePresenceChannel(currentProfileId);
  usePrivateChatChannels(currentProfileId);
  

  const menuItems = [
    { href: "/members", label: "Members" },
    { href: "/chats", label: "Chats", badge: allUnreadMessageCount },
  ];


  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="2xl"
      className="bg-gradient-to-r from-slate-700 to-teal-700 p-2"
      classNames={{
        item: ["text-m", "text-white", "data-[active=true]:text-orange-300"],
      }}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>
      <NavbarBrand as={Link} href="/">
        <HiOutlineChatBubbleLeftRight size={40} className="text-teal-200" />
        <div className="font-bold text-xl  p-1">
          <span className="text-white">Chat</span>
          <span className="text-accent">APP</span>
        </div>
      </NavbarBrand>
      <NavbarMenu className="top-20 z-40 h-auto bg-gradient-to-r from-slate-700 to-teal-700 text-foreground">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            href={item.href}
            label={item.label}
            badge={item.badge ? item.badge : null}
            onClick={() => setIsMenuOpen(false)}
          />
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <>
          {userName ? (
            <UserMenu userName={userName} photoUrl={photoUrl} />
          ) : (
            <>
              <Button
                as={Link}
                href="/login"
                isIconOnly
                variant="light"
                className="text-white"
              >
                <FiUser size={25} />
              </Button>
            </>
          )}
        </>
      </NavbarContent>
    </Navbar>
  );
}
