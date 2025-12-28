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
  badge: "",
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
  badge: "",
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

  const setSenderBadge = (newBadge: string) => {
    dispatch({ type: "SET_BADGE", payload: newBadge });
  };

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
      const response = await axios.post("/api/create-room", { roomName: name });
      const newRoom = response.data.newRoom;
      setChats([...state.chats, newRoom]);
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
    const secret_fp = Cookies.get("fp");
    socket.emit("join-room", { roomId, userId: secret_fp, username: "rahul" });
  };

 const sendMessage = async (text: string, isRetry = false,  badge?: string | null) => {
  console.log('-------sendMessage-------');
  try {
    const roomId = state?.currentChat?.id;
    if (!roomId || !text.trim()) return;

    dispatch({ type: 'SET_SEND_LOADING', payload: true });

    const response = await axios.post(
      '/api/send-message',
      { roomId, text },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-badge': String(badge || state.badge  ),
        },
        validateStatus: () => true, // ← 1. don’t throw on 403
      }
    );

    if (response.status === 200) {
      dispatch({ type: 'APPEND_MESSAGE', payload: response.data.newMessage });
      dispatch({ type: 'SET_BADGE', payload: response.data.badge });  

      socket.emit('send-message', { roomId, message: response.data.newMessage });
      return;
    }

    if (!isRetry && response.status === 403 && response.data.code === 'stale_badge') {
       const {data} = await axios.get("/api/get-badge");  // ← 2. get new badge
      dispatch({ type: 'SET_BADGE', payload: data.badge }); // ← save it
      return sendMessage(text, true,data.badge); // ← 3. retry once
    }

    throw new Error(response.data.message || 'Send failed');
  } catch (error: any) {
    throw new Error('Error while sending message: ' + error.message);
  } finally {
    dispatch({ type: 'SET_SEND_LOADING', payload: false });
  }
};

  const initializeUniqueBadge = async () => {
    try {
      const res = await axios.get("/api/get-badge");
      if (res.data.status == 200) {
        setSenderBadge(res.data.badge);
      }
      return res;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          "Error Occur While Settting Secret Fingerprint: " + error.message
        );
      } else {
        throw new Error("Error Occur While  Settting Secret Fingerprint");
      }
    }
  };

  useEffect(() => {
    initializeUniqueBadge();
  }, []);

  useEffect(() => {
    const handler = ({
      roomId,
      message,
    }: {
      roomId: string;
      message: Message;
    }) => {
      const secret_fp = Cookies.get("fp");
      if (secret_fp != message.senderId) {
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
        badge: state.badge || "",
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
