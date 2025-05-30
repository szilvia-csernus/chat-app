"use client";

import { deleteImageFromCloudinary } from "@/app/actions/photoActions";
import ImageUploadButton from "@/components/ImageUploadButton";
import { PhotoSchema } from "@/lib/schemas/completeProfileSchema";
import { Image } from "@heroui/react";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { UseFormSetValue, UseFormGetValues } from "react-hook-form";

type ProfileImageUploadProps = {
  setValue: UseFormSetValue<PhotoSchema>;
  getValues: UseFormGetValues<PhotoSchema>;
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
      setValue("imageUrl", "");
      setValue("cloudinaryImageId", "");
      setUploadedImage(null);
      await deleteImageFromCloudinary(cloudinaryImageId);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-48">
      {uploadedImage && (
        <Image
          src={uploadedImage}
          alt="Uploaded Image"
          width={200}
          height={200}
          className="aspect-square object-cover my-4"
        />
      )}
      <div
        className={`${uploadDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={onClickHandle}
      >
        {!uploadedImage && (<ImageUploadButton onUploadImage={onUploadImage} />)}
      </div>
    </div>
  );
}
