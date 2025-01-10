'use client'

import React from 'react'
import { CldUploadButton, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { HiPhoto } from 'react-icons/hi2';


type ImageUploadButtonProps = {
  onUploadImage: (result: CloudinaryUploadWidgetResults) => void;
}


export default function ImageUploadButton({ onUploadImage }: ImageUploadButtonProps) {
  return (
    <CldUploadButton
      options={{ maxFiles: 1 }}
      onSuccess={onUploadImage}
      signatureEndpoint="/api/sign-image"
      uploadPreset="nextjs-authjs-template"
      className={`flex items-center gap-2 bg-secondary text-white rounded-lg py-2 px-4 hover:bg-secondary/70}`}
    >
      <HiPhoto size={28} />
      Upload new image
    </CldUploadButton>
  );
}
