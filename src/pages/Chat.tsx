import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useChatStore } from '@/services/chatStore'
import { useAuthStore } from '@/services/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Chat() {
  const { channelId } = useParams()
  const { messages, channels, sendMessage, setActiveChannel } = useChatStore()
  const { user } = useAuthStore()
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const currentChannel = channels.find(c => c.id === channelId)
  const channelMessages = channelId ? (messages[channelId] || []) : []

  useEffect(() => {
    if (channelId) {
      setActiveChannel(channelId)
    }
  }, [channelId, setActiveChannel])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [channelMessages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !user || !channelId) return

    sendMessage(inputValue, user.id, user.name)
    setInputValue('')
  }

  if (!currentChannel) {
    return <div className="flex-1 flex items-center justify-center text-muted-foreground">Channel not found</div>
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-14 border-b flex items-center px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Hash className="h-5 w-5 text-muted-foreground mr-2" />
        <h2 className="font-semibold">{currentChannel.name}</h2>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {channelMessages.map((msg) => {
          const isMe = msg.senderId === user?.id
          return (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[80%]",
                isMe ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {!isMe && <span className="text-xs font-semibold text-muted-foreground">{msg.senderName}</span>}
                <span className="text-[10px] text-muted-foreground/60">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div
                className={cn(
                  "px-4 py-2 rounded-lg text-sm",
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                )}
              >
                {msg.text}
              </div>
            </div>
          )
        })}
        {channelMessages.length === 0 && (
          <div className="text-center text-muted-foreground mt-10">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message #${currentChannel.name}`}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
