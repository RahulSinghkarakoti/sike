import React, { useContext, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
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

import { toaster } from "@/components/ui/toaster";
import axios from "axios";
import { LuRefreshCcw, LuUserPlus } from "react-icons/lu";
import { ChatContext } from "@/context/ChatContext";

function CreateRoomModal() {
  const { createRoom } = useContext(ChatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [name, setName] = useState<string>("");

  const handleCreateRoom = async () => {
    try {
      const res = await createRoom(name);
      toast({
        title: res?.success ? "Success" : "Error",
        description: res?.message || "",
        status: res?.success ? "success" : "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <IconButton
        icon={<LuUserPlus />}
        size="sm"
        aria-label="Add Room"
        onClick={() => onOpen()}
      >
        Add Room
      </IconButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create an Anonymous Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Room Name</FormLabel>
              <Input
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Room Name"
                type="text"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={!name.length}
              onClick={handleCreateRoom}
              colorScheme="teal"
              mr={3}
            >
              Create
            </Button>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateRoomModal;
