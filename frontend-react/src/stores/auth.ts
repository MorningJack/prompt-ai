import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import apiService from '@/lib/api';
import { User, UserLogin, UserCreate, AuthTokens, AuthState } from '@/types';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  refreshAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (credentials: UserLogin) => {
        try {
          set({ isLoading: true });
          
          // 调用登录API
          const tokens = await apiService.login(credentials);
          
          // 获取用户信息
          const user = await apiService.getCurrentUser();
          
          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (userData: UserCreate) => {
        try {
          set({ isLoading: true });
          
          // 调用注册API
          const user = await apiService.register(userData);
          
          set({ isLoading: false });
          
          // 注册成功后自动登录
          await get().login({
            username: userData.username,
            password: userData.password,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          
          // 调用登出API
          await apiService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // 清除状态
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
          });
          
          // 清除cookie
          Cookies.remove('access_token');
        }
      },

      checkAuth: async () => {
        try {
          const token = Cookies.get('access_token');
          
          if (!token) {
            set({
              user: null,
              tokens: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return;
          }

          set({ isLoading: true });
          
          // 验证token并获取用户信息
          const user = await apiService.getCurrentUser();
          
          set({
            user,
            tokens: { access_token: token, token_type: 'bearer' },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Auth check error:', error);
          
          // Token无效，清除状态
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
          });
          
          Cookies.remove('access_token');
        }
      },

      refreshAuth: async () => {
        try {
          const token = Cookies.get('access_token');
          if (!token) {
            throw new Error('No token found');
          }

          // 尝试获取用户信息来验证token
          const user = await apiService.getCurrentUser();
          
          set({
            user,
            tokens: { access_token: token, token_type: 'bearer' },
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Token refresh failed:', error);
          
          // Token无效，清除状态并重定向到登录页
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
          });
          
          Cookies.remove('access_token');
          
          // 如果在浏览器环境，重定向到登录页
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          
          throw error;
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      // 只持久化用户信息，不持久化tokens（tokens存在cookie中）
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // 在hydration时检查认证状态
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 延迟检查认证状态，确保组件已挂载
          setTimeout(() => {
            state.checkAuth();
          }, 100);
        }
      },
    }
  )
);

// 导出便捷的hooks
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    register: store.register,
    logout: store.logout,
    checkAuth: store.checkAuth,
    refreshAuth: store.refreshAuth,
    updateUser: store.updateUser,
  };
};

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading); 