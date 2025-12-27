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
import MessageSkeleton from "./MessageSkeleton";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";

function ChatArea() {
  const { currentChat, messages, messageLoading, sendLoading, sendMessage } =
    useContext(ChatContext);
  

  if (!currentChat) {
    return (
      <Flex flex="1" direction="column" p={4} overflowY="auto" minH="100vh">
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
      align=""
      maxH="100vh"
    >
      {/* Chat Header */}
   <ChatHeader currentChat={currentChat}/>

      {/* Message List */}
      <Box h="400px" overflowY="auto" p={0} bg="gray.50" borderRadius="md">
          <VStack spacing={4} align="stretch" w="100%" p={0}>
       <ChatMessages/> 
        </VStack>
      </Box>

      {/* Message Input */}
      <MessageInput sendLoading={sendLoading} sendMessage={sendMessage} />
    </Flex>
  );
}

export default ChatArea;
