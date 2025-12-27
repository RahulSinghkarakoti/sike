"use client";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, HStack, IconButton, Input } from "@chakra-ui/react";
import React, { KeyboardEvent, useEffect, useState } from "react";

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

  useEffect(() => {
  if (!sendLoading) {
    console.log("Before clearing:", message);
    setMessage(""); // ✅ clears input
  }
}, [sendLoading]);

const handleKeyDown = (e:KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSubmit();
  }
};

  return (
    <>
    <HStack  p={4} borderTop="1px" borderColor="gray.200" bg="white" spacing={2}>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
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
