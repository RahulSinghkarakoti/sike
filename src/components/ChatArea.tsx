"use client";

import {
  Box,
  Flex,
  VStack,
  HStack,
  Avatar,
  Text,
  Input,
  IconButton,
  Divider,
  Container,
  Button,
  Center,
  Icon,
} from "@chakra-ui/react";
import { AddIcon, AttachmentIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useContext, useState } from "react";
import axios from "axios";
import { ChatContext } from "@/context/ChatContext";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import MessageInput from "./MessageInput";
import Cookies from "js-cookie";
import { format, isToday, isYesterday } from "date-fns";
import MessageSkeleton from "./MessageSkeleton";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";

function ChatArea() {
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

  if (!currentChat) {
    return (
      <Flex flex="1" direction="column" p={4} overflowY="auto" maxH="85vh">
        <Center h="100%">
          <VStack>
            <Icon
              as={IoChatboxEllipsesOutline}
              boxSize="100"
              color="gray.500"
            />
            <Text fontSize="xl" color="gray.500">
              Select a room to start chatting
            </Text>
          </VStack>
        </Center>
      </Flex>
    );
  }

  return (
    <Flex
      flex="1"
      direction="column"
      justify="space-between"
      align=""
      maxH="85vh"
    >
      {/* Chat Header */}
   <ChatHeader currentChat={currentChat}/>

      {/* Message List */}
      <Box h="400px" overflowY="auto" p={3} bg="gray.50" borderRadius="md">
        <VStack align="stretch" spacing={3}>
          {messageLoading ? (
            <MessageSkeleton />
          ) : (
            Array.isArray(messages) &&
            messages?.map((message, index) => (
              <div key={message.id || index}>
                {user_id === message.senderId ? (
                  <HStack align="end" justify="flex-end">
                    <Box
                      bg="teal.500"
                      color="white"
                      p={3}
                      borderRadius="lg"
                      maxW="70%"
                    >
                      <Text>{message.text}</Text>
                      <Text fontSize="xs" color="gray.100" textAlign="right">
                        {formatTime(message.created_at)}
                      </Text>
                    </Box>
                  </HStack>
                ) : (
                  <HStack align="start">
                    <Avatar size="sm" />
                    <Box bg="gray.200" p={3} borderRadius="lg" maxW="70%">
                      <Text>{message.text}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {formatTime(message.created_at)}
                      </Text>
                    </Box>
                  </HStack>
                )}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </VStack>
      </Box>

      {/* Message Input */}
      <MessageInput sendLoading={sendLoading} sendMessage={sendMessage} />
    </Flex>
  );
}

export default ChatArea;
