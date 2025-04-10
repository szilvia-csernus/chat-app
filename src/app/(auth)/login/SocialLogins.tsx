"use client";

import { Button } from "@heroui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { signIn as socialSignIn } from "next-auth/react";


type Props = {
  setLoading: (loading: boolean) => void;
}

export default function SocialLogins({setLoading}: Props) {
  const socialClick = (provider: "google" | "github" | "linkedin") => {
    setLoading(true); 
    try {
      socialSignIn(provider, {
        redirectTo: "/members", 
      });
    } catch (error) {
      console.error("Social sign-in failed:", error);
      setLoading(false); 
    }
  };

  return (
    <>
      <div className="flex items-center w-full gap-2">
        <Button
          size="lg"
          fullWidth
          variant="faded"
          onPress={() => socialClick("google")}
          className="border-1 rounded-lg border-gray-400 bg-gray-50 dark:bg-background"
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
          className="border-1 rounded-lg border-gray-400 bg-gray-50 dark:bg-background"
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
          className="border-1 rounded-lg border-gray-400 bg-gray-50 dark:bg-background"
        >
          <FaLinkedin color="#0077B5" size={24} />
          Log In with LinkedIn
        </Button>
      </div>
    </>
  );
}
