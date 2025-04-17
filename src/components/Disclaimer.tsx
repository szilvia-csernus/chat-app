"use client";

import { Button, ModalHeader } from "@heroui/react";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setDisclaimerAccepted: (accepted: boolean) => void;
}

export default function Disclaimer({isOpen, onOpenChange, setDisclaimerAccepted}: Props) {
  

  return (
    <>
      <Modal
        placement={"center"}
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        backdrop="opaque"
        scrollBehavior="outside"
        hideCloseButton
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
              <ModalHeader>Disclaimer</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p>
                    Please note that this app was built for demonstration
                    purposes, not intended for wide-audience or high-traffic
                    use. As such, please treat it as a test site.
                  </p>
                  <p>
                    After signing up, you will be able to create a profile and
                    send text messages to other users. Your email and personal 
                    data will not be publicly visible. You also have the option
                    to delete your account at any time.
                  </p>
                  <p>
                    Nevertheless, always be kind and considerate when contacting
                    others, especially if you do not personally know them.
                  </p>
                  <div className="flex-grow flex flex-col justify-center items-center">
                    <HiOutlineChatBubbleLeftRight
                      size={40}
                      className="text-secondary dark:text-teal-200"
                    />
                  </div>
                  <p className="italic text-center">
                    Please communicate respectfully and professionally.
                  </p>
                  <p className="italic text-center">Thank you!</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex items-center justify-between gap-5">
                  <Button
                    type="submit"
                    size="lg"
                    color="secondary"
                    className="btn w-full btn-secondary text-white"
                    onPress={() => {
                      setDisclaimerAccepted(true);
                      localStorage.setItem("disclaimerAccepted", "true");
                      onClose();
                    }}
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
