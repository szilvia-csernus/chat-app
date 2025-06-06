"use client";

import { Button } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { createChat } from "@/app/actions/chatActions";
import { ChatData, Member } from "@/types";
import { useAppDispatch } from "@/redux-store/hooks";
import { addNewChat, setCurrentChatId } from "@/redux-store/features/chatsSlice";
import { useState } from "react";

type NewChatProps = {
  member: Member;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function NewChat({
  member,
  isOpen,
  onOpenChange,
}: NewChatProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newChatHandler = async (onClose: () => void) => {
    setIsSubmitting(true);
    const newChat = await createChat(member.id);
    if (!newChat) {
      throw new Error("Failed to create new chat");
    }
    dispatch(
      addNewChat({
        id: newChat.id,
        chatPartnerId: member.id,
        msgGroupsData: { msgGroups: {}, msgGroupChronList: [] },
        unreadMessageCount: 0,
        inactive: false,
      } as ChatData)
    );
    dispatch(setCurrentChatId(newChat.id));
    setIsSubmitting(false);
    router.push(`/chats/${newChat.id}`);
    onClose();
  };

  return (
    <>
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
        {!member.deleted && (
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
                      isLoading={isSubmitting}
                      className="btn w-full btn-secondary text-white"
                      onPress={() => newChatHandler(onClose)}
                    >
                      Start Chat
                    </Button>
                  </div>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
        {member.deleted && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Member Deleted</ModalHeader>

                <ModalBody>
                  <div className="space-y-4 flex justify-center">
                    It looks like this member has been deleted from our
                    database. You can&apos;t start a chat with them.
                  </div>
                </ModalBody>
                <ModalFooter>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      size="lg"
                      color="secondary"
                      className="btn border-medium w-full border-secondary bg-transparent text-foreground"
                      onPress={onClose}
                    >
                      OK
                    </Button>
                  </div>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
      </Modal>
    </>
  );
}
