import type { User } from '../types/user'

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(USERS_URL)
  if (!res.ok) throw new Error(`Failed to load users: ${res.status}`)
  return res.json() as Promise<User[]>
}
