<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- 头部标识 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">提示词管理平台</h1>
        <p class="text-gray-600">登录您的账户</p>
      </div>

      <!-- 登录表单 -->
      <div class="card">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- 用户名输入 -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              用户名或邮箱
            </label>
            <div class="relative">
              <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="input-field pl-10"
                placeholder="请输入用户名或邮箱"
                :disabled="authStore.loading"
              />
            </div>
          </div>

          <!-- 密码输入 -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <div class="relative">
              <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field pl-10 pr-10"
                placeholder="请输入密码"
                :disabled="authStore.loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- 错误信息 -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn-primary w-full relative"
          >
            <span v-if="authStore.loading" class="flex items-center justify-center">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              登录中...
            </span>
            <span v-else>登录</span>
          </button>
        </form>

        <!-- 分隔线 -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">或</span>
          </div>
        </div>

        <!-- 注册链接 -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            还没有账户？
            <router-link
              to="/register"
              class="text-primary-600 hover:text-primary-700 font-medium"
            >
              立即注册
            </router-link>
          </p>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="text-center mt-8 text-sm text-gray-500">
        <p>© 2024 提示词管理平台. 保留所有权利.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginForm } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const form = reactive<LoginForm>({
  username: '',
  password: ''
})

// 组件状态
const showPassword = ref(false)
const error = ref('')

// 处理登录
const handleLogin = async () => {
  error.value = ''
  
  const result = await authStore.login(form)
  
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.message || '登录失败'
  }
}
</script> 