"use client";

import { NavbarItem } from "@heroui/navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import UnreadCount from "../UnreadCount";

type NavLinkProps = {
  href: string;
  label: string;
  unreadCount?: number | null;
  onClick?: () => void;
};

export default function NavLink({ href, label, unreadCount, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(pathname.includes(href));

  useEffect(() => {
    setIsActive(pathname.includes(href));
  }, [pathname, href]);
  
  return (
    <div className="relative">
      <NavbarItem
        isActive={isActive}
        as={Link}
        href={href}
        onClick={onClick}
        className="text-md uppercase"
      >
        {label}
      </NavbarItem>
      {unreadCount && (
        <UnreadCount
          unreadCount={unreadCount}
          className="absolute top-[2px] right-[-25px]"
        />
      )}
    </div>
  );
}
