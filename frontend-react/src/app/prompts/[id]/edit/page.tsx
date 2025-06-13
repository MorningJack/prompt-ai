'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, X, Save, ArrowLeft, Tag, Lightbulb, Code, FileText, Target, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Category, PromptCreate, MODEL_COMPATIBILITY_OPTIONS, USAGE_SCENARIO_OPTIONS } from '@/types'
import { useAuth } from '@/stores/auth'
import Link from 'next/link'

// 表单验证模式
const promptSchema = z.object({
  name_zh: z.string().min(1, '中文名称不能为空').max(200, '中文名称不能超过200字符'),
  name_en: z.string().max(200, '英文名称不能超过200字符').optional().or(z.literal('')),
  description: z.string().max(1000, '描述不能超过1000字符').optional().or(z.literal('')),
  content: z.string().min(1, '提示词内容不能为空').max(5000, '提示词内容不能超过5000字符'),
  example_input: z.string().max(1000, '示例输入不能超过1000字符').optional().or(z.literal('')),
  example_output: z.string().max(1000, '示例输出不能超过1000字符').optional().or(z.literal('')),
  usage_tips: z.string().max(1000, '使用技巧不能超过1000字符').optional().or(z.literal('')),
  category_id: z.number().min(1, '请选择分类'),
  is_public: z.boolean(),
})

type PromptFormData = z.infer<typeof promptSchema>

export default function EditPromptPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [supportedModels, setSupportedModels] = useState<string[]>([])
  const [useCases, setUseCases] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [prompt, setPrompt] = useState<any>(null)

  const form = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name_zh: '',
      name_en: '',
      description: '',
      content: '',
      example_input: '',
      example_output: '',
      usage_tips: '',
      category_id: 0,
      is_public: false,
    },
  })

  // 获取提示词数据
  useEffect(() => {
    const fetchPrompt = async () => {
      if (!params.id || !isAuthenticated) return

      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('access_token='))
          ?.split('=')[1]

        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch(`http://localhost:8000/api/v1/prompts/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const promptData = await response.json()
          setPrompt(promptData)

          // 检查是否是提示词的作者
          if (promptData.author_id !== user?.id) {
            alert('您没有权限编辑此提示词')
            router.push(`/prompts/${params.id}`)
            return
          }

          // 填充表单数据
          form.reset({
            name_zh: promptData.title || '',
            name_en: promptData.name_en || '',
            description: promptData.description || '',
            content: promptData.content || '',
            example_input: promptData.example_input || '',
            example_output: promptData.example_output || '',
            usage_tips: promptData.usage_tips || '',
            category_id: promptData.category_id || 0,
            is_public: promptData.is_public || false,
          })

          // 设置标签和其他数据
          if (promptData.tags) {
            setTags(Array.isArray(promptData.tags) ? promptData.tags : [])
          }
          if (promptData.supported_models) {
            setSupportedModels(Array.isArray(promptData.supported_models) ? promptData.supported_models : [])
          }
          if (promptData.use_cases) {
            setUseCases(Array.isArray(promptData.use_cases) ? promptData.use_cases : [])
          }
        } else {
          alert('获取提示词数据失败')
          router.push('/prompts')
        }
      } catch (error) {
        console.error('获取提示词失败:', error)
        alert('获取提示词数据失败')
        router.push('/prompts')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchPrompt()
  }, [params.id, isAuthenticated, user, router, form])

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/categories/')
        if (response.ok) {
          const categoriesData = await response.json()
          setCategories(categoriesData)
        } else {
          // 使用模拟数据
          const mockCategories: Category[] = [
            { id: 1, name: '写作助手', description: '帮助写作的提示词', parent_id: undefined, sort_order: 1, is_active: true },
            { id: 2, name: '代码生成', description: '代码相关的提示词', parent_id: undefined, sort_order: 2, is_active: true },
            { id: 3, name: '数据分析', description: '数据分析相关的提示词', parent_id: undefined, sort_order: 3, is_active: true },
          ]
          setCategories(mockCategories)
        }
      } catch (error) {
        console.error('获取分类失败:', error)
        // 使用模拟数据
        const mockCategories: Category[] = [
          { id: 1, name: '写作助手', description: '帮助写作的提示词', parent_id: undefined, sort_order: 1, is_active: true },
          { id: 2, name: '代码生成', description: '代码相关的提示词', parent_id: undefined, sort_order: 2, is_active: true },
          { id: 3, name: '数据分析', description: '数据分析相关的提示词', parent_id: undefined, sort_order: 3, is_active: true },
        ]
        setCategories(mockCategories)
      }
    }
    fetchCategories()
  }, [])

  // 添加标签
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // 处理标签输入
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // 切换支持的模型
  const toggleModel = (model: string) => {
    setSupportedModels(prev =>
      prev.includes(model)
        ? prev.filter(m => m !== model)
        : [...prev, model]
    )
  }

  // 切换使用场景
  const toggleUseCase = (useCase: string) => {
    setUseCases(prev =>
      prev.includes(useCase)
        ? prev.filter(u => u !== useCase)
        : [...prev, useCase]
    )
  }

  // 提交表单
  const onSubmit = async (data: PromptFormData) => {
    setLoading(true)
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1]

      if (!token) {
        router.push('/login')
        return
      }

      const promptData = {
        title: data.name_zh,
        name_en: data.name_en || null,
        description: data.description || null,
        content: data.content,
        example_input: data.example_input || null,
        example_output: data.example_output || null,
        usage_tips: data.usage_tips || null,
        category_id: data.category_id,
        is_public: data.is_public,
        tags: tags.length > 0 ? tags : null,
        supported_models: supportedModels.length > 0 ? supportedModels : null,
        use_cases: useCases.length > 0 ? useCases : null,
      }

      const response = await fetch(`http://localhost:8000/api/v1/prompts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptData),
      })

      if (response.ok) {
        alert('提示词更新成功！')
        router.push(`/prompts/${params.id}`)
      } else {
        const errorData = await response.json()
        alert(`更新失败: ${errorData.detail || '未知错误'}`)
      }
    } catch (error: any) {
      console.error('更新提示词失败:', error)
      alert('更新提示词失败')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100 mb-4">请先登录</h1>
          <p className="text-slate-400 mb-6">您需要登录才能编辑提示词</p>
          <Button asChild>
            <a href="/login">前往登录</a>
          </Button>
        </div>
      </div>
    )
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100 mb-4">提示词不存在</h1>
          <p className="text-slate-400 mb-6">您要编辑的提示词不存在或已被删除</p>
          <Button asChild>
            <Link href="/prompts">返回提示词列表</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
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
          <h1 className="text-4xl font-bold text-slate-100 mb-2">编辑提示词</h1>
          <p className="text-slate-400">修改您的AI提示词内容和设置</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* 基本信息 */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <FileText className="h-5 w-5" />
                  基本信息
                </CardTitle>
                <CardDescription className="text-slate-400">
                  修改提示词的基本信息
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name_zh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">中文名称 *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="输入提示词的中文名称"
                            className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">英文名称</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="输入提示词的英文名称（可选）"
                            className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">描述</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="简要描述这个提示词的用途和特点"
                          className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">分类 *</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                            <SelectValue placeholder="选择分类" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()} className="text-slate-100">
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 提示词内容 */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Code className="h-5 w-5" />
                  提示词内容
                </CardTitle>
                <CardDescription className="text-slate-400">
                  编写您的AI提示词内容
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">提示词内容 *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="输入您的提示词内容..."
                          className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 min-h-[200px] font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-slate-500">
                        编写清晰、具体的提示词，可以使用变量如 {'{input}'} 来表示用户输入
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="example_input"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">示例输入</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="提供一个示例输入..."
                            className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="example_output"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">示例输出</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="对应的示例输出..."
                            className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="usage_tips"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">使用技巧</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="分享使用这个提示词的技巧和注意事项..."
                          className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 标签和分类 */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Tag className="h-5 w-5" />
                  标签和分类
                </CardTitle>
                <CardDescription className="text-slate-400">
                  添加标签帮助其他用户发现您的提示词
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-slate-300 mb-3 block">标签</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-slate-700 text-slate-200 hover:bg-slate-600">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-slate-400 hover:text-slate-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="输入标签名称"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
                    />
                    <Button type="button" onClick={addTag} variant="outline" className="border-slate-600 text-slate-300">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 高级设置 */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Target className="h-5 w-5" />
                  高级设置
                </CardTitle>
                <CardDescription className="text-slate-400">
                  配置提示词的兼容性和使用场景
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-slate-300 mb-3 block">支持的AI模型</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {MODEL_COMPATIBILITY_OPTIONS.map((model) => (
                      <div key={model} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`model-${model}`}
                          checked={supportedModels.includes(model)}
                          onChange={() => toggleModel(model)}
                          className="rounded border-slate-600 bg-slate-700"
                        />
                        <Label htmlFor={`model-${model}`} className="text-slate-300 text-sm">
                          {model}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                <div>
                  <Label className="text-slate-300 mb-3 block">使用场景</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {USAGE_SCENARIO_OPTIONS.map((useCase) => (
                      <div key={useCase} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`usecase-${useCase}`}
                          checked={useCases.includes(useCase)}
                          onChange={() => toggleUseCase(useCase)}
                          className="rounded border-slate-600 bg-slate-700"
                        />
                        <Label htmlFor={`usecase-${useCase}`} className="text-slate-300 text-sm">
                          {useCase}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                <FormField
                  control={form.control}
                  name="is_public"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-600 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-slate-300">公开提示词</FormLabel>
                        <FormDescription className="text-slate-500">
                          允许其他用户查看和使用这个提示词
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-cyan-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 提交按钮 */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    更新中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    更新提示词
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
} 