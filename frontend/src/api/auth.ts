import { api } from './client'

export type LoginInput = { email: string; password: string }
export type RegisterInput = { username: string; email: string; password: string }

export const authApi = {
  login(payload: LoginInput) {
    return api.post('/users/login', { user: payload })
  },
  register(payload: RegisterInput) {
    return api.post('/users', { user: payload })
  },
  currentUser() {
    return api.get('/user')
  },
}
