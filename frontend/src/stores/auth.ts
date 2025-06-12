import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { User, UserCreate, LoginForm, Token } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isPremium = computed(() => user.value?.is_premium || false)

  // 动作
  const login = async (credentials: LoginForm) => {
    loading.value = true
    try {
      const formData = new FormData()
      formData.append('username', credentials.username)
      formData.append('password', credentials.password)
      
      const response = await api.post<Token>('/auth/login', formData)
      const tokenData = response.data
      
      token.value = tokenData.access_token
      localStorage.setItem('access_token', tokenData.access_token)
      
      // 获取用户信息
      await getCurrentUser()
      
      return { success: true }
    } catch (error: any) {
      console.error('登录失败:', error)
      return { 
        success: false, 
        message: error.response?.data?.detail || '登录失败' 
      }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: UserCreate) => {
    loading.value = true
    try {
      const response = await api.post<User>('/auth/register', userData)
      user.value = response.data
      
      // 注册后自动登录
      const loginResult = await login({
        username: userData.username,
        password: userData.password
      })
      
      return loginResult
    } catch (error: any) {
      console.error('注册失败:', error)
      return { 
        success: false, 
        message: error.response?.data?.detail || '注册失败' 
      }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('access_token')
  }

  const getCurrentUser = async () => {
    if (!token.value) return
    
    try {
      const response = await api.get<User>('/users/me')
      user.value = response.data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      logout()
    }
  }

  // 初始化时获取用户信息
  if (token.value) {
    getCurrentUser()
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isPremium,
    login,
    register,
    logout,
    getCurrentUser
  }
}) 