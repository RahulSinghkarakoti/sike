'use client'

import { InitialStateType, ChatAction } from "@/types/chat"




export const chatReducer = (state: InitialStateType, action: ChatAction) => {
    switch (action.type) {
        case "SET_CURRENT_CHAT":
            return { ...state, currentChat: action.payload }
        case "SET_LOADING":
            return { ...state, loading: action.payload }
        case "SET_CHAT_LOADING":
            return { ...state, chatLoading: action.payload }
        case "SET_CHATS":
            return { ...state, chats: action.payload }
        case "SET_MESSAGES_LOADING":
            return { ...state, messageLoading: action.payload }
        case "SET_SEND_LOADING":
            return { ...state, sendLoading: action.payload }
        case "SET_MESSAGES":
            return { ...state, messages: action.payload }  
        case "APPEND_MESSAGE":
              return { ...state, messages: [...state.messages.slice(-200), action.payload], }
        case "UPDATE_SEEN":
            return {
                ...state,
                messages: state.messages.map((msg) => {
                    if (msg.id === action.payload.id) {
                        return { ...msg, status: 'seen' as const }
                    }
                    return msg
                })
            }
        default:
            throw new Error("No Action of " + (action as any).type)

    }
}