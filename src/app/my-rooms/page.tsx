import MyRoomPage from "@/components/MyRoomPage";
import { ChatProvider } from "@/context/ChatContext";
import React from "react";

function page() {
  return (
    <div>
      <ChatProvider>
        <MyRoomPage />
      </ChatProvider>
    </div>
  );
}

export default page;
