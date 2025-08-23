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
} from "@chakra-ui/react";
import { AddIcon, AttachmentIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import ChatArea from "./ChatArea";
import ChatSideBar from "./ChatSideBar";

export default function ChatLayout() {
  return (
    <Flex  bg="gray.50">
      {/* Sidebar */}
      <Box
        w={{ base: "0", md: "300px" }}
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        p={4}
        display={{ base: "none", md: "block" }}
      >
       <ChatSideBar/>
      </Box>
<ChatArea/>
    
    </Flex>
  );
}
