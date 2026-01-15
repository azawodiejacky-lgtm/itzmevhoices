import { create } from 'zustand'

export interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string) => Promise<void>
  signup: (email: string, name: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('user'),
  isLoading: false,

  login: async (email: string) => {
    set({ isLoading: true })
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    const user = { id: '1', name: email.split('@')[0], email }
    localStorage.setItem('user', JSON.stringify(user))
    
    set({ user, isAuthenticated: true, isLoading: false })
  },

  signup: async (email: string, name: string) => {
    set({ isLoading: true })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    const user = { id: '1', name, email }
    localStorage.setItem('user', JSON.stringify(user))
    
    set({ user, isAuthenticated: true, isLoading: false })
  },

  logout: () => {
    localStorage.removeItem('user')
    set({ user: null, isAuthenticated: false })
  },
}))
