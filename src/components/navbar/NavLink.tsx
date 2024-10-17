"use client";

import { NavbarItem } from '@nextui-org/navbar'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

type NavLinkProps = {
  href: string;
  label: string;
}

export default function NavLink({href, label}: NavLinkProps) {
  const pathname = usePathname()
  return (
    <NavbarItem isActive={pathname === href} as={Link} href={href}>
      {label} 
    </NavbarItem>
  );
}
