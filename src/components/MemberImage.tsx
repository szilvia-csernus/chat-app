// server side rendering then rehydration on the client side

import { Image } from "@heroui/react";
import { CldImage } from 'next-cloudinary';
import React, { type JSX } from 'react';

type MemberImageProps = {
  memberName: string;
  memberImage: string;
  imageWidth?: number;
  imageHeight?: number;
  className?: string;
};

const MemberImage: React.FC<MemberImageProps> = ({ memberName, memberImage, imageWidth, imageHeight, className }) => {
  let image: JSX.Element | null = null;

  if (memberImage && memberImage.includes('cloudinary')) {
  const cloudinaryUrl = `${memberImage}?cache-control=max-age=31536000`;
  image = (
    <CldImage
      alt={memberName || "Image of member"}
      src={cloudinaryUrl}
      width={imageWidth || 300}
      height={imageHeight || 300}
      className={`aspect-square object-cover transition-transform ${className}`}
      crop="fill"
      gravity="faces"
      priority={true}
    />
  ); // "faces" is a Cloudinary transformation, it makes sure that the human faces are not cropped out
  } else {
  image = (
    <Image
      alt={memberName || "Image of member"}
      width={imageWidth || 300}
      src={memberImage || "/images/user.png"}
      className={className || "aspect-square object-cover transition-transform rounded-none"}
    />
  );
  }
  return <>{image}</>;
}

export default React.memo(MemberImage);