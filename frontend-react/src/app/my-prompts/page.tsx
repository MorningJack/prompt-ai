"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Plus,
  Eye,
  Heart,
  Search,
  Filter,
  Grid,
  List,
  Edit,
  Trash2,
  Globe,
  Lock,
  Calendar,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

interface Prompt {
  id: number;
  title: string;
  description: string;
  content: string;
  category_name: string;
  is_public: boolean;
  like_count: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export default function MyPromptsPage() {
  const { user, isAuthenticated } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchMyPrompts = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setLoading(true);
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('access_token='))
          ?.split('=')[1];

        if (!token) return;

        const response = await fetch(`http://localhost:8000/api/v1/prompts/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPrompts(data);
        }
      } catch (error) {
        console.error('获取提示词失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPrompts();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100 mb-4">请先登录</h1>
          <p className="text-slate-400 mb-6">您需要登录才能查看个人提示词</p>
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

  const publicPrompts = prompts.filter(p => p.is_public);
  const privatePrompts = prompts.filter(p => !p.is_public);

  const getFilteredPrompts = () => {
    switch (activeTab) {
      case 'public':
        return publicPrompts;
      case 'private':
        return privatePrompts;
      default:
        return prompts;
    }
  };

  const filteredPrompts = getFilteredPrompts();

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 mb-2">我的提示词</h1>
              <p className="text-slate-400">管理您创建的所有提示词</p>
            </div>
            <Button asChild className="bg-cyan-500 hover:bg-cyan-600">
              <Link href="/create">
                <Plus className="h-4 w-4 mr-2" />
                创建新提示词
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <User className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">总提示词</p>
                    <p className="text-2xl font-bold text-slate-100">{prompts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Globe className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">公开提示词</p>
                    <p className="text-2xl font-bold text-slate-100">{publicPrompts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <Lock className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">私有提示词</p>
                    <p className="text-2xl font-bold text-slate-100">{privatePrompts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800">
              <TabsTrigger value="all">全部 ({prompts.length})</TabsTrigger>
              <TabsTrigger value="public">公开 ({publicPrompts.length})</TabsTrigger>
              <TabsTrigger value="private">私有 ({privatePrompts.length})</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Prompts Grid/List */}
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              {activeTab === 'all' ? '还没有创建任何提示词' : 
               activeTab === 'public' ? '还没有公开的提示词' : '还没有私有的提示词'}
            </h3>
            <p className="text-slate-500 mb-6">
              {activeTab === 'all' ? '创建您的第一个提示词开始吧！' : 
               activeTab === 'public' ? '将一些提示词设为公开分享给其他用户' : '创建一些私有提示词用于个人使用'}
            </p>
            <Button asChild>
              <Link href="/create">
                <Plus className="h-4 w-4 mr-2" />
                创建提示词
              </Link>
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-slate-100 mb-2">{prompt.title}</CardTitle>
                        <CardDescription className="text-slate-400 line-clamp-2">
                          {prompt.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {prompt.is_public ? (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                            <Globe className="h-3 w-3 mr-1" />
                            公开
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                            <Lock className="h-3 w-3 mr-1" />
                            私有
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{prompt.like_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{prompt.usage_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(prompt.created_at).toLocaleDateString('zh-CN')}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-slate-600 text-slate-400">
                          {prompt.category_name}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/prompts/${prompt.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/prompts/${prompt.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 