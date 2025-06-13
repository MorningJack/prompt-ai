"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Plus,
  Eye,
  Heart,
  MessageSquare,
  Star,
  TrendingUp,
  Calendar,
  Activity,
  ExternalLink,
  Copy,
  Code,
  Search,
  Filter,
  Download,
  Shield,
  Globe,
  Settings
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalPrompts: number;
  publicPrompts: number;
  privatePrompts: number;
  totalLikes: number;
  totalViews: number;
  totalComments: number;
}

interface RecentPrompt {
  id: number;
  title: string;
  description: string;
  category_name: string;
  is_public: boolean;
  like_count: number;
  usage_count: number;
  created_at: string;
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
        <Button className="w-full h-16 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0">
          <Code className="h-5 w-5 mr-2" />
          MCP 服务配置
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-16xl max-h-[85vh] overflow-hidden bg-slate-900 border-slate-700">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-slate-100 flex items-center">
            <Code className="h-5 w-5 mr-2 text-cyan-400" />
            MCP 服务配置
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            在 Claude Desktop 中集成您的提示词服务，支持个人和平台两种模式
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-[calc(85vh-120px)]">
          {/* 左侧配置区域 */}
          <div className="flex-1 pr-6 overflow-y-auto">
            <div className="space-y-6">
              {/* 服务选择 */}
              <div className="flex space-x-2 bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setSelectedService('personal')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedService === 'personal'
                      ? 'bg-cyan-500 text-white'
                      : 'text-slate-400 hover:text-slate-300'
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
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Globe className="h-4 w-4 mr-2 inline" />
                  平台服务
                </button>
              </div>

              {/* 服务信息 */}
              <Card className={`${
                selectedService === 'personal' 
                  ? 'bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20' 
                  : 'bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20'
              }`}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
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
                      <CardTitle className="text-slate-100">
                        {selectedService === 'personal' ? '个人 MCP 服务' : '平台 MCP 服务'}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {selectedService === 'personal' 
                          ? '访问您的私有提示词库，需要认证令牌'
                          : '访问平台精选提示词，无需认证'
                        }
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-300">服务端点</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(
                          selectedService === 'personal' ? 'prompt-ai-personal' : 'prompt-ai-platform', 
                          'endpoint'
                        )}
                        className="text-slate-400 hover:text-slate-300"
                      >
                        {copied === 'endpoint' ? '已复制!' : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <code className={`text-sm bg-slate-800 px-2 py-1 rounded ${
                      selectedService === 'personal' ? 'text-cyan-300' : 'text-purple-300'
                    }`}>
                      {selectedService === 'personal' ? 'prompt-ai-personal' : 'prompt-ai-platform'}
                    </code>
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-300">Claude Desktop 配置</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(currentConfig, 'config')}
                        className="text-slate-400 hover:text-slate-300"
                      >
                        {copied === 'config' ? '已复制!' : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <pre className="text-xs text-slate-400 bg-slate-800 p-3 rounded overflow-x-auto max-h-48">
                      {currentConfig}
                    </pre>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-400">服务运行中</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="border-slate-700">
                        <Download className="h-4 w-4 mr-2" />
                        下载服务
                      </Button>
                      <Button variant="outline" size="sm" className="border-slate-700">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        查看文档
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 右侧服务列表 */}
          <div className="w-80 pl-6 border-l border-slate-700 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">可用工具</h3>
                <p className="text-sm text-slate-400 mb-4">
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
                    <div className={`p-2 rounded-lg ${
                      selectedService === 'personal' ? 'bg-cyan-500/10' : 'bg-purple-500/10'
                    }`}>
                      <tool.icon className={`h-4 w-4 ${tool.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-300">{tool.name}</div>
                      <div className="text-xs text-slate-500">{tool.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-slate-300">服务统计</span>
                </div>
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>可用工具</span>
                    <span className="text-slate-300">{currentTools.length} 个</span>
                  </div>
                  <div className="flex justify-between">
                    <span>服务类型</span>
                    <span className="text-slate-300">
                      {selectedService === 'personal' ? '私有' : '公开'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>认证要求</span>
                    <span className="text-slate-300">
                      {selectedService === 'personal' ? '需要' : '无需'}
                    </span>
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

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPrompts: 0,
    publicPrompts: 0,
    privatePrompts: 0,
    totalLikes: 0,
    totalViews: 0,
    totalComments: 0,
  });
  const [recentPrompts, setRecentPrompts] = useState<RecentPrompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        
        // 获取用户的提示词统计
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('access_token='))
          ?.split('=')[1];

        if (!token) return;

        // 获取用户提示词
        const response = await fetch(`http://localhost:8000/api/v1/prompts/user/${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const prompts = await response.json();
          
          // 计算统计数据
          const totalPrompts = prompts.length;
          const publicPrompts = prompts.filter((p: any) => p.is_public).length;
          const privatePrompts = totalPrompts - publicPrompts;
          const totalLikes = prompts.reduce((sum: number, p: any) => sum + (p.like_count || 0), 0);
          const totalViews = prompts.reduce((sum: number, p: any) => sum + (p.usage_count || 0), 0);
          const totalComments = prompts.reduce((sum: number, p: any) => sum + (p.comment_count || 0), 0);

          setStats({
            totalPrompts,
            publicPrompts,
            privatePrompts,
            totalLikes,
            totalViews,
            totalComments,
          });

          // 获取最近的提示词
          const recent = prompts
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
          
          setRecentPrompts(recent);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100 mb-4">请先登录</h1>
          <p className="text-slate-400 mb-6">您需要登录才能访问个人中心</p>
          <Button asChild>
            <Link href="/login">前往登录</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">
                欢迎回来，{user?.full_name || user?.username}
              </h1>
              <p className="text-slate-400">管理您的提示词和个人设置</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-cyan-500/20 rounded-lg">
                    <User className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">我的提示词</p>
                    <p className="text-2xl font-bold text-slate-100">{stats.totalPrompts || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Heart className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">获得点赞</p>
                    <p className="text-2xl font-bold text-slate-100">{stats.totalLikes || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Eye className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">总使用量</p>
                    <p className="text-2xl font-bold text-slate-100">{stats.totalViews || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">快速操作</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Button asChild className="w-full h-16 bg-cyan-500 hover:bg-cyan-600">
                <Link href="/create">
                  <Plus className="h-5 w-5 mr-2" />
                  创建提示词
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button asChild variant="outline" className="w-full h-16 border-slate-700 text-slate-300">
                <Link href="/my-prompts">
                  <User className="h-5 w-5 mr-2" />
                  我的提示词
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button asChild variant="outline" className="w-full h-16 border-slate-700 text-slate-300">
                <Link href="/featured">
                  <Star className="h-5 w-5 mr-2" />
                  精选推荐
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MCPServiceDialog />
            </motion.div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Prompts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100">最近提示词</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/my-prompts" className="text-cyan-400 hover:text-cyan-300">
                      查看全部
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentPrompts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 mb-4">还没有创建任何提示词</p>
                    <Button asChild size="sm">
                      <Link href="/create">创建第一个提示词</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentPrompts.map((prompt, index) => (
                      <motion.div
                        key={prompt.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center space-x-4 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-200 mb-1">{prompt.title}</h3>
                          <p className="text-sm text-slate-400 line-clamp-1">{prompt.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline" className="border-slate-600 text-slate-400">
                              {prompt.category_name}
                            </Badge>
                            <div className="flex items-center space-x-2 text-xs text-slate-500">
                              <Heart className="h-3 w-3" />
                              <span>{prompt.like_count}</span>
                              <Eye className="h-3 w-3" />
                              <span>{prompt.usage_count}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {prompt.is_public ? (
                            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                              公开
                            </Badge>
                          ) : (
                            <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                              私有
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/prompts/${prompt.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  活动概览
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Globe className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="text-slate-300">公开提示词</span>
                    </div>
                    <span className="text-slate-100 font-medium">{stats.publicPrompts || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Shield className="h-4 w-4 text-orange-400" />
                      </div>
                      <span className="text-slate-300">私有提示词</span>
                    </div>
                    <span className="text-slate-100 font-medium">{stats.privatePrompts || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <MessageSquare className="h-4 w-4 text-green-400" />
                      </div>
                      <span className="text-slate-300">收到评论</span>
                    </div>
                    <span className="text-slate-100 font-medium">{stats.totalComments}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-purple-400" />
                      </div>
                      <span className="text-slate-300">平均使用量</span>
                    </div>
                    <span className="text-slate-100 font-medium">
                      {stats.totalPrompts > 0 ? Math.round(stats.totalViews / stats.totalPrompts) : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 