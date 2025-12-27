import Cookies from "js-cookie";
import React, { useContext, useEffect, useRef } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { ChatContext } from "@/context/ChatContext";
import { Box, Text, VStack, HStack, Avatar, Flex } from "@chakra-ui/react";
import MessageSkeleton from "./MessageSkeleton";

function ChatMessages() {
  const { currentChat, messages, messageLoading, sendLoading, sendMessage } =
    useContext(ChatContext);

  const user_id = Cookies.get("anon_id");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (iso: string) => {
    const date = new Date(iso);

    if (isToday(date)) return format(date, "hh:mm a");
    if (isYesterday(date)) return "Yesterday " + format(date, "hh:mm a");
    return format(date, "dd MMM, hh:mm a");
  };

  if (messageLoading) {
    return <>
    <MessageSkeleton />;
    </>
  }
  return (
    <>
      {messages?.map((message, index) => {
        const isMe = user_id === message.senderId;

        return (
          <Flex
            key={message.id || index}
            justifyContent={isMe ? "flex-end" : "flex-start"}
            w="100%"
          >
            <HStack
              spacing={3}
              maxW="80%"
              flexDir={isMe ? "row-reverse" : "row"}
              alignItems="flex-end"
            >
              {/* Avatar only for others */}
              {/* {!isMe && (
                <Avatar
                  size="xs"
                  name={message.id}
                  src={message.id}
                />
              )} */}

              <Box
                bg={isMe ? "teal.500" : "gray.100"}
                color={isMe ? "white" : "black"}
                px={4}
                py={2}
                boxShadow="sm"
                // Custom corners to create a "speech bubble" effect
                borderRadius="2xl"
                borderBottomRightRadius={isMe ? "0" : "2xl"}
                borderBottomLeftRadius={isMe ? "2xl" : "0"}
              >
                <Text fontSize="md" lineHeight="tall" wordBreak="break-word">
                  {message.text}
                </Text>

                <Text
                  fontSize="10px"
                  mt={1}
                  textAlign={isMe ? "right" : "left"}
                  opacity={0.8}
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  {formatTime(message.created_at)}
                </Text>
              </Box>
            </HStack>
          </Flex>
        );
      })}
      <div ref={bottomRef} />
    </>
  );
}

export default ChatMessages;
