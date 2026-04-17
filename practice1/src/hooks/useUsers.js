import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createUser,
  deleteUser,
  fetchUser,
  fetchUsers,
  updateUser,
} from '../services/userService'

const USERS_KEY = ['users']

/** @param {number} id */
export function userDetailQueryKey(id) {
  return ['user', id]
}

/**
 * JSONPlaceholder does not persist writes: refetching GET /users after POST
 * would drop the "new" user. We merge mutation results into the cache instead.
 */
export function useUserMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: async (payload) => createUser(payload),
    onSuccess: (created) => {
      queryClient.setQueryData(USERS_KEY, (prev) => {
        const list = Array.isArray(prev) ? prev : []
        return [...list, created]
      })
      queryClient.setQueryData(userDetailQueryKey(created.id), created)
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => updateUser(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(USERS_KEY, (prev) => {
        const list = Array.isArray(prev) ? prev : []
        return list.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
      })
      queryClient.setQueryData(userDetailQueryKey(updated.id), (prev) =>
        prev && typeof prev === 'object' ? { ...prev, ...updated } : updated
      )
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
      queryClient.removeQueries({ queryKey: userDetailQueryKey(deletedId) })
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}

export function useUsers() {
  const usersQuery = useQuery({
    queryKey: USERS_KEY,
    queryFn: async () => fetchUsers(),
    staleTime: 60000,
  })
  const mutations = useUserMutations()

  return {
    usersQuery,
    ...mutations,
  }
}

/**
 * @param {string | undefined} userIdParam - route param (e.g. from useParams)
 */
export function useUserDetail(userIdParam) {
  const id = Number(userIdParam)
  const enabled = Number.isFinite(id) && id > 0

  return useQuery({
    queryKey: userDetailQueryKey(id),
    queryFn: () => fetchUser(id),
    enabled,
    staleTime: 60000,
  })
}
