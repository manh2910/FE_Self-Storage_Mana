import { useState, useEffect, useCallback } from 'react'
import type { User, UserRole } from '../types/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User
        setState({ user, token, isAuthenticated: true, isLoading: false })
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
      }
    } else {
      setState((s) => ({ ...s, isLoading: false }))
    }
  }, [])

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setState({ user, token, isAuthenticated: true, isLoading: false })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
  }, [])

  return {
    ...state,
    login,
    logout,
  }
}

export function hasRole(user: User | null, roles: UserRole[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}
