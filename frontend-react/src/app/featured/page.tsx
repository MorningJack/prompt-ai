"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  TrendingUp,
  Award,
  Sparkles,
  Heart,
  MessageSquare,
  Download,
  Calendar,
  User,
  Eye,
  Copy,
  Share
} from "lucide-react";
import Link from "next/link";

interface FeaturedPrompt {
  id: number;
  title: string;
  description: string;
  content: string;
  category_id: number;
  category_name: string;
  is_public: boolean;
  is_featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  author_id: number;
  author_name: string;
  usage_count: number;
  like_count: number;
  comment_count: number;
  featured_reason?: string;
  quality_score?: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function FeaturedPage() {
  const [prompts, setPrompts] = useState<FeaturedPrompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "trending">("popular");

  useEffect(() => {
    const fetchFeaturedPrompts = async () => {
      try {
        setLoading(true);
        
        // 获取精选提示词
        const response = await fetch('http://localhost:8000/api/v1/prompts/featured');
        if (response.ok) {
          const data = await response.json();
          setPrompts(data);
        }

        // 获取分类
        const categoriesResponse = await fetch('http://localhost:8000/api/v1/categories/');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPrompts();
  }, []);

  // 筛选和排序提示词
  const filteredAndSortedPrompts = prompts
    .filter(prompt => {
      const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prompt.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || prompt.category_id.toString() === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "popular":
          return b.like_count - a.like_count;
        case "trending":
          return b.usage_count - a.usage_count;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">加载精选内容中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">精选推荐</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            发现最优质的提示词
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            由我们的专家团队精心挑选，为您提供最高质量、最实用的AI提示词
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Award className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">精选总数</p>
                  <p className="text-xl font-bold text-slate-100">{prompts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Heart className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">总点赞</p>
                  <p className="text-xl font-bold text-slate-100">
                    {prompts.reduce((sum, p) => sum + p.like_count, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Download className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">总使用</p>
                  <p className="text-xl font-bold text-slate-100">
                    {prompts.reduce((sum, p) => sum + p.usage_count, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">平均评分</p>
                  <p className="text-xl font-bold text-slate-100">
                    {prompts.length > 0 
                      ? (prompts.reduce((sum, p) => sum + (p.quality_score || 0), 0) / prompts.length).toFixed(1)
                      : "0.0"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="搜索精选提示词..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-700 text-slate-100"
              />
            </div>
            
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-slate-700 text-slate-300">
                    <Filter className="h-4 w-4 mr-2" />
                    分类筛选
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem 
                    onClick={() => setSelectedCategory("all")}
                    className="text-slate-300"
                  >
                    全部分类
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className="text-slate-300"
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-slate-700 text-slate-300">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    排序方式
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem 
                    onClick={() => setSortBy("popular")}
                    className="text-slate-300"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    最受欢迎
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy("trending")}
                    className="text-slate-300"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    使用最多
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy("latest")}
                    className="text-slate-300"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    最新发布
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="border-slate-700"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="border-slate-700"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {filteredAndSortedPrompts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">暂无精选内容</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || selectedCategory !== "all" 
                ? "没有找到匹配的精选提示词，请尝试调整搜索条件"
                : "精选内容正在准备中，敬请期待"
              }
            </p>
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredAndSortedPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 group relative overflow-hidden">
                  {/* Featured Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <Star className="h-3 w-3" />
                      <span>精选</span>
                    </div>
                  </div>

                  {/* Quality Score */}
                  {prompt.quality_score && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="flex items-center space-x-1 bg-slate-800/80 backdrop-blur-sm text-slate-300 px-2 py-1 rounded-full text-xs">
                        <Award className="h-3 w-3 text-yellow-400" />
                        <span>{prompt.quality_score.toFixed(1)}</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-8">
                        <CardTitle className="text-slate-100 text-lg group-hover:text-cyan-400 transition-colors mb-2">
                          <Link href={`/prompts/${prompt.id}`}>
                            {prompt.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-slate-400 line-clamp-2 mb-3">
                          {prompt.description}
                        </CardDescription>
                        {prompt.featured_reason && (
                          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2 mb-3">
                            <p className="text-xs text-cyan-400 font-medium mb-1">精选理由</p>
                            <p className="text-xs text-slate-300">{prompt.featured_reason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Heart className="h-3 w-3 text-red-400" />
                          <span>{prompt.like_count}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3 text-blue-400" />
                          <span>{prompt.comment_count}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Download className="h-3 w-3 text-green-400" />
                          <span>{prompt.usage_count}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{prompt.author_name}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="border-slate-600 text-slate-400">
                        {prompt.category_name}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(prompt.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {prompt.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex} 
                          variant="secondary" 
                          className="bg-slate-800 text-slate-400 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {prompt.tags.length > 3 && (
                        <Badge 
                          variant="secondary" 
                          className="bg-slate-800 text-slate-400 text-xs"
                        >
                          +{prompt.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button asChild size="sm" className="flex-1 bg-cyan-500 hover:bg-cyan-600">
                        <Link href={`/prompts/${prompt.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="border-slate-700">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-slate-700">
                        <Share className="h-4 w-4" />
                      </Button>
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