import { Button } from "@nextui-org/button";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/navbar";
import Link from "next/link";
import React from "react";
import { FiUser } from "react-icons/fi";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";
import NavLink from "./NavLink";

export default async function MainNav() {
  const session = await auth();
  return (
    <Navbar
      maxWidth="2xl"
      className="bg-primary p-3 text-white"
      classNames={{
        item: ["text-m", "text-white", "data-[active=true]:text-accent"],
      }}
    >
      <NavbarBrand as={Link} href="/">
        <div className="font-bold text-xl  p-1">
          <span>Next.js</span>
          <span className="text-accent">AUTH</span>
        </div>
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavLink href="/about" label="About Us" />
        <NavLink href="/profile" label="Profile Page" />
      </NavbarContent>
      <NavbarContent justify="end">
        <>
          {session?.user ? (
            <UserMenu user={session.user} />
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
