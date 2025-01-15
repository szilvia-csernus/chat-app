// Bug!!: If user starts editing the image but then closes the window, the image is not cleared from Cloudinary.
// The image clears up well if the user uses the Cancel button to abort the operation,
// because the onCancel() function is called and the image is deleted from Cloudinary.
// The bug is present because I don't have access to the 'Close' button in the Modal component, so I can't call the onCancel() function.
// The onClose() function runs no matter how the modal was closed, so modifying the onClose() function to call the onCancel() function is not a solution.

"use client";

import { Button, Checkbox, Image, Input } from "@nextui-org/react";
import { Session } from "next-auth";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import ProfileImageUpload from "../ProfileImageUpload";
import {
  addPhotoToDatabase,
  deleteImageFromCloudinary,
  uploadImageToCloudinaryFromUrl,
} from "@/app/actions/photoActions";
import DividerOR from "@/components/dividerOR";
import { photoSchema, PhotoSchema } from "@/lib/schemas/completeProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

type EditProfileImageProps = {
  session: Session | null;
  userHasImage: boolean;
  setUserHasImage: (value: boolean) => void;
};

export default function EditProfileImage({
  session,
  userHasImage,
  setUserHasImage,
}: EditProfileImageProps) {
  // for the modal
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  // for the form
  const {
    register,
    setValue,
    getValues,
    trigger,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<PhotoSchema>({
    resolver: zodResolver(photoSchema),
    mode: "onChange",
  });

  // User's social image
  const sessionImage = session?.user.image ? session.user.image : null;

  // State to manage the upload button - active when social image is not selected
  const [isUploadDisabled, setIsUploadDisabled] = useState(false);

  // State to manage the social image's opacity
  const [isSocialImageSelected, setIsSocialImageSelected] = useState(false);

  // State to show the preview of the uploaded image
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  function resetImgUploadValues() {
    setValue("imageUrl", "");
    setValue("cloudinaryImageId", "");
    setError("root.serverError", { message: "" });
  }

  function resetAll() {
    resetImgUploadValues();
    setUploadedImage(null);
    setIsUploadDisabled(false);
    setIsSocialImageSelected(false);
  }

  const onCancel = async () => {
    if (getValues("cloudinaryImageId").length > 0) {
      await deleteImageFromCloudinary(getValues("cloudinaryImageId"));
    }
    resetAll();
    onClose();
  }

  const onSocialImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const imageId = getValues("cloudinaryImageId");

    if (isChecked) {
      try {
        setIsSocialImageSelected(true);
        setIsUploadDisabled(true);
        // Clear the previous image if any
        
        if (imageId.length > 0) {
          await deleteImageFromCloudinary(imageId);
          resetImgUploadValues();
        }
        const result = await uploadImageToCloudinaryFromUrl(sessionImage);
        if (result.secure_url && result.public_id) {
          setValue("imageUrl", result.secure_url);
          setValue("cloudinaryImageId", result.public_id);
          await trigger(); // Trigger validation to update form state
        }
      } catch (error) {
        console.error(error);
        return { status: "error", error: "Error uploading image" };
      }
    } else {
      if (imageId.length > 0) {
        await deleteImageFromCloudinary(imageId);
        resetAll();
        await trigger(); // Trigger validation to update form state
      }
    }
  };

  const onSubmit = async () => {
    const result = await addPhotoToDatabase(
      getValues("imageUrl"),
      getValues("cloudinaryImageId")
    );

    if (result?.status === "success") {
      setUserHasImage(true);
      resetAll();
      onClose();
    } else {
      // Handle server errors by Zod
      if (Array.isArray(result?.error)) {
        result.error.forEach((e) => {
          const fieldName = e.path.join(".") as
            | "imageUrl"
            | "cloudinaryImageId";
          setError(fieldName, { message: e.message });
        });
      } else {
        setError("root.serverError", { message: result?.error });
      }
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-secondary text-white text-medium font-light rounded-lg py-2 px-4 mt-5 hover:bg-secondary/70"
      >
        {userHasImage ? "Replace this image" : "Add new profile image"}
      </Button>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        backdrop="opaque"
        classNames={{
          body: "py-10",
          base: "border-[#999] border-1 bg-background dark:bg-background text-foreground",
          header: "border-b-[1px] border-[#999] justify-center text-2xl my-2",
          footer: "border-t-[1px] border-[#999]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Upload New Profile Picture</ModalHeader>
              <ModalBody>
                {session?.user.provider && session?.user.image && (
                  <div className="flex flex-col items-center">
                    <div className="text-md mb-4">
                      Would you like to use your{" "}
                      <span className="">{session.user.provider}</span> profile
                      picture?
                    </div>
                    <div className={isSocialImageSelected ? "" : "opacity-50"}>
                      <Image
                        alt={session.user.name || "user"}
                        src={session.user.image}
                        width={100}
                        height={100}
                        className="aspect-square object-cover"
                      />
                    </div>
                    <div className="my-4">
                      <Checkbox
                        className="text-white rounded-lg"
                        onChange={onSocialImageSelect}
                      />
                      <span className="text-medium font-light">
                        Yes, use this picture
                      </span>
                    </div>
                    <DividerOR />
                  </div>
                )}
                <div className="w-full flex flex-col items-center gap-4">
                  <ProfileImageUpload
                    setValue={setValue}
                    getValues={getValues}
                    uploadedImage={uploadedImage}
                    setUploadedImage={setUploadedImage}
                    uploadDisabled={isUploadDisabled}
                  />
                </div>
                <div className="text-danger text-sm">
                  {errors.root?.serverError?.message}
                </div>
              </ModalBody>
              <ModalFooter>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    type="hidden"
                    {...register("imageUrl", {
                      value: "",
                    })}
                  />
                  <Input
                    type="hidden"
                    {...register("cloudinaryImageId", { value: "" })}
                  />

                  <div className="flex items-center justify-between gap-5">
                    <Button
                      type="button"
                      size="lg"
                      color="secondary"
                      className="btn border-medium w-full border-secondary bg-transparent text-foreground"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      color="secondary"
                      className="btn w-full btn-secondary text-white"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
