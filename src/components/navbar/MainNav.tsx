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
import React, { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import UserMenu from "./UserMenu";
import NavLink from "./NavLink";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { useAppSelector } from "@/redux-store/hooks";
import { selectAllUnreadMsgCount } from "@/redux-store/features/chatsSlice";
import UnreadCount from "../UnreadCount";
import { useDisclosure } from "@heroui/react";
import Disclaimer from "../Disclaimer";
import useViewportReset from "@/hooks/misc-hooks/useViewportReset";

type MainNavProps = {
  currentMemberId: string | null;
  userName: string | null;
  photoUrl: string;
};

export default function MainNav({
  currentMemberId,
  userName,
  photoUrl,
}: MainNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // for the disclaimer modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const allUnreadMessageCount = useAppSelector(selectAllUnreadMsgCount);

  const menuItems = [
    { href: "/members", label: "Members" },
    { href: "/chats", label: "Chats", unreadCount: allUnreadMessageCount },
  ];

  useEffect(() => {
    const localStorageDisclaimerAccepted =
      localStorage.getItem("disclaimerAccepted");
    if (localStorageDisclaimerAccepted === "true") {
      setDisclaimerAccepted(true);
    } else {
      setDisclaimerAccepted(false);
    }
  }, []);

  useEffect(() => {
    if (disclaimerAccepted) {
      localStorage.setItem("disclaimerAccepted", "true");
    }
  }, [disclaimerAccepted]);

  useViewportReset();

  return (
    <>
      {!disclaimerAccepted && isOpen && (
        <Disclaimer
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          setDisclaimerAccepted={setDisclaimerAccepted}
        />
      )}
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth="2xl"
        className="bg-gradient-to-r from-slate-700 to-teal-700 p-2 w-full max-w-4xl mx-auto overflow-hidden scrollbar-hide"
        classNames={{
          item: ["text-m", "text-white", "data-[active=true]:text-accent"],
        }}
      >
        <NavbarContent className="sm:hidden relative" justify="start">
          {currentMemberId && (
            <>
              <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="text-white"
              />
              {
                <UnreadCount
                  unreadCount={allUnreadMessageCount}
                  className="absolute left-[28px]"
                />
              }
            </>
          )}
        </NavbarContent>
        {/* Logo */}
        <NavbarBrand as={Link} href="/">
          <HiOutlineChatBubbleLeftRight size={40} className="text-teal-200" />
          <div className="font-bold text-xl  p-1">
            <span className="text-white">Chat</span>
            <span className="text-accent font-extrabold">APP</span>
          </div>
        </NavbarBrand>
        {/* Mobile Menu */}
        {currentMemberId && (
          <NavbarMenu className="top-20 z-40 h-auto bg-gradient-to-r from-slate-700 to-teal-700 text-white overflow-y-hidden scrollbar-hide">
            {menuItems.map((item, index) => (
              <NavbarMenuItem
                key={index}
                className="mx-auto my-3 uppercase text-center"
              >
                <div className="mb-6 text-center">*</div>
                <NavLink
                  key={index}
                  href={item.href}
                  label={item.label}
                  unreadCount={item.unreadCount ? item.unreadCount : null}
                  onClick={() => setIsMenuOpen(false)}
                />
              </NavbarMenuItem>
            ))}
            <div className="my-4 text-center">*</div>
          </NavbarMenu>
        )}
        {/* Desktop Menu */}
        {currentMemberId && (
          <NavbarContent className="hidden sm:flex gap-6" justify="center">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  href={item.href}
                  label={item.label}
                  unreadCount={item.unreadCount ? item.unreadCount : null}
                  onClick={() => setIsMenuOpen(false)}
                />
              </li>
            ))}
          </NavbarContent>
        )}
        <NavbarContent justify="end">
          {/* User Menu */}
          <li>
            {userName ? (
              <UserMenu userName={userName} photoUrl={photoUrl} />
            ) : (
              <Button
                as={Link}
                href="/login"
                isIconOnly
                radius="full"
                variant="light"
                className="text-white"
                onPress={onOpen}
                aria-label="Login"
              >
                <FiUser size={25} />
              </Button>
            )}
          </li>
        </NavbarContent>
      </Navbar>
    </>
  );
}
