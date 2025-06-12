// 用户相关类型
export interface User {
  id: number
  username: string
  email: string
  avatar_url?: string
  is_active: boolean
  is_premium: boolean
  created_at: string
  updated_at: string
}

export interface UserCreate {
  username: string
  email: string
  password: string
}

export interface LoginForm {
  username: string
  password: string
}

export interface Token {
  access_token: string
  token_type: string
}

// 提示词相关类型
export interface Prompt {
  id: number
  name_zh: string
  name_en?: string
  aliases?: string[]
  description?: string
  content: string
  example_input?: string
  example_output?: string
  usage_tips?: string
  category_id: number
  tags?: string[]
  supported_models?: string[]
  model_types?: string[]
  use_cases?: string[]
  is_public: boolean
  is_featured: boolean
  status: string
  rating_avg: number
  rating_count: number
  usage_count: number
  author_id: number
  created_at: string
  updated_at: string
}

export interface PromptCreate {
  name_zh: string
  name_en?: string
  aliases?: string[]
  description?: string
  content: string
  example_input?: string
  example_output?: string
  usage_tips?: string
  category_id: number
  tags?: string[]
  supported_models?: string[]
  model_types?: string[]
  use_cases?: string[]
  is_public?: boolean
}

export interface PromptList {
  items: Prompt[]
  total: number
  page: number
  size: number
  pages: number
}

// 分类相关类型
export interface Category {
  id: number
  name: string
  description?: string
  parent_id?: number
  sort_order: number
  icon?: string
  is_active: boolean
  children?: Category[]
}

export interface CategoryCreate {
  name: string
  description?: string
  parent_id?: number
  sort_order?: number
  icon?: string
  is_active?: boolean
}

// API响应类型
export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
} 