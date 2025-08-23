import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast 
} from "@chakra-ui/react";

import { toaster } from "@/components/ui/toaster"
import axios from "axios";

function CreateRoomModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
   const toast = useToast();
   const [name,setName]=useState<string>('')

   async function createRoom(){
    try {
        const res=await axios.post('/api/create-room',{roomName:name})
        
      toast({
          title: "Action successful.",
          description: "Your data has been saved.",
          status: "success", // success | error | warning | info
          duration: 2500,
          isClosable: true,
          position: "bottom-right", // optional: top | top-right | bottom | etc.
        })
    } catch (error) {
        console.error(error)   
    }
  }

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal" size="lg">
        Create Room
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create an Anonymous Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Room Name</FormLabel>
              <Input onChange={(e) => setName(e.target.value)}  placeholder="Enter Room Name" type="text" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button disabled={!name.length}   onClick={createRoom} colorScheme="teal" mr={3}>
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
