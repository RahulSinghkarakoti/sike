import React from "react";
import {
  HStack,
  Avatar,
  Text,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  useDisclosure,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { AddIcon, AttachmentIcon } from "@chakra-ui/icons";
import { Chat } from "@/types/chat";

type ChatHeaderProps = {
  currentChat: Chat;
};

function ChatHeader({ currentChat }: ChatHeaderProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();

const handleCopyToClipboard = async (slug: string) => {
  try {
    await navigator.clipboard.writeText(slug);

    const feedback = document.getElementById("copyCode") as HTMLElement | null;

    if (feedback) {
      feedback.textContent = "Copied!";
      setTimeout(() => {
        feedback.textContent = "Copy";
      }, 2000);
    }
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};


  return (
    <>
      <HStack
        px={4}
        py={3}
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        justify="space-between"
      >
        <HStack>
          <Avatar size="sm" />
          <Text fontWeight="bold">
            {currentChat?.name || "Room Name HERE..."}
          </Text>
        </HStack>

        <HStack spacing={2}>
          <IconButton icon={<AddIcon />} size="sm" aria-label="Add" />
          <IconButton
            onClick={onOpen}
            icon={<AttachmentIcon />}
            size="sm"
            aria-label="Attach"
          />
        </HStack>
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Room Id </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input value={currentChat.slug} />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" colorScheme="red" onClick={onClose} mr="3">
              Close
            </Button>
            <Button
              variant="solid"
              colorScheme="green"
              id="copyCode"
              onClick={(e) => handleCopyToClipboard(currentChat.slug)}
            >
              Copy 
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ChatHeader;
