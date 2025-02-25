"use client";

import { NavbarItem } from "@heroui/navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";

type NavLinkProps = {
  href: string;
  label: string;
  badge?: number | null;
  onClick?: () => void;
};

export default function NavLink({ href, label, badge, onClick }: NavLinkProps) {
  const pathname = usePathname();

  const isActiveRef = useRef(pathname === href);

  useEffect(() => {
    isActiveRef.current = (pathname === href);
  }, [pathname, href]);
  
  return (
    <div className="relative">
      <NavbarItem
        isActive={isActiveRef.current}
        as={Link}
        href={href}
        onClick={onClick}
        className="text-md uppercase"
      >
        {label}
      </NavbarItem>
      {badge && (
        <div className="absolute top-[2px] right-[-25px] bg-accent rounded-full text-slate-700 font-bold text-xs w-5 h-5 flex items-center justify-center">
          {badge}
        </div>
      )}
    </div>
  );
}
