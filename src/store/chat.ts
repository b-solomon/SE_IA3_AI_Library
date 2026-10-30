import { create } from 'zustand'
import type { ChatMessage, Conversation } from '@/types'

interface ChatState {
  isOpen: boolean
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: ChatMessage[]
  isTyping: boolean
  error: string | null
  modelUsed: string | null

  toggleChat: () => void
  setChatOpen: (open: boolean) => void
  setConversations: (conversations: Conversation[]) => void
  setCurrentConversation: (conversation: Conversation | null) => void
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  setTyping: (typing: boolean) => void
  setError: (error: string | null) => void
  setModelUsed: (model: string | null) => void
  reset: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  conversations: [],
  currentConversation: null,
  messages: [],
  isTyping: false,
  error: null,
  modelUsed: null,

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setChatOpen: (open) => set({ isOpen: open }),
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      isTyping: false,
    })),
  setTyping: (typing) => set({ isTyping: typing }),
  setError: (error) => set({ error, isTyping: false }),
  setModelUsed: (model) => set({ modelUsed: model }),
  reset: () =>
    set({
      currentConversation: null,
      messages: [],
      isTyping: false,
      error: null,
      modelUsed: null,
    }),
}))
