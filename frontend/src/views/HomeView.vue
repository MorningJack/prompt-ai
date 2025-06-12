<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- 左侧标识 -->
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">提示词管理平台</h1>
          </div>

          <!-- 右侧用户菜单 -->
          <div class="flex items-center space-x-4">
            <template v-if="authStore.isAuthenticated">
              <span class="text-sm text-gray-700">
                欢迎，{{ authStore.user?.username }}
              </span>
              <button @click="handleLogout" class="btn-secondary">
                <i class="fas fa-sign-out-alt mr-2"></i>
                退出登录
              </button>
            </template>
            <template v-else>
              <router-link to="/login" class="btn-primary">
                <i class="fas fa-sign-in-alt mr-2"></i>
                登录
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 欢迎区域 -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          欢迎使用提示词管理平台
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          一个现代化的AI提示词管理平台，帮助您创建、管理、分享和发现高质量的提示词。
        </p>
      </div>

      <!-- 功能卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div class="card text-center">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-plus-circle text-2xl text-primary-600"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">创建提示词</h3>
          <p class="text-gray-600">
            轻松创建和编辑AI提示词，支持多种模型和使用场景
          </p>
        </div>

        <div class="card text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-share-alt text-2xl text-green-600"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">分享发现</h3>
          <p class="text-gray-600">
            与社区分享优质提示词，发现他人的创意作品
          </p>
        </div>

        <div class="card text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-star text-2xl text-blue-600"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">精选推荐</h3>
          <p class="text-gray-600">
            平台精选高质量提示词，助您快速找到最佳解决方案
          </p>
        </div>
      </div>

      <!-- 快速开始 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <h3 class="text-2xl font-semibold text-gray-900 mb-4">开始您的创作之旅</h3>
        <p class="text-gray-600 mb-6">
          立即注册账户，开始创建和管理您的AI提示词库
        </p>
        <div class="space-x-4">
          <router-link v-if="!authStore.isAuthenticated" to="/register" class="btn-primary">
            <i class="fas fa-user-plus mr-2"></i>
            立即注册
          </router-link>
          <router-link to="/prompts" class="btn-secondary">
            <i class="fas fa-search mr-2"></i>
            浏览提示词
          </router-link>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-white border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-500">
          <p>© 2024 提示词管理平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>
