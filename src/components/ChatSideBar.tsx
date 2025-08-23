"use client";

import {
  VStack,
  HStack,
  Avatar,
  Text,
  Input,
  Toast,
  useToast,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Button,
  Stack,
  IconButton,
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { LuRefreshCcw } from "react-icons/lu";

type ChatRoomWithRelations = Prisma.ChatRoomGetPayload<{
  include: { messages: true; members: true };
}>;

function ChatSideBar() {
  const [chats, setChats] = useState<ChatRoomWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const toast = useToast();

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/my-rooms");

      if (response.data.status != 200) {
        setError("Unable to Fetch your chats");
        toast({
          title: "Error Occured",
          description: response.data.message,
          status: "error", // success | error | warning | info
          duration: 2500,
          isClosable: true,
          position: "bottom-right", // optional: top | top-right | bottom | etc.
        });
      } else {
        console.log(response.data.rooms);
        setChats(response.data.rooms);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <VStack spacing={4} align="stretch">
      <HStack>

      <Input placeholder="Search chats..." size="sm" />
      <IconButton icon={<LuRefreshCcw />} size="sm" aria-label="Refrsh" onClick={() => fetchChats()}>Refresh</IconButton>

      </HStack>
      {loading ? (
        <>
          {new Array(5).fill(0).map((_, index) => (
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
                >
                  <Avatar size="sm" />
                  <Text fontWeight="medium">{chat.name}</Text>
                </HStack>
              ))}
          </VStack>
        </>
      )}
    </VStack>
  );
}

export default ChatSideBar;
