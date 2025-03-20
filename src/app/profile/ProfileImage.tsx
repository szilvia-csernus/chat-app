"use client";

import { Image } from "@heroui/react";
// import { Session } from "next-auth";
import React, { useState } from "react";
import EditProfileImage from "./EditProfileImage";

type ProfileImageProps = {
  // session: Session | null;
  photoUrl: string;
  userName: string;
};

export default function ProfileImage({ photoUrl, userName }: ProfileImageProps) {
  const userInitiallyHasImage = photoUrl ? true : false;

  const [userHasImage, setUserHasImage] = useState(userInitiallyHasImage);

  return (
    <div className="flex flex-col justify-between items-center">
      <h1 className="text-xl mb-4 font-bold items-center">
        Your Profile Image
      </h1>
      <div className="flex flex-col">
        <Image
          alt={userName}
          src={photoUrl || "/images/user.png"}
          width={180}
          className="aspect-square object-cover my-2"
        />
      </div>
      <EditProfileImage
        photoUrl={photoUrl}
        userName={userName}
        userHasImage={userHasImage}
        setUserHasImage={setUserHasImage}
      />
    </div>
  );
}
