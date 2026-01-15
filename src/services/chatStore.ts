import { create } from 'zustand'

export interface Message {
  id: string
  text: string
  senderId: string
  senderName: string
  timestamp: number
}

export interface Channel {
  id: string
  name: string
  lastMessage?: string
}

interface ChatState {
  channels: Channel[]
  messages: Record<string, Message[]>
  activeChannelId: string | null
  isLoading: boolean
  
  setActiveChannel: (id: string) => void
  sendMessage: (text: string, senderId: string, senderName: string) => void
  createChannel: (name: string) => void
}

const INITIAL_CHANNELS = [
  { id: '1', name: 'General', lastMessage: 'Welcome!' },
  { id: '2', name: 'Random', lastMessage: 'Hello world' },
]

const INITIAL_MESSAGES = {
  '1': [
    { id: 'm1', text: 'Welcome to the General channel!', senderId: 'system', senderName: 'System', timestamp: Date.now() - 100000 },
  ],
  '2': [
    { id: 'm2', text: 'Anyone here?', senderId: '2', senderName: 'Bob', timestamp: Date.now() - 50000 },
  ],
}

export const useChatStore = create<ChatState>((set, get) => ({
  channels: INITIAL_CHANNELS,
  messages: INITIAL_MESSAGES,
  activeChannelId: null,
  isLoading: false,

  setActiveChannel: (id) => set({ activeChannelId: id }),

  sendMessage: (text, senderId, senderName) => {
    const { activeChannelId, messages } = get()
    if (!activeChannelId) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      senderId,
      senderName,
      timestamp: Date.now(),
    }

    const channelMessages = messages[activeChannelId] || []
    
    set({
      messages: {
        ...messages,
        [activeChannelId]: [...channelMessages, newMessage],
      },
    })
    
    // Simulate reply
    if (senderId !== 'system') {
        setTimeout(() => {
             const reply: Message = {
                id: (Date.now() + 1).toString(),
                text: `You said: "${text}"`,
                senderId: 'system',
                senderName: 'Bot',
                timestamp: Date.now(),
            }
             const currentMessages = get().messages[activeChannelId] || []
             set({
                 messages: {
                     ...get().messages,
                     [activeChannelId]: [...currentMessages, reply]
                 }
             })
        }, 1000)
    }
  },

  createChannel: (name) => {
    const newChannel = { id: Date.now().toString(), name }
    set((state) => ({
      channels: [...state.channels, newChannel],
      messages: { ...state.messages, [newChannel.id]: [] },
      activeChannelId: newChannel.id
    }))
  },
}))
