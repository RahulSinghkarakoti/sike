import { ChatContext, ChatProvider } from "@/context/ChatContext";
import { ApiResult } from "@/types/chat";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";

function JoinRoomModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [roomSlug, setRoomSlug] = useState<string>("");
  const { joinRoom } = useContext(ChatContext);
  const toast = useToast();

  const handleJoinRoom = async () => {
    const result = await joinRoom(roomSlug);

    console.log(result);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        status: result.success ? "success" : "error",
        duration: 5000,
        isClosable: true,
      });
    onClose()
  };

 
  return (
    <>
      <Button variant="outline" w="100%" colorScheme="cyan" onClick={onOpen}>
        Join New Room
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Room Id </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="dnNRBka2@"
              onChange={(e) => setRoomSlug(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" colorScheme="red" onClick={onClose} mr="3">
              Close
            </Button>
            <Button
              variant="solid"
              colorScheme="green"
              onClick={(e) => handleJoinRoom()}
            >
              Join
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default JoinRoomModal;
