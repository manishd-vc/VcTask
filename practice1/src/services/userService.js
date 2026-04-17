import api from './api'

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} username
 * @property {string} email
 * @property {string} [phone]
 * @property {string} [website]
 */

/**
 * @returns {Promise<User[]>}
 */
export async function fetchUsers() {
  const { data } = await api.get('/users')
  return data
}

/**
 * @param {number} id
 * @returns {Promise<User>}
 */
export async function fetchUser(id) {
  const { data } = await api.get(`/users/${id}`)
  return data
}

/**
 * @param {Omit<User, 'id'>} payload
 * @returns {Promise<User>}
 */
export async function createUser(payload) {
  const { data } = await api.post('/users', payload)
  return data
}

/**
 * @param {number} id
 * @param {Partial<User>} payload
 * @returns {Promise<User>}
 */
export async function updateUser(id, payload) {
  const { data } = await api.put(`/users/${id}`, payload)
  return data
}

/**
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteUser(id) {
  await api.delete(`/users/${id}`)
}
