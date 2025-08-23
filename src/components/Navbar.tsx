"use client"; // (for Next.js 13+ App Router, skip if using Pages Router or plain React)

import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();


  return (
    <Box bg="teal.500" px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        
        {/* Left: Logo */}
        <Box fontWeight="bold" color="white">Sike</Box>

        {/* Desktop Menu */}
        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          <Link href="/" color="white">Home</Link>
          <Link href="/about" color="white">About</Link>
          <Link href="/contact" color="white">Contact</Link>
        </HStack>

        

        {/* Mobile Menu Button */}
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
      </Flex>

      {/* Mobile Menu */}
      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            <Link href="/" color="white">Home</Link>
            <Link href="/about" color="white">About</Link>
            <Link href="/contact" color="white">Contact</Link>
 
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
