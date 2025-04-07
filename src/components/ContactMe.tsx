"use client";

import { Button, Input, Textarea } from "@heroui/react";
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
import {
  contactMeSchema,
  ContactMeSchema,
} from "@/lib/schemas/contactMeSchema";
import { sendEmail } from "@/app/actions/mail";
import { useState } from "react";


export default function ContactMe() {
  // for the form modal
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  // for the message sent modal
  const {
    isOpen: isSuccessOpen,
    onOpen: onSuccessOpen,
    onOpenChange: onSuccessOpenChange,
  } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // for the form
  const {
    register,
    getValues,
    setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactMeSchema>({
    resolver: zodResolver(contactMeSchema),
    mode: "onTouched",
  });

  function onCancel(callback: () => void) {
    reset();
    callback();
  }

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const values = getValues();
      const result = await sendEmail(values);
      if (result?.data) {
        onSuccessOpen();
        reset();
        onClose();
      } else {
        // Handle server errors by Zod
        if (Array.isArray(result.error)) {
          result.error.forEach((e) => {
            const fieldName = e.path.join(".") as "email" | "message";
            setError(fieldName, { message: e.message });
          });
        } else {
          console.error("Server error while sending email:", result.error);
          setError("root.serverError", {
            message: JSON.stringify(result.error),
          });
        }
      }
    } catch (error) {
      // Handle other errors
      console.error("Error sending email:", error);
      setError("root.serverError", {
        message:
          "An error occurred while sending message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <span>
        Contact me
        <Button
          className="bg-transparent text-md text-accent underline cursor-pointer pl-1 m-0 justify-start"
          onPress={onOpen}
        >
          here
        </Button>
      </span>
      <Modal
        placement={"center"}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
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
              <ModalHeader>Contact Me</ModalHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                  <div className="space-y-4">
                    <Input
                      label="Your Emaill"
                      isRequired
                      autoComplete="email"
                      variant="bordered"
                      {...register("email")}
                      isInvalid={!!errors.email}
                      errorMessage={errors.email?.message as string}
                    />
                    <Textarea
                      label="Your Message"
                      isRequired
                      variant="bordered"
                      {...register("message")}
                      isInvalid={!!errors.message}
                      errorMessage={errors.message?.message as string}
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
                      isLoading={isSubmitting}
                      isDisabled={isSubmitting}
                      type="submit"
                      size="lg"
                      color="secondary"
                      className="btn w-full btn-secondary text-white"
                    >
                      Send
                    </Button>
                  </div>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Message Sent Modal */}
      <Modal
        placement={"center"}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        backdrop="opaque"
        classNames={{
          body: "py-10",
          base: "border-[#999] border-1 bg-background dark:bg-background text-foreground",
          header: "border-b-[1px] border-[#999] justify-center text-2xl my-2",
          footer: "border-t-[1px] border-[#999]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        isOpen={isSuccessOpen}
        onOpenChange={onSuccessOpenChange}
      >
        <ModalContent>
          {(onSuccessClose) => (
            <>
              <ModalBody>
                <div className="space-y-4">
                  <h2>Thank you for your message.</h2>
                  <p>I aim to respond in the next few days.</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex items-center justify-between gap-5">
                  <Button
                    type="submit"
                    size="lg"
                    color="secondary"
                    className="btn w-full btn-secondary text-white"
                    onPress={onSuccessClose}
                  >
                    OK
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
