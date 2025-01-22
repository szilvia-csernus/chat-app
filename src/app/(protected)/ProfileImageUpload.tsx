"use client";

import { deleteImageFromCloudinary } from "@/app/actions/photoActions";
import ImageUploadButton from "@/components/ImageUploadButton";
import { Image } from "@heroui/react";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { UseFormSetValue } from "react-hook-form";

type ProfileImageUploadProps = {
  setValue: UseFormSetValue<{
    imageUrl: string;
    cloudinaryImageId: string;
  }>;
  getValues: (key: string) => string;
  uploadedImage?: string | null;
  setUploadedImage: (url: string | null) => void;
  uploadDisabled?: boolean;
};

export default function ProfileImageUpload({
  setValue,
  getValues,
  uploadedImage,
  setUploadedImage,
  uploadDisabled,
}: ProfileImageUploadProps) {
  const router = useRouter();

  const onUploadImage = async (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info === "object") {
      setValue("imageUrl", result.info.secure_url);
      setValue("cloudinaryImageId", result.info.public_id);
      setUploadedImage(result.info.secure_url);
    }
  };

  const onClickHandle = async () => {
    const cloudinaryImageId = getValues("cloudinaryImageId");
    if (cloudinaryImageId.length > 0) {
      await deleteImageFromCloudinary(cloudinaryImageId);
      setValue("imageUrl", "");
      setValue("cloudinaryImageId", "");
      setUploadedImage(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {uploadedImage && (
        <Image
          src={uploadedImage}
          alt="Uploaded Image"
          width={100}
          height={100}
          className="aspect-square object-cover my-4"
        />
      )}
      <div
        className={`${uploadDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={onClickHandle}
      >
        <ImageUploadButton onUploadImage={onUploadImage} />
      </div>
    </div>
  );
}
