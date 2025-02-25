"use client";

import { Button } from "@heroui/button";

import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { signIn as socialSignIn } from "next-auth/react";
import { revalidateTag } from "next/cache";
import { useRouter } from "next/navigation";

export default function SocialLogins() {
  const router = useRouter();
  const socialClick = (provider: "google" | "github" | "linkedin") => {
    socialSignIn(provider, {
      redirectTo: "/members",
    });
  };

  return (
    <>
      <div className="flex items-center w-full gap-2">
        <Button
          size="lg"
          fullWidth
          variant="faded"
          onPress={() => socialClick("google")}
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
          onPress={() => socialClick("github")}
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
          onPress={() => socialClick("linkedin")}
          className="border-1 rounded-lg border-gray-400"
        >
          <FaLinkedin color="#0077B5" size={24} />
          Log In with LinkedIn
        </Button>
      </div>
    </>
  );
}
