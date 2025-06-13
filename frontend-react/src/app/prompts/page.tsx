'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Heart, 
  Eye, 
  Star, 
  User, 
  Calendar,
  Tag,
  Sparkles,
  ArrowLeft,
  Grid3X3,
  List
} from "lucide-react";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Prompt, Category, SearchParams } from '@/types'
import apiService from '@/lib/api'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

export default function PromptsPage() {
  const router = useRouter()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 12

  // 搜索参数
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
    size: pageSize,
    search: '',
    is_public: true,
  })

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService.getCategories()
        setCategories(data)
      } catch (error) {
        console.error('获取分类失败:', error)
        toast.error('获取分类失败')
      }
    }
    fetchCategories()
  }, [])

  // 获取提示词数据
  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true)
      try {
        console.log('Fetching prompts with params:', searchParams)
        const response = await apiService.getPrompts(searchParams)
        console.log('API response:', response)
        setPrompts(response.items)
        setTotalPages(response.pages)
        setTotal(response.total)
        console.log('State updated - prompts:', response.items.length, 'total:', response.total)
      } catch (error) {
        console.error('获取提示词失败:', error)
        toast.error('获取提示词失败')
      } finally {
        setLoading(false)
      }
    }
    fetchPrompts()
  }, [searchParams])

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setSearchParams(prev => ({
      ...prev,
      search: query,
      page: 1
    }))
    setCurrentPage(1)
  }

  // 处理分类筛选
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSearchParams(prev => ({
      ...prev,
      category_id: categoryId === 'all' ? undefined : Number(categoryId),
      page: 1
    }))
    setCurrentPage(1)
  }

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSearchParams(prev => ({
      ...prev,
      page
    }))
  }

  // 生成分页按钮
  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size='sm'
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
        >
          {i}
        </Button>
      )
    }

    return pages
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  // 获取分类名称
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || '未分类';
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 筛选栏 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="按名称搜索..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-slate-800 border-slate-600 text-slate-100 pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-48 bg-slate-800 border-slate-600 text-slate-100">
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all" className="text-slate-100">全部分类</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()} className="text-slate-100">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 提示词列表 */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-300 mb-2">暂无提示词</h3>
            <p className="text-slate-400 mb-6">没有找到符合条件的提示词</p>
            <Button asChild className="bg-cyan-500 hover:bg-cyan-600">
              <Link href="/create">
                创建第一个提示词
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {prompts.map((prompt, index) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-slate-900 border-slate-700 hover:border-cyan-500 transition-all duration-300 group cursor-pointer h-full">
                    <Link href={`/prompts/${prompt.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-slate-100 text-lg group-hover:text-cyan-400 transition-colors line-clamp-2">
                              {prompt.name_zh}
                            </CardTitle>
                            {prompt.name_en && (
                              <p className="text-sm text-slate-400 mt-1">{prompt.name_en}</p>
                            )}
                          </div>
                          {prompt.is_featured && (
                            <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                              <Star className="h-3 w-3 mr-1" />
                              精选
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <CardDescription className="text-slate-400 line-clamp-3">
                          {prompt.description || '暂无描述'}
                        </CardDescription>

                        {/* 标签 */}
                        {prompt.tags && prompt.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {prompt.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                                <Tag className="h-2 w-2 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {prompt.tags.length > 3 && (
                              <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                                +{prompt.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* 统计信息 */}
                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <Heart className="h-3 w-3 mr-1" />
                              {prompt.rating_count}
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {prompt.usage_count}
                            </span>
                            <span className="flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {prompt.rating_avg.toFixed(1)}
                            </span>
                          </div>
                          
                          <Badge variant="outline" className="border-slate-600 text-slate-400">
                            {prompt.category?.name || '未分类'}
                          </Badge>
                        </div>

                        {/* 作者信息 */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={prompt.author?.avatar_url} />
                              <AvatarFallback className="bg-slate-700 text-slate-300 text-xs">
                                {prompt.author?.username?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-slate-400">
                              {prompt.author?.username || '匿名用户'}
                            </span>
                          </div>
                          
                          <span className="text-xs text-slate-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(prompt.created_at)}
                          </span>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  上一页
                </Button>
                
                {renderPagination()}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 