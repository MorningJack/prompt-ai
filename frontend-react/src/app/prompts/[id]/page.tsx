'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Copy, Star, Eye, Calendar, User, Tag, Code, Lightbulb, Target, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Prompt, Category } from '@/types'
import apiService from '@/lib/api'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth'

export default function PromptDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated } = useAuth()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 验证ID是否为有效数字
        const id = Number(params.id)
        if (isNaN(id) || id <= 0) {
          throw new Error('Invalid prompt ID')
        }

        const [promptData, categoriesData] = await Promise.all([
          apiService.getPromptById(id),
          apiService.getCategories()
        ])
        setPrompt(promptData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('获取提示词详情失败:', error)
        toast.error('获取提示词详情失败')
        router.push('/prompts')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id, router])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('已复制到剪贴板')
    } catch (error) {
      toast.error('复制失败')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || '未知分类'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-700 rounded w-1/3"></div>
            <div className="h-12 bg-slate-700 rounded w-2/3"></div>
            <div className="h-64 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-100 mb-4">提示词不存在</h1>
            <Button onClick={() => router.push('/prompts')}>
              返回提示词库
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-slate-400 hover:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </div>

        {/* 标题和基本信息 */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-100 mb-2">
                {prompt.name_zh}
                {prompt.is_featured && (
                  <Star className="inline-block ml-3 h-6 w-6 text-yellow-500 fill-current" />
                )}
              </h1>
              {prompt.name_en && (
                <p className="text-xl text-slate-400 mb-4">{prompt.name_en}</p>
              )}
              {prompt.description && (
                <p className="text-slate-300 text-lg">{prompt.description}</p>
              )}
            </div>
            {/* 编辑按钮 - 只有作者可以看到 */}
            {isAuthenticated && user && prompt.author_id === user.id && (
              <Button
                onClick={() => router.push(`/prompts/${prompt.id}/edit`)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                编辑
              </Button>
            )}
          </div>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              使用 {prompt.usage_count} 次
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              评分 {prompt.rating_avg.toFixed(1)} ({prompt.rating_count} 人评价)
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              创建于 {formatDate(prompt.created_at)}
            </div>
            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
              {getCategoryName(prompt.category_id)}
            </Badge>
          </div>
        </div>

        {/* 标签 */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="border-slate-600 text-slate-400">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 提示词内容 */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Code className="h-5 w-5" />
                提示词内容
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(prompt.content)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Copy className="h-4 w-4 mr-2" />
                复制
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-900 p-4 rounded-lg text-slate-100 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {prompt.content}
            </pre>
          </CardContent>
        </Card>

        {/* 示例和使用技巧 */}
        {(prompt.example_input || prompt.example_output || prompt.usage_tips) && (
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Lightbulb className="h-5 w-5" />
                示例和使用技巧
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {(prompt.example_input || prompt.example_output) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {prompt.example_input && (
                    <div>
                      <h4 className="text-slate-300 font-medium mb-2">示例输入</h4>
                      <div className="bg-slate-900 p-3 rounded-lg text-slate-100 text-sm">
                        {prompt.example_input}
                      </div>
                    </div>
                  )}
                  {prompt.example_output && (
                    <div>
                      <h4 className="text-slate-300 font-medium mb-2">示例输出</h4>
                      <div className="bg-slate-900 p-3 rounded-lg text-slate-100 text-sm">
                        {prompt.example_output}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {prompt.usage_tips && (
                <>
                  {(prompt.example_input || prompt.example_output) && (
                    <Separator className="bg-slate-700" />
                  )}
                  <div>
                    <h4 className="text-slate-300 font-medium mb-2">使用技巧</h4>
                    <div className="bg-slate-900 p-3 rounded-lg text-slate-100 text-sm">
                      {prompt.usage_tips}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* 适用性信息 */}
        {(prompt.supported_models?.length || prompt.use_cases?.length) && (
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Target className="h-5 w-5" />
                适用性
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {prompt.supported_models && prompt.supported_models.length > 0 && (
                <div>
                  <h4 className="text-slate-300 font-medium mb-3">支持的模型</h4>
                  <div className="flex flex-wrap gap-2">
                    {prompt.supported_models.map((model, index) => (
                      <Badge key={index} className="bg-cyan-600 text-white">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {prompt.use_cases && prompt.use_cases.length > 0 && (
                <>
                  {prompt.supported_models && prompt.supported_models.length > 0 && (
                    <Separator className="bg-slate-700" />
                  )}
                  <div>
                    <h4 className="text-slate-300 font-medium mb-3">使用场景</h4>
                    <div className="flex flex-wrap gap-2">
                      {prompt.use_cases.map((useCase, index) => (
                        <Badge key={index} variant="secondary" className="bg-slate-700 text-slate-300">
                          {useCase}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => copyToClipboard(prompt.content)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Copy className="h-4 w-4 mr-2" />
            复制提示词
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/prompts')}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            浏览更多
          </Button>
        </div>
      </div>
    </div>
  )
}