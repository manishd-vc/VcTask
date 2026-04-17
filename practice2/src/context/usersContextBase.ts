import { createContext, useContext } from 'react'
import type { User } from '../types/user'

export type UsersContextValue = {
  users: User[]
  isRemoteLoading: boolean
  isRemoteError: boolean
  remoteError: Error | null
  getUserById: (id: number) => User | undefined
  updateUser: (user: User) => void
  deleteUser: (id: number) => void
}

export const UsersContext = createContext<UsersContextValue | null>(null)

export function useUsersContext() {
  const ctx = useContext(UsersContext)
  if (!ctx) {
    throw new Error('useUsersContext must be used within UsersProvider')
  }
  return ctx
}
