"use client";

import {
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import React, { useState } from "react";
import { deleteUser, signOutUser } from "../actions/authActions";
import { useAppSelector } from "@/redux-store/hooks";
import { selectCurrentMemberId } from "@/redux-store/features/currentMemberSlice";


export default function DeleteProfile() {
  const currentMemberId = useAppSelector(selectCurrentMemberId);
  // modal properties
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (onClose: () => void) => {
    try {
      setIsDeleting(true);
      setError(null);
      console.log("Deleting user...");
      const deletedProfileId = currentMemberId && await deleteUser(currentMemberId);
      if (deletedProfileId) {
        await signOutUser();
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
      setIsDeleting(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const ConfirmDelete = (
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
            <ModalHeader>
              Are you sure you want to delete your account?
            </ModalHeader>

            <ModalBody>
              <div className="space-y-4 flex justify-center">
                This action will permanently erase all your data from our
                servers.
              </div>
              <div>{error && <p className="text-danger">{error}</p>}</div>
            </ModalBody>
            <ModalFooter>
              <div className="flex items-center justify-between gap-5">
                <Button
                  type="button"
                  size="lg"
                  color="secondary"
                  className="border-medium border-secondary bg-transparent text-foreground"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isDeleting}
                  type="submit"
                  size="lg"
                  color="secondary"
                  className="text-white"
                  onPress={() => handleDelete(onClose)}
                  isDisabled={isDeleting}
                >
                  Delete my account
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  return (
    <>
      <div className="absolute flex justify-center items-center">
        {isOpen && ConfirmDelete}
      </div>

      <div className="max-w-96 mx-auto sm:col-span-2 md:col-span-1 flex flex-col justify-between items-center gap-4">
        <div className="md:hidden">*</div>
        <h3 className="text-xl font-bold mb-4 text-center">
          Have you had enough?{" "}
        </h3>
        <p className="ml-2">
          When you delete your account, all the data you have provided,
          including your messages, email, image, and personal details, will be
          permanently removed from our servers.
        </p>
        {/* <p className="text-sm ml-2">
        Please note that as this is an experimental project, your account will
        be automatically deleted two weeks after subscribing.
      </p> */}
        <div className="mt-4">
          <Button
            type="submit"
            size="md"
            // variant="ghost"
            // color="danger"
            onPress={onOpen}
            className="btn btn-secondary text-danger border-1 border-danger bg-transparent"
          >
            Delete Account Now
          </Button>
        </div>
        <div className="md:hidden mt-4">*</div>
      </div>
    </>
  );
}
