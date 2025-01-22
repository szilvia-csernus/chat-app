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
import { User } from "@prisma/client";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

type MainNavProps = {
  user: User | null;
  photoUrl: string;
};

export default function MainNav({ user, photoUrl }: MainNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: "/members", label: "Members" },
    { href: "/chats", label: "Chats" },
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
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            href={item.href}
            label={item.label}
            onClick={() => setIsMenuOpen(false)}
          />
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <>
          {user ? (
            <UserMenu user={user} photoUrl={photoUrl} />
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
