"use client";

import { chatReducer } from "@/components/reducers/chat-reducer";
import {
  ApiResult,
  Chat,
  ChatContextType,
  InitialStateType,
  Message,
} from "@/types/chat";
import axios from "axios";
import { createContext, ReactNode, FC, useReducer, useEffect } from "react";
import { socket } from "@/lib/socketClient";
import Cookies from "js-cookie";

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatIntialState: InitialStateType = {
  currentChat: null,
  loading: false,
  chatLoading: false,
  messageLoading: false,
  sendLoading: false,
  chats: [],
  messages: [],
};

const ChatContext = createContext<ChatContextType>({
  messages: [],
  currentChat: null,
  loading: false,
  messageLoading: false,
  chatLoading: false,
  sendLoading: false,
  chats: [],
  setMessages: () => {},
  setChats: () => {},
  setCurrentChat: () => {},
  closeChat: () => {},
  getChats: () => {},
  joinRoom: (roomSlug) => {},
  sendMessage: (text) => {},
  createRoom: (name) => {},
});

const ChatProvider = ({ children }: ChatProviderProps) => {
  const [state, dispatch] = useReducer(chatReducer, ChatIntialState);

  const setMessages = (newMessages: Message[]) => {
    dispatch({ type: "SET_MESSAGES", payload: newMessages });
  };

  const setChats = (newChats: Chat[]) => {
    dispatch({ type: "SET_CHATS", payload: newChats });
  };

  const setCurrentChat = (chat: Chat) => {
    dispatch({ type: "SET_CURRENT_CHAT", payload: chat });
    joinWSRoom(chat.id);
    getMessages(chat.id);
  };

  const closeChat = () => {
    dispatch({ type: "SET_CURRENT_CHAT", payload: null });
  };

  const getChats = async () => {
    console.log("-------getChats-------");
    try {
      dispatch({ type: "SET_CHAT_LOADING", payload: true });
      const response = await axios.get("/api/my-rooms");

      const chats = response.data.rooms;
      setChats(chats);
      dispatch({ type: "SET_CHAT_LOADING", payload: false });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error Occur While Fetching Chats: " + error.message);
      } else {
        throw new Error("Error Occur While Fetching Chats");
      }
    }
  };

  const getMessages = async (roomId: String) => {
    console.log("-------getMessages-------");
    try {
      dispatch({ type: "SET_MESSAGES_LOADING", payload: true });

      const response = await axios.post("/api/room-messages", {
        room_id: roomId,
      });
      const messages = response.data.messages;
      setMessages(messages);
      dispatch({ type: "SET_MESSAGES_LOADING", payload: false });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error Occur While Fetching Chats: " + error.message);
      } else {
        throw new Error("Error Occur While Fetching Chats");
      }
    }
  };

  const createRoom = async (name: string) => {
    try {
      console.log("-------createRoom-------");
      const response = await axios.post("/api/create-room",{roomName:name});
      const newRoom = response.data.newRoom;
      setChats([...state.chats,newRoom]);
        return { success: true, message: response.data.message };

    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error Occur While Creating Room: " + error.message);
      } else {
        throw new Error("Error Occur While Creating Room");
      }
    }
  };

  async function joinRoom(roomSlug: string): Promise<ApiResult> {
    try {
      console.log("-------joinRoom-------");

      const response = await axios.post("/api/join-room", { slug: roomSlug });
      if (response.data.status === 201) {
        console.log(response.data);
        const newChat = response.data.chat;
        setChats([...state.chats, newChat]);
        dispatch({ type: "SET_CURRENT_CHAT", payload: newChat });
        return { success: true, message: response.data.message, data: newChat };
      }

      return { success: false, message: response.data.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error joining room" };
    }
  }

  const joinWSRoom = async (roomId: string) => {
    console.log("joinSocketRoom");
    const user_id = Cookies.get("anon_id");
    console.log(user_id);
    socket.emit("join-room", { roomId, userId: user_id, username: "rahul" });
  };

  const sendMessage = async (text: string) => {
    console.log("-------sendMessage-------");
    try {
      const roomId = state?.currentChat?.id;
      if (!roomId || !text.trim()) return;

      dispatch({ type: "SET_SEND_LOADING", payload: true });
      const response = await axios.post("/api/send-message", { roomId, text });
      dispatch({ type: "APPEND_MESSAGE", payload: response.data.newMessage });

      console.log(state.messages);
      socket.emit("send-message", {
        roomId,
        message: response.data.newMessage,
      });
      dispatch({ type: "SET_SEND_LOADING", payload: false });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error Occur While sending Message: " + error.message);
      } else {
        throw new Error("Error Occur While  sending Message");
      }
    }
  };

  useEffect(() => {
    const handler = ({
      roomId,
      message,
    }: {
      roomId: string;
      message: Message;
    }) => {
      const user_id = Cookies.get("anon_id");
      if (user_id != message.senderId) {
        dispatch({ type: "APPEND_MESSAGE", payload: message });
      }
    };

    socket.on("messageSent", handler);
    console.log("Listeners:", socket.listeners("messageSent").length);
 console.log("Socket id:", socket.id);


    return () => {
      socket.off("messageSent", handler); // ✅ remove only this listener
    };
  }, [socket]);

  return (
    <ChatContext.Provider
      value={{
        messages: state.messages || [],
        loading: state.loading,
        chatLoading: state.chatLoading,
        messageLoading: state.messageLoading,
        sendLoading: state.sendLoading,
        chats: state.chats,
        currentChat: state.currentChat,
        joinRoom,
        setMessages,
        setChats,
        setCurrentChat,
        closeChat,
        getChats,
        sendMessage,
        createRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatProvider };
