export type ApiResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};
export interface Message {
    id: string;
    text: string;
    senderId:string;
    roomId:number;
    created_at: string;
}

export interface Chat {
    id: string;
    name: string;
    last_message_at: number;
    lock: boolean,
    slug:string,
    created_at: string,
    updated_at: string,
    createdById: string,
    status: 'online' | 'offline';
}

export interface InitialStateType {
    currentChat: Chat | null;
    loading: boolean;
    chatLoading: boolean;
    chats: Chat[];          // Adjust type if needed (e.g., Chat[])
    messageLoading: boolean;
    sendLoading:boolean;
    messages: Message[];
}

export type ChatAction =
    | { type: "SET_CURRENT_CHAT"; payload: Chat | null }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_CHAT_LOADING"; payload: boolean }
    | { type: "SET_CHATS"; payload: Chat[] }
    | { type: "SET_MESSAGES"; payload: Message[] }
    | { type: "SET_MESSAGES_LOADING"; payload: boolean }
    | { type: "SET_SEND_LOADING"; payload: boolean }
    | { type: "UPDATE_SEEN"; payload: { id: string } };

export interface ChatContextType {
    messages: Message[];
    currentChat: Chat | null;
    loading: boolean;
    chatLoading: boolean;
    messageLoading: boolean;
    sendLoading:boolean;
    chats: Chat[];
    setMessages: (newMessages: Message[]) => void;
    setChats: (newChats: Chat[]) => void
    setCurrentChat: (chat: Chat) => void
    closeChat: () => void
    getChats: () => void
    joinRoom: (roomSlug:string) => void
    sendMessage: (text:string) => void
}

