"use client";

import { Image } from "@heroui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import EditProfileImage from "./EditProfileImage";

type ProfileImageProps = {
  session: Session | null;
  photoUrl: string | null;
};

export default function ProfileImage({ session, photoUrl }: ProfileImageProps) {
  const userInitiallyHasImage = photoUrl ? true : false;

  const [userHasImage, setUserHasImage] = useState(userInitiallyHasImage);

  return (
    <div className="flex flex-col justify-between items-center">
      <h1 className="text-xl mb-4 font-bold items-center">
        Your Profile Image
      </h1>
      <div className="w-48 flex flex-col">
        <Image
          alt="Profile"
          src={photoUrl ?? "/images/user.png"}
          width={180}
          height={180}
          className="aspect-square object-cover my-2"
        />
      </div>
      <EditProfileImage
        session={session}
        userHasImage={userHasImage}
        setUserHasImage={setUserHasImage}
      />
    </div>
  );
}
