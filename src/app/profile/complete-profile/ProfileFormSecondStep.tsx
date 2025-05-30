import { Checkbox, Input } from "@heroui/react";
import { Session } from "next-auth";
import React, { ChangeEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import ProfileImageUpload from "../ProfileImageUpload";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinaryFromUrl,
} from "@/app/actions/photoActions";
import DividerOR from "@/components/dividerOR";
import { PhotoSchema } from "@/lib/schemas/completeProfileSchema";
import Image from "next/image";

type ProfileFormSecondStepProps = {
  session: Session | null;
  setIsSubmitDisabled: (value: boolean) => void;
};

export default function ProfileFormSecondStep({
  session,
  setIsSubmitDisabled,
}: ProfileFormSecondStepProps) {
  const {
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext<PhotoSchema>();
  const sessionImage = session?.user.image;

  // State to manage the upload button - active when social image is not selected
  const [isUploadDisabled, setIsUploadDisabled] = useState(false);

  

  // State to show the preview of the uploaded image
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const onSocialImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    
    setIsSubmitDisabled(true);
    setIsUploadDisabled(true);

    if (isChecked) {
      try {
        // Clear the previous image if any
        const cloudinaryImageId = getValues("cloudinaryImageId");
        if (cloudinaryImageId.length > 0) {
          await deleteImageFromCloudinary(cloudinaryImageId);
          setValue("imageUrl", "");
          setValue("cloudinaryImageId", "");
          setUploadedImage(null);
        }
        const result = await uploadImageToCloudinaryFromUrl(sessionImage);
        if (result.secure_url && result.public_id) {
          setValue("imageUrl", result.secure_url);
          setValue("cloudinaryImageId", result.public_id);
          await trigger(); // Trigger validation to update form state
          setIsUploadDisabled(true);
        }
      } catch (error) {
        console.error(error);
        return { status: "error", error: "Error uploading image" };
      }
    } else {
      const cloudinaryImageId = getValues("cloudinaryImageId");
      if (cloudinaryImageId.length > 0) {
        await deleteImageFromCloudinary(cloudinaryImageId);
        setValue("imageUrl", "");
        setValue("cloudinaryImageId", "");
        await trigger(); // Trigger validation to update form state
        setIsUploadDisabled(false);
      }
    }

    setIsSubmitDisabled(false);

  };

  return (
    <div className="space-y-4">
      {session?.user.provider && session?.user.image && (
        <>
          Would you like to use your{" "}
          <span className="">{session.user.provider}</span> profile picture?
          <Image
            alt={session.user.name || "user"}
            src={session.user.image}
            width={100}
            height={100}
            className="aspect-square object-cover"
          />
          <Checkbox
            className="text-white rounded-lg"
            onChange={onSocialImageSelect}
          />
          <span>Yes, use this picture</span>
          <br />
          <DividerOR />
        </>
      )}
      <ProfileImageUpload
        setValue={setValue}
        getValues={getValues}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        uploadDisabled={isUploadDisabled}
      />
      {errors && errors.imageUrl && (
        <div className="text-red-500 text-sm">{errors.imageUrl.message}</div>
      )}
      <Input type="hidden" {...register("imageUrl", { value: "" })} />
      <Input type="hidden" {...register("cloudinaryImageId", { value: "" })} />
    </div>
  );
}
