import { Image } from '@nextui-org/react';
import { User } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import React from 'react'

type MemberImageProps = {
  member: User;
  width?: number;
  height?: number;
  className?: string;
};

export default function MemberImage({ member, width, height, className }: MemberImageProps) {
  
  let memberImage = null

  if (member.image && member.image.includes('cloudinary')) {
    memberImage = (
      <CldImage
        alt="Image of member"
        src={member.image}
        width={width || 300}
        height={height || 300}
        className={className || "aspect-square object-cover"}
        crop="fill"
        gravity="faces"
      />
    ); // faces is a Cloudinary transformation, makes sure that the faces are not cropped out
  } else {
    memberImage = (
      <Image
        isZoomed
        alt={member.name || "user"}
        width={width || 300}
        src={member.image || "/images/user.png"}
        className={className || "aspect-square object-cover"}
      />
    );
  }
  return <>{memberImage}</>;
}
