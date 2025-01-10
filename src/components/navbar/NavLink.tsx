"use client";

import { NavbarItem } from '@nextui-org/navbar'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

type NavLinkProps = {
  href: string;
  label: string;
  onClick?: () => void;
}

export default function NavLink({href, label, onClick}: NavLinkProps) {
  const pathname = usePathname()
  return (
    <NavbarItem isActive={pathname === href} as={Link} href={href} onClick={onClick}>
      {label} 
    </NavbarItem>
  );
}
