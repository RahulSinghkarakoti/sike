"use client";  // Ensure this component runs only on the client

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { useState, useEffect } from "react";

export function Provider(props: ColorModeProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render nothing on server to prevent hydration mismatch
    return null;
  }

  return (
    <ChakraProvider>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
