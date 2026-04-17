import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../services/userService'
import type { User } from '../types/user'
import { UsersContext } from './usersContextBase'

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const syncedFromQueryRef = useRef(false)

  const query = useQuery({
    queryKey: ['jsonplaceholder', 'users'],
    queryFn: fetchUsers,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  useEffect(() => {
    const data = query.data
    if (!data || syncedFromQueryRef.current) return
    syncedFromQueryRef.current = true
    queueMicrotask(() => {
      setUsers(data)
    })
  }, [query.data])

  const getUserById = useCallback(
    (id: number) => users.find((u) => u.id === id),
    [users],
  )

  const updateUser = useCallback((updated: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u)),
    )
  }, [])

  const deleteUser = useCallback((id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      users,
      isRemoteLoading: query.isPending && !query.data,
      isRemoteError: query.isError,
      remoteError: query.error ?? null,
      getUserById,
      updateUser,
      deleteUser,
    }),
    [
      users,
      query.isPending,
      query.data,
      query.isError,
      query.error,
      getUserById,
      updateUser,
      deleteUser,
    ],
  )

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  )
}
