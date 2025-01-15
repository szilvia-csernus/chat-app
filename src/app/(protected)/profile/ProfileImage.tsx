"use client";

import { Image } from "@nextui-org/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import EditProfileImage from "./EditProfileImage";

type ProfileImageProps = {
  session: Session | null;
  photoUrl: string | null;
};

export default function ProfileImage({
  session,
  photoUrl,
}: ProfileImageProps) {
  const userInitiallyHasImage = photoUrl ? true : false;

  const [userHasImage, setUserHasImage] = useState(userInitiallyHasImage);

  return (
    <div className="border p-5 rounded-lg border-[#999] mb-2">
        <h1 className="text-2xl mb-4 font-semibold">Your Profile Image</h1>
        <div className="w-48 flex flex-col">
        <Image
          alt="Profile"
          src={photoUrl ?? "/images/user.png"}
          width={200}
          height={200}
          className="aspect-square object-cover"
        />

        <EditProfileImage
          session={session}
          userHasImage={userHasImage}
          setUserHasImage={setUserHasImage}
        />
        </div>
    </div>
  );
}
