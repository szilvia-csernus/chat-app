"use client";

import { FiLock } from "react-icons/fi";
import CardWrapper from "@/components/CardWrapper";

import SocialLogins from "./SocialLogins";


export default function LoginForm() {

  return (
    <CardWrapper
      headerText="Log In / Sign Up"
      headerIcon={FiLock}
      subHeader={
        <p className="text-sm">Choose a login method below to get started.</p>
      }
      body={
        <div className="flex flex-col gap-4">
          <SocialLogins />
        </div>
      }
    ></CardWrapper>
  );
}
