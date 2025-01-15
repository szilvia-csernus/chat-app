import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

type AppModalProps = {
  openModalBtnText: string;
  modalTitle: string;
  modalBody: React.ReactNode;
  onCancelFn: () => void;
  onSuccessBtnText: string;
  onSuccessFn: () => void;
};

export default function AppModal({
  openModalBtnText,
  modalTitle,
  modalBody,
  onCancelFn,
  onSuccessBtnText,
  onSuccessFn,
}: AppModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>{openModalBtnText}</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalTitle}
              </ModalHeader>
              <ModalBody>
                {modalBody}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} onClick={onCancelFn}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose} onClick={onSuccessFn}>
                  {onSuccessBtnText}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
