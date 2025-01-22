import { Checkbox, Input } from "@heroui/react";
import { Session } from "next-auth";
import React, { ChangeEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import ProfileImageUpload from "../ProfileImageUpload";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinaryFromUrl,
} from "@/app/actions/profileActions";
import DividerOR from "@/components/dividerOR";

type ProfileFormSecondStepProps = {
  session: Session | null;
};

export default function ProfileFormSecondStep({
  session,
}: ProfileFormSecondStepProps) {
  const {
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext();
  const sessionImage = session?.user.image;

  // State to manage the upload button - active when social image is not selected
  const [isUploadDisabled, setIsUploadDisabled] = useState(false);

  // State to show the preview of the uploaded image
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const onSocialImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      try {
        // Clear the previous image if any
        const cloudinarycloudinaryImageId = getValues("cloudinaryImageId");
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
          setIsUploadDisabled(true);
          await trigger(); // Trigger validation to update form state
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
        setIsUploadDisabled(false);
        await trigger(); // Trigger validation to update form state
      }
    }
  };

  return (
    <div className="space-y-4">
      {session?.user.provider && session?.user.image && (
        <>
          Would you like to use your{" "}
          <span className="">{session.user.provider}</span> profile picture?
          <img
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
      <Input type="hidden" {...register("imageUrl", { value: "" })} />
      <Input type="hidden" {...register("cloudinaryImageId", { value: "" })} />
    </div>
  );
}
