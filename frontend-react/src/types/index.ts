// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

// 分类相关类型
export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  sort_order: number;
  icon?: string;
  is_active: boolean;
  children?: Category[];
}

export interface CategoryCreate {
  name: string;
  description?: string;
  parent_id?: number;
  sort_order?: number;
  icon?: string;
}

// 提示词相关类型
export interface Prompt {
  id: number;
  name_zh: string;
  name_en?: string;
  aliases?: string[];
  description?: string;
  content: string;
  example_input?: string;
  example_output?: string;
  usage_tips?: string;
  category_id: number;
  category?: Category;
  tags?: string[];
  supported_models?: string[];
  model_types?: string[];
  use_cases?: string[];
  is_public: boolean;
  is_featured: boolean;
  status: string;
  rating_avg: number;
  rating_count: number;
  usage_count: number;
  author_id: number;
  author?: User;
  created_at: string;
  updated_at: string;
}

export interface PromptCreate {
  name_zh: string;
  name_en?: string;
  aliases?: string[];
  description?: string;
  content: string;
  example_input?: string;
  example_output?: string;
  usage_tips?: string;
  category_id: number;
  tags?: string[];
  supported_models?: string[];
  model_types?: string[];
  use_cases?: string[];
  is_public?: boolean;
}

export interface PromptUpdate {
  name_zh?: string;
  name_en?: string;
  aliases?: string[];
  description?: string;
  content?: string;
  example_input?: string;
  example_output?: string;
  usage_tips?: string;
  category_id?: number;
  tags?: string[];
  supported_models?: string[];
  model_types?: string[];
  use_cases?: string[];
  is_public?: boolean;
}

// 评分相关类型
export interface Rating {
  id: number;
  prompt_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface RatingCreate {
  prompt_id: number;
  rating: number;
  comment?: string;
}

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// 认证相关类型
export interface AuthTokens {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 搜索和过滤类型
export interface SearchParams {
  page?: number;
  size?: number;
  category_id?: number;
  search?: string;
  is_public?: boolean;
  is_featured?: boolean;
}

// 统计数据类型
export interface Stats {
  total_prompts: number;
  total_users: number;
  total_categories: number;
  featured_prompts: number;
}

// 常用的模型兼容性选项
export const MODEL_COMPATIBILITY_OPTIONS = [
  'GPT-4',
  'GPT-3.5',
  'Claude',
  'Gemini',
  'LLaMA',
  'ChatGLM',
  'Qwen',
  'Baichuan',
  'DeepSeek',
  'Other'
] as const;

// 常用的使用场景选项
export const USAGE_SCENARIO_OPTIONS = [
  '写作助手',
  '代码生成',
  '数据分析',
  '创意设计',
  '学习教育',
  '商务办公',
  '娱乐聊天',
  '专业咨询',
  '其他'
] as const;

export type ModelCompatibility = typeof MODEL_COMPATIBILITY_OPTIONS[number];
export type UsageScenario = typeof USAGE_SCENARIO_OPTIONS[number]; 