import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi, type LoginInput, type RegisterInput } from '../api/auth'

type User = {
  email: string
  token: string
  username: string
  bio: string | null
  image: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function setToken(token: string) {
    localStorage.setItem('realworld_token', token)
  }

  function clearToken() {
    localStorage.removeItem('realworld_token')
  }

  async function login(payload: LoginInput) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authApi.login(payload)
      user.value = data.user
      setToken(data.user.token)
      return data.user as User
    } catch (e: any) {
      error.value = e?.response?.data?.errors ? JSON.stringify(e.response.data.errors) : 'Login failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterInput) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authApi.register(payload)
      user.value = data.user
      setToken(data.user.token)
      return data.user as User
    } catch (e: any) {
      error.value = e?.response?.data?.errors ? JSON.stringify(e.response.data.errors) : 'Register failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentUser() {
    const token = localStorage.getItem('realworld_token')
    if (!token) return null
    try {
      const { data } = await authApi.currentUser()
      user.value = data.user
      return data.user as User
    } catch {
      user.value = null
      clearToken()
      return null
    }
  }

  function logout() {
    user.value = null
    clearToken()
  }

  return { user, loading, error, login, register, fetchCurrentUser, logout }
})
