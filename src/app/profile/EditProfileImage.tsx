"use client";

import { Button, Input } from "@heroui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ProfileImageUpload from "./ProfileImageUpload";
import {
  addPhotoToDatabase,
  deleteImageFromCloudinary,
} from "@/app/actions/photoActions";
import { photoSchema, PhotoSchema } from "@/lib/schemas/completeProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import MemberImage from "@/components/MemberImage";

type EditProfileImageProps = {
  photoUrl: string;
  userName: string;
  userHasImage: boolean;
  setUserHasImage: (value: boolean) => void;
};

export default function EditProfileImage({
  photoUrl,
  userName,
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
    setError,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = useForm<PhotoSchema>({
    resolver: zodResolver(photoSchema),
    mode: "onChange",
  });

  // State to show the preview of the uploaded image
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  function resetImgUploadValues() {
    setValue("imageUrl", "");
    setValue("cloudinaryImageId", "");
    setError("root.serverError", { message: "" });
  }

  function resetAll() {
    resetImgUploadValues();
    setUploadedImage(null);
  }

  const onCancel = async (callback: () => void) => {
    setIsCancelling(true);
    if (getValues("cloudinaryImageId").length > 0) {
      await deleteImageFromCloudinary(getValues("cloudinaryImageId"));
    }
    resetAll();
    setIsCancelling(false);
    callback();
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
        placement={"center"}
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
                <div className="w-full flex flex-col items-center justify-center relative">
                  {!uploadedImage && (
                    <div className="absolute left-[calc(1/2_-_100px] opacity-50 rounded-lg overflow-hidden border-1 border-slate-400 dark:border-slate-500">
                      <MemberImage
                        memberName={userName}
                        memberImage={photoUrl}
                        imageWidth={200}
                        imageHeight={200}
                        className="aspect-square object-cover"
                      />
                    </div>
                  )}
                  <div className="h-48 z-10 opacity-90">
                    <ProfileImageUpload
                      setValue={setValue}
                      getValues={getValues}
                      uploadedImage={uploadedImage}
                      setUploadedImage={setUploadedImage}
                    />
                  </div>
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
                      isLoading={isCancelling}
                      className="btn border-medium w-full border-secondary bg-transparent text-foreground"
                      onPress={() => onCancel(onClose)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      color="secondary"
                      isLoading={isSubmitting}
                      isDisabled={!uploadedImage || !isValid}
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
