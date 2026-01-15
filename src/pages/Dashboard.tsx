import { useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/services/authStore'
import { useChatStore } from '@/services/chatStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MessageSquare, LogOut, Plus, User } from 'lucide-react'

export function Dashboard() {
  const { user, logout } = useAuthStore()
  const { channels, setActiveChannel, createChannel } = useChatStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Sync URL with store if needed, or vice-versa
    // Simple sync: if we are at /app, maybe redirect to first channel?
  }, [location])

  const handleCreateChannel = () => {
    const name = prompt('Channel name:')
    if (name) {
      createChannel(name)
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/20 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="font-bold text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            ChatApp
          </h1>
          <Button variant="ghost" size="icon" onClick={() => navigate('/app/profile')}>
            <User className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex justify-between items-center">
            Channels
            <button onClick={handleCreateChannel} className="hover:text-primary transition-colors">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {channels.map((channel) => (
            <NavLink
              key={channel.id}
              to={`/app/c/${channel.id}`}
              className={({ isActive }) => cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={() => setActiveChannel(channel.id)}
            >
              <span className="text-muted-foreground">#</span>
              {channel.name}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {user?.name?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
