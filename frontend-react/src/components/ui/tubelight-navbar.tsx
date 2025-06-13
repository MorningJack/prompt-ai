"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/stores/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Home,
  Library,
  User,
  Star,
  Plus,
  Settings,
  LogOut,
  Code,
  Shield,
  Globe,
  Copy,
  Download,
  ExternalLink,
  Search,
  Eye,
  Filter,
  TrendingUp,
  Activity,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

// MCP服务配置弹窗组件
function MCPServiceDialog() {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<'personal' | 'platform'>('personal');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const personalConfig = `{
  "mcpServers": {
    "prompt-ai-personal": {
      "command": "node",
      "args": ["/path/to/prompt-ai/mcp-service/dist/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:8000",
        "AUTH_TOKEN": "your-jwt-token"
      }
    }
  }
}`;

  const platformConfig = `{
  "mcpServers": {
    "prompt-ai-platform": {
      "command": "node",
      "args": ["/path/to/prompt-ai/mcp-service/dist/platform.js"],
      "env": {
        "API_BASE_URL": "http://localhost:8000"
      }
    }
  }
}`;

  const personalTools = [
    {
      name: "search_prompts",
      description: "搜索用户所有提示词",
      icon: Search,
      color: "text-blue-400"
    },
    {
      name: "get_user_prompts",
      description: "获取用户所有提示词",
      icon: User,
      color: "text-orange-400"
    },
    {
      name: "create_prompt",
      description: "创建新提示词",
      icon: Plus,
      color: "text-cyan-400"
    },
    {
      name: "get_prompt_by_id",
      description: "获取提示词详情",
      icon: Eye,
      color: "text-green-400"
    },
    {
      name: "get_categories",
      description: "获取分类列表",
      icon: Filter,
      color: "text-purple-400"
    },
    {
      name: "get_featured_prompts",
      description: "获取精选提示词",
      icon: Star,
      color: "text-yellow-400"
    }
  ];

  const platformTools = [
    {
      name: "get_featured_prompts",
      description: "获取平台精选提示词",
      icon: Star,
      color: "text-yellow-400"
    },
    {
      name: "search_featured_prompts",
      description: "搜索精选提示词",
      icon: Search,
      color: "text-pink-400"
    },
    {
      name: "get_trending_prompts",
      description: "获取热门提示词",
      icon: TrendingUp,
      color: "text-red-400"
    },
    {
      name: "get_prompt_by_id",
      description: "获取公开提示词详情",
      icon: Eye,
      color: "text-green-400"
    },
    {
      name: "get_categories",
      description: "获取分类列表",
      icon: Filter,
      color: "text-purple-400"
    }
  ];

  const currentConfig = selectedService === 'personal' ? personalConfig : platformConfig;
  const currentTools = selectedService === 'personal' ? personalTools : platformTools;

  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button 
        variant="ghost" 
        size="sm"
        className="text-slate-200 hover:text-white hover:bg-primary/10 rounded-full p-3"
        title="MCP服务"
      >
        <Code className="h-4 w-4" />
      </Button>
    </DialogTrigger>
    <DialogContent className="w-[98vw] max-w-[1600px] max-h-[95vh] overflow-hidden bg-slate-900 border-slate-700">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-slate-100 flex items-center">
          <Code className="h-5 w-5 mr-2 text-cyan-400" />
          MCP 服务配置
        </DialogTitle>
        <DialogDescription className="text-slate-400">
          在 Claude Desktop 中集成您的提示词服务，支持个人和平台两种模式
        </DialogDescription>
      </DialogHeader>
  
      <div className="flex h-[calc(95vh-120px)] gap-6">
        {/* 左侧配置区域 - 增加宽度占比 */}
        <div className="flex-[2] min-w-0 overflow-y-auto">
          <div className="space-y-6">
            {/* 服务选择 */}
            <div className="flex space-x-2 bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setSelectedService('personal')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedService === 'personal'
                    ? 'bg-cyan-500 text-white'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                <Shield className="h-4 w-4 mr-2 inline" />
                个人服务
              </button>
              <button
                onClick={() => setSelectedService('platform')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedService === 'platform'
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                <Globe className="h-4 w-4 mr-2 inline" />
                平台服务
              </button>
            </div>
  
            {/* 服务信息 */}
            <div className={`p-6 rounded-lg border ${
              selectedService === 'personal' 
                ? 'bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20' 
                : 'bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  selectedService === 'personal' ? 'bg-cyan-500/10' : 'bg-purple-500/10'
                }`}>
                  {selectedService === 'personal' ? (
                    <Shield className="h-6 w-6 text-cyan-400" />
                  ) : (
                    <Globe className="h-6 w-6 text-purple-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">
                    {selectedService === 'personal' ? '个人 MCP 服务' : '平台 MCP 服务'}
                  </h3>
                  <p className="text-slate-300">
                    {selectedService === 'personal' 
                      ? '访问您的私有提示词库，需要认证令牌'
                      : '访问平台精选提示词，无需认证'
                    }
                  </p>
                </div>
              </div>
  
              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-200">服务端点</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(
                        selectedService === 'personal' ? 'prompt-ai-personal' : 'prompt-ai-platform', 
                        'endpoint'
                      )}
                      className="text-slate-300 hover:text-slate-100"
                    >
                      {copied === 'endpoint' ? '已复制!' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <code className={`text-sm bg-slate-800 px-2 py-1 rounded block truncate ${
                    selectedService === 'personal' ? 'text-cyan-300' : 'text-purple-300'
                  }`}>
                    {selectedService === 'personal' ? 'prompt-ai-personal' : 'prompt-ai-platform'}
                  </code>
                </div>
                
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-200">Claude Desktop 配置</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(currentConfig, 'config')}
                      className="text-slate-300 hover:text-slate-100"
                    >
                      {copied === 'config' ? '已复制!' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="text-xs text-slate-300 bg-slate-800 p-3 rounded overflow-x-auto max-h-64">
                    {currentConfig}
                  </pre>
                </div>
  
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300">服务运行中</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:text-slate-100">
                      <Download className="h-4 w-4 mr-2" />
                      下载服务
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:text-slate-100">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      查看文档
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* 右侧服务列表 - 增加宽度并优化布局 */}
        <div className="flex-1 min-w-[450px] pl-6 border-l border-slate-700 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">可用工具</h3>
              <p className="text-sm text-slate-300 mb-4">
                {selectedService === 'personal' ? '个人服务' : '平台服务'}提供的工具和功能
              </p>
            </div>
            
            <div className="space-y-3">
              {currentTools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800/70 transition-colors"
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    selectedService === 'personal' ? 'bg-cyan-500/10' : 'bg-purple-500/10'
                  }`}>
                    <tool.icon className={`h-5 w-5 ${tool.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-200 truncate">{tool.name}</div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-2">{tool.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
  
            <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
              <div className="flex items-center space-x-2 mb-3">
                <Activity className="h-5 w-5 text-cyan-400" />
                <span className="text-md font-semibold text-slate-200">服务统计</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex flex-col">
                  <span className="text-slate-400">可用工具</span>
                  <span className="text-lg font-medium text-slate-200">{currentTools.length} 个</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400">服务类型</span>
                  <span className="text-lg font-medium text-slate-200">
                    {selectedService === 'personal' ? '私有' : '公开'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400">认证要求</span>
                  <span className="text-lg font-medium text-slate-200">
                    {selectedService === 'personal' ? '需要' : '无需'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400">更新频率</span>
                  <span className="text-lg font-medium text-slate-200">每周</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
  );
}

export function NavBar({ items, className }: NavBarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(items[0]?.name || "");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div
      className={cn(
        "fixed left-4 top-1/2 -translate-y-1/2 z-50",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2 bg-background/5 border border-border backdrop-blur-lg py-2 px-2 rounded-full shadow-lg">
        {/* 主导航项目 */}
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold p-3 rounded-full transition-colors",
                "text-slate-200 hover:text-white",
                isActive && "bg-muted text-white",
              )}
              title={item.name}
            >
              <Icon size={20} strokeWidth={2.5} />
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full">
                    <div className="absolute w-6 h-12 bg-primary/20 rounded-full blur-md -left-2 -top-2" />
                    <div className="absolute w-6 h-8 bg-primary/20 rounded-full blur-md -left-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-2 -left-1" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}

        {/* 分隔线 */}
        <div className="h-px w-6 bg-border my-1" />

        {/* MCP服务按钮 */}
        <MCPServiceDialog />

        {/* 用户菜单或登录注册 */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url} alt={user?.username} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-900 border-slate-700" align="start" side="right">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-slate-100">
                    {user?.full_name || user?.username}
                  </p>
                  <p className="w-[200px] truncate text-sm text-slate-400">
                    {user?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="text-slate-300 hover:text-slate-100">
                  <User className="mr-2 h-4 w-4" />
                  个人中心
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="text-slate-300 hover:text-slate-100">
                  <Settings className="mr-2 h-4 w-4" />
                  个人资料
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Button variant="ghost" size="sm" asChild className="rounded-full p-3 text-slate-200 hover:text-white" title="登录">
              <Link href="/login">
                <User className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="sm" asChild className="rounded-full p-3 bg-primary hover:bg-primary/90 text-white" title="注册">
              <Link href="/register">
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 