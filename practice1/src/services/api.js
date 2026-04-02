import axios from 'axios'
import { toast } from 'sonner'

const TOKEN_STORAGE_KEY = 'auth_token'

/**
 * Axios instance for JSONPlaceholder (or any API using VITE_API_URL).
 * Interceptors attach optional Bearer auth and surface 401 globally.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  async (config) => {
    const token =
      import.meta.env.VITE_API_TOKEN || localStorage.getItem(TOKEN_STORAGE_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  async (error) => Promise.reject(error),
)

api.interceptors.response.use(
  async (response) => response,
  async (error) => {
    const status = error.response?.status
    if (status === 401) {
      toast.error('Session expired or unauthorized. Please sign in again.')
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
    return Promise.reject(error)
  },
)

export default api
