"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Image,
  Flex,
  AbsoluteCenter,
} from "@chakra-ui/react";
import CreateRoomModal from "./CreateRoomModal";

export default function Hero() {
  return (
    <Box>
      <AbsoluteCenter>
        <Flex
          align="center"
          justify="space-between"
          direction={{ base: "column", md: "row" }}
        >
          {/* Left Content */}
          <Stack
            spacing={6}
            maxW="lg"
            textAlign={{ base: "center", md: "center" }}
          >
            <Heading as="h1" size="2xl" fontWeight="bold" lineHeight="short">
              Build Beautiful UIs <br /> with Chakra UI 🚀
            </Heading>

            <Text fontSize="lg" color="gray.600">
              A simple, modular, and accessible component library that gives you
              the building blocks to build your React applications faster.
            </Text>

            <Stack
              spacing={4}
              direction={{ base: "column", sm: "row" }}
              justify={{ base: "center", md: "center" }}
            >
             <CreateRoomModal/>
              <Button
                as="a"
                href="/my-rooms"
                variant="outline"
                colorScheme="teal"
                size="lg"
              >
                My Rooms
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </AbsoluteCenter>
    </Box>
  );
}
