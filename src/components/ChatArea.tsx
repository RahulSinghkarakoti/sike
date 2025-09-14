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

function ChatArea() {
  const { currentChat } = useContext(ChatContext);

  if (!currentChat) {
    return (
      <Flex flex="1" direction="column" p={4} overflowY="auto" minH="90vh">
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
    <Flex flex="1" direction="column" justify=" " align="" minH="90vh">
      {/* Chat Header */}
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
          <IconButton icon={<AttachmentIcon />} size="sm" aria-label="Attach" />
        </HStack>
      </HStack>

      {/* Message List */}
      <Flex flex="1" direction="column" p={4} overflowY="auto">
        <VStack spacing={4} align="stretch">
          {/* Incoming message */}
          <HStack align="start">
            <Avatar size="sm" />
            <Box bg="gray.200" p={3} borderRadius="lg" maxW="70%">
              <Text>Hello! How are you?</Text>
              <Text fontSize="xs" color="gray.500">
                10:30 AM
              </Text>
            </Box>
          </HStack>

          {/* Outgoing message */}
          <HStack align="end" justify="flex-end">
            <Box bg="teal.500" color="white" p={3} borderRadius="lg" maxW="70%">
              <Text>I'm good, thanks!</Text>
              <Text fontSize="xs" color="gray.100" textAlign="right">
                10:32 AM
              </Text>
            </Box>
          </HStack>

          {/* System message */}
          <Divider />
          <Text textAlign="center" fontSize="sm" color="gray.500">
            John joined the chat
          </Text>
          <Divider />
        </VStack>
      </Flex>

      {/* Typing Indicator */}
      <Box px={4} py={2}>
        <Text fontSize="sm" color="gray.500">
          John is typing...
        </Text>
      </Box>

      {/* Message Input */}
      <HStack
        p={4}
        borderTop="1px"
        borderColor="gray.200"
        bg="white"
        spacing={2}
      >
        <Input placeholder="Type a message..." />
        <IconButton
          colorScheme="teal"
          aria-label="Send"
          icon={<ArrowForwardIcon />}
        />
      </HStack>
    </Flex>
  );
}

export default ChatArea;
