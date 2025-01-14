"use client";

import { Button } from "@nextui-org/button";

import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { signIn as socialSignIn } from "next-auth/react";

export default function SocialLogins() {
  const socialClick = (provider: "google" | "github" | "linkedin") => {
    socialSignIn(provider, {
      redirectTo: "/profile",
    });
  };

  return (
    <>
      <div className="flex items-center w-full gap-2">
        <Button
          size="lg"
          fullWidth
          variant="faded"
          onClick={() => socialClick("google")}
          className="border-1 rounded-lg border-gray-400"
        >
          <FcGoogle size={24} />
          Log In with Google
        </Button>
      </div>
      <div className="flex items-center w-full gap-2">
        <Button
          size="lg"
          fullWidth
          variant="faded"
          onClick={() => socialClick("github")}
          className="border-1 rounded-lg border-gray-400"
        >
          <FaGithub size={24} />
          Log In with Github
        </Button>
      </div>
      <div className="flex items-center w-full gap-2">
        <Button
          size="lg"
          fullWidth
          variant="faded"
          onClick={() => socialClick("linkedin")}
          className="border-1 rounded-lg border-gray-400"
        >
          <FaLinkedin color="#0077B5" size={24} />
          Log In with LinkedIn
        </Button>
      </div>
    </>
  );
}
