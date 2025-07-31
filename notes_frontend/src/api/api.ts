import axios from 'axios'

const API_BASE_URL: string = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// PUBLIC_INTERFACE
export async function login(username: string, password: string) {
  /** Authenticates user against backend. Returns the response object. */
  return axiosInstance.post('/auth/login/', { username, password })
}

// PUBLIC_INTERFACE
export async function logout() {
  /** Logs out user from backend. */
  return axiosInstance.post('/auth/logout/')
}

// PUBLIC_INTERFACE
export async function register(username: string, email: string, password: string) {
  /** Registers a new user. */
  return axiosInstance.post('/auth/register/', { username, email, password })
}

// PUBLIC_INTERFACE
export async function fetchNotes(query?: string) {
  /** Fetches notes (optionally filtered by search). */
  let url = '/notes/'
  if (query && query.length > 0) url += `?search=${encodeURIComponent(query)}`
  return axiosInstance.get(url)
}

// PUBLIC_INTERFACE
export async function createNote(note: { title: string; content: string }) {
  /** Creates a new note. */
  return axiosInstance.post('/notes/', note)
}

// PUBLIC_INTERFACE
export async function updateNote(id: number, note: { title: string; content: string }) {
  /** Updates a note by ID. */
  return axiosInstance.put(`/notes/${id}/`, note)
}

// PUBLIC_INTERFACE
export async function deleteNote(id: number) {
  /** Deletes a note by ID. */
  return axiosInstance.delete(`/notes/${id}/`)
}

export default axiosInstance
