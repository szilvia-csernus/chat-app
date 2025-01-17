import { Image } from '@nextui-org/react';
import { CldImage } from 'next-cloudinary';
import React from 'react'

type MemberImageProps = {
  memberName: string;
  memberImage: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function MemberImage({ memberName, memberImage, width, height, className }: MemberImageProps) {
  
  let image = null

  if (memberImage && memberImage.includes('cloudinary')) {
    image = (
      <CldImage
        alt="Image of member"
        src={memberImage}
        width={width || 300}
        height={height || 300}
        className={className || "aspect-square object-cover"}
        crop="fill"
        gravity="faces"
      />
    ); // faces is a Cloudinary transformation, makes sure that the faces are not cropped out
  } else {
    image = (
      <Image
        isZoomed
        alt={memberName || "user"}
        width={width || 300}
        height={height || 300}
        src={memberImage || "/images/user.png"}
        className={className || "aspect-square object-cover"}
      />
    );
  }
  return <>{image}</>;
}
