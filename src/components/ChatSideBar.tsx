"use client";

import {
  VStack,
  HStack,
  Avatar,
  Text,
  Input,
  useToast,
  Skeleton,
  SkeletonCircle,
  Stack,
  IconButton,
} from "@chakra-ui/react";

import { useContext, useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { LuRefreshCcw } from "react-icons/lu";
import { ChatContext } from "@/context/ChatContext";
import CreateRoomModal from "./CreateRoomModal";
import JoinRoomModal from "./JoinRoomModal";

type ChatRoomWithRelations = Prisma.ChatRoomGetPayload<{
  include: { messages: true; members: true };
}>;

function ChatSideBar() {
  const [error, setError] = useState<string>("");
  const toast = useToast();

  const { chatLoading, chats, getChats, setCurrentChat } =
    useContext(ChatContext);

  const fetchChats = async () => {
    try {
      if (chatLoading) return;
      await getChats();
    } catch (error: any) {
      if (error instanceof Error) {
        console.log(error);
        setError(error.message); // Set error message from thrown Error object
      } else {
        setError("Unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description:   error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setError("");
    }
  }, [error, toast]);

  return (
    <VStack spacing={4} align="stretch">
      <HStack>
        <Input placeholder="Search chats..." size="sm" />
             <CreateRoomModal/>

        {/* <IconButton
          icon={<LuRefreshCcw />}
          size="sm"
          aria-label="Refrsh"
          onClick={() => fetchChats()}
        >
          Refresh
        </IconButton> */}
      </HStack>
      {chatLoading ? (
        <>
          {new Array(7).fill(0).map((_, index) => (
            <HStack key={index} gap="5">
              <SkeletonCircle size="12" />
              <Stack flex="1">
                <Skeleton height="5" />
                <Skeleton height="5" width="80%" />
              </Stack>
            </HStack>
          ))}
        </>
      ) : (
        <>
          <VStack align="stretch" spacing={3}>
            <HStack
              p={3}
              borderRadius="md"
              cursor="pointer"
              transition="all .2s"
              _hover={{
                bg: "gray.100",
                transform: "translateY(-2px)",
                boxShadow: "md",
              }}
            >
              <JoinRoomModal />
            </HStack>

            {chats &&
              chats?.map((chat, index) => (
                <HStack
                  key={index}
                  p={3}
                  borderRadius="md"
                  cursor="pointer"
                  transition="all .2s"
                  _hover={{
                    bg: "gray.100",
                    transform: "translateY(-2px)",
                    boxShadow: "md",
                  }}
                  onClick={() => setCurrentChat(chat)}
                >
                  <Avatar size="sm" />
                  <Text fontWeight="medium">{chat?.name}</Text>
                </HStack>
              ))}
          </VStack>
        </>
      )}
    </VStack>
  );
}

export default ChatSideBar;
