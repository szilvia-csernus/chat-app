"use client";

import { HeroUIProvider } from "@heroui/react";
import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import StoreProvider from "./StoreProvider";

type Props = {
  children: ReactNode;
};

export default function Providers({
  children,

}: Props) {
  const router = useRouter();

  return (
    <StoreProvider>
      <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
    </StoreProvider>
  );
}
