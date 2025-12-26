"use client";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, HStack, IconButton, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type MessageInputProps = {
  sendLoading: boolean;
  sendMessage: (text: string) => Promise<void> | void;
};

function MessageInput({ sendLoading, sendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const handleSubmit=async()=>{
    const trimmed = message.trim();
    if (!trimmed || sendLoading) return;

    await sendMessage(trimmed);
    console.log('Sent:', trimmed);
  }

  useEffect(()=>{
    if(!sendLoading) setMessage("")
  },[sendLoading])

  return (
    <>
    <HStack  p={4} borderTop="1px" borderColor="gray.200" bg="white" spacing={2}>
      <Input
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message ..."
      />
      <Button
    //   isDisabled={sendLoading || !message.trim()}
        isLoading={sendLoading}
        onClick={handleSubmit}
        colorScheme="teal"
        aria-label="Send"
      >
        Send</Button>
    </HStack>
    </>
  );
}

export default MessageInput;
