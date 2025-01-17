"use client";

import { Button } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { createConversation } from "../actions/conversationActions";
import { PressEvent } from "@react-types/shared";
import { Member } from "@/types";


type NewConversationProps = {
  member: Member;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
};

export default function NewConversation({
  member,
  isOpen,
  onOpenChange,
  onClose,
}: NewConversationProps) {
  
  const router = useRouter();

  const newChatHandler = async (event: PressEvent, onClose: () => void) => {
    const newChat = await createConversation(member.id);
    if (!newChat) {
      throw new Error("Failed to create new chat");
    }
    router.push(`/chats/${newChat.id}`);
    onClose();
  }

  return (
    <>
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
              <ModalHeader>Start New Chat?</ModalHeader>

                <ModalBody>
                  <div className="space-y-4 flex justify-center">
                    Would you like to start a new chat with {member.name}?
                  </div>
                </ModalBody>
                <ModalFooter>
                  <div className="flex items-center justify-between gap-5">
                    <Button
                      type="button"
                      size="lg"
                      color="secondary"
                      className="btn border-medium w-full border-secondary bg-transparent text-foreground"
                      onPress={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      color="secondary"
                      className="btn w-full btn-secondary text-white"
                      onPress={(event) => newChatHandler(event, onClose)}
                    >
                      Start Chat
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
