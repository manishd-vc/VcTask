import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from '../services/userService'

const USERS_KEY = ['users']

/**
 * JSONPlaceholder does not persist writes: refetching GET /users after POST
 * would drop the "new" user. We merge mutation results into the cache instead.
 */
export function useUsers() {
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: USERS_KEY,
    queryFn: async () => fetchUsers(),
    staleTime: 60000,
  })

  const createMutation = useMutation({
    mutationFn: async (payload) => createUser(payload),
    onSuccess: (created) => {
      queryClient.setQueryData(USERS_KEY, (prev) => {
        const list = Array.isArray(prev) ? prev : []
        return [...list, created]
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => updateUser(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(USERS_KEY, (prev) => {
        const list = Array.isArray(prev) ? prev : []
        return list.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await deleteUser(id)
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(USERS_KEY, (prev) => {
        const list = Array.isArray(prev) ? prev : []
        return list.filter((u) => u.id !== deletedId)
      })
    },
  })

  return {
    usersQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
