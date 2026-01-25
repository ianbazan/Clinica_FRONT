import apiFetch from './client'

export interface RegisterPayload {
  user: {
    email: string
    password: string
    isActive: boolean
  }
  guardian: {
    dni: string
    name: string
    lastName: string
  }
}

export async function registerUser(body: RegisterPayload) {
  return apiFetch('/api/auth', { method: 'POST', body: JSON.stringify(body) })
}

export default { registerUser }
