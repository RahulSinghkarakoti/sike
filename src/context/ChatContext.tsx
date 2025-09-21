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
import Error from "next/error";
import { createContext, ReactNode, FC, useReducer } from "react";

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatIntialState: InitialStateType = {
  currentChat: null,
  loading: false,
  chatLoading: false,
  chats: [],
  messages: [],
};

const ChatContext = createContext<ChatContextType>({
  messages: [],
  currentChat: null,
  loading: false,
  chatLoading: false,
  chats: [],
  setMessages: () => {},
  setChats: () => {},
  setCurrentChat: () => {},
  closeChat: () => {},
  getChats: () => {},
  joinRoom: (roomSlug) => {},
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

  async function joinRoom(roomSlug: string): Promise<ApiResult> {
    try {
      console.log("-------joinRoom-------");

      const response = await axios.post("/api/join-room", { slug: roomSlug });
      if (response.data.status === 201) {
        console.log(response.data)
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

  return (
    <ChatContext.Provider
      value={{
        messages: state.messages,
        loading: state.loading,
        chatLoading: state.chatLoading,
        chats: state.chats,
        currentChat: state.currentChat,
        joinRoom,
        setMessages,
        setChats,
        setCurrentChat,
        closeChat,
        getChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatProvider };
