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

const MemberImage: React.FC<MemberImageProps> = ({ memberName, memberImage, width, height, className }) => {
  
  let image: JSX.Element | null = null;

  if (memberImage && memberImage.includes('cloudinary')) {
  const cloudinaryUrl = `${memberImage}?cache-control=max-age=31536000`;
  image = (
    <CldImage
    alt={memberName || "Image of member"}
    src={cloudinaryUrl}
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
      alt={memberName || "Image of member"}
      width={width || 300}
      height={height || 300}
      src={memberImage || "/images/user.png"}
      className={className || "aspect-square object-cover"}
    />
  );
  }
  return <>{image}</>;
}

export default React.memo(MemberImage);