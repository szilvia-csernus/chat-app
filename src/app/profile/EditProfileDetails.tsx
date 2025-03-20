"use client";

import { Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Profile } from "@prisma/client";
import { editProfileDetails } from "@/app/actions/profileActions";
import { useRouter } from "next/navigation";
import { EditProfileSchema, editProfileSchema } from "@/lib/schemas/editProfileSchema";

type EditProfileDetailsProps = {
  userName: string;
  profile: Profile | null;
};

export default function EditProfileDetails({
  userName,
  profile,
}: EditProfileDetailsProps) {
  // for the modal
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  // for the form
  const {
    register,
    getValues,
    setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    mode: "onTouched",
  });

  const router = useRouter();

  function onCancel(callback: () => void) {
    reset();
    callback();
  }

  const onSubmit = async () => {
    const result = await editProfileDetails(getValues());
    if (result?.status === "success") {
      router.refresh();
      reset();
      onClose();
    } else {
      // Handle server errors by Zod
      if (Array.isArray(result.error)) {
        result.error.forEach((e) => {
          const fieldName = e.path.join(".") as
            | "name"
            | "country"
          setError(fieldName, { message: e.message });
        });
      } else {
        setError("root.serverError", { message: result.error });
      }
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-secondary text-white text-medium font-light rounded-lg py-2 px-4 mt-5 hover:bg-secondary/70"
      >
        Edit Details
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
              <ModalHeader>Update Personal Details</ModalHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                  <div className="space-y-4">
                    <Input
                      label="First Name"
                      isRequired
                      autoComplete="given-name"
                      variant="bordered"
                      defaultValue={userName}
                      {...register("name")}
                      isInvalid={!!errors.name}
                      errorMessage={errors.name?.message as string}
                    />
                    <Input
                      label="Country of residence"
                      isRequired
                      autoComplete="country-name"
                      variant="bordered"
                      defaultValue={profile?.country}
                      {...register("country")}
                      isInvalid={!!errors.country}
                      errorMessage={errors.country?.message as string}
                    />
                    
                  </div>
                </ModalBody>
                <ModalFooter>
                  <div className="flex items-center justify-between gap-5">
                    <Button
                      type="button"
                      size="lg"
                      color="secondary"
                      className="btn border-medium w-full border-secondary bg-transparent text-foreground"
                      onPress={() => onCancel(onClose)}
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
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
