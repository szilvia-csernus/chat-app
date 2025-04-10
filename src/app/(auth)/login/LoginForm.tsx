"use client";

import { FiLock } from "react-icons/fi";
import CardWrapper from "@/components/CardWrapper";

import SocialLogins from "./SocialLogins";
import { useState } from "react";
import { Spinner } from "@heroui/react";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <Spinner size={"lg"} variant={"spinner"}/>}
      {!loading && (
        <CardWrapper
          headerText="Log In / Sign Up"
          headerIcon={FiLock}
          subHeader={
            <p className="text-sm">
              Choose a login method below to get started.
            </p>
          }
          body={
            <div className="h-full flex flex-col gap-4">
              <SocialLogins setLoading={setLoading} />
            </div>
          }
        ></CardWrapper>
      )}
    </>
  );
}
