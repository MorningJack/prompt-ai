'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, X, Save, ArrowLeft, Tag, Lightbulb, Code, FileText, Target } from 'lucide-react'
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
import apiService from '@/lib/api'
import { toast } from 'sonner'

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

export default function CreatePromptPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [supportedModels, setSupportedModels] = useState<string[]>([])
  const [useCases, setUseCases] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  // 检查用户认证状态
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await apiService.getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error('获取分类失败:', error)
        setError('获取分类失败，请刷新页面重试')
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
    if (!isAuthenticated || !user) {
      setError('请先登录')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const promptData: PromptCreate = {
        ...data,
        tags: tags.length > 0 ? tags : undefined,
        supported_models: supportedModels.length > 0 ? supportedModels : undefined,
        use_cases: useCases.length > 0 ? useCases : undefined,
      }

      const createdPrompt = await apiService.createPrompt(promptData)
      
      toast.success('提示词创建成功！')
      router.push(`/prompts/${createdPrompt.id}`)
    } catch (error: any) {
      console.error('创建提示词失败:', error)
      
      if (error.response?.status === 401) {
        setError('登录已过期，请重新登录')
        router.push('/login')
      } else if (error.response?.status === 400) {
        setError(error.response.data?.detail || '请检查输入信息')
      } else {
        setError('创建提示词失败，请稍后重试')
      }
    } finally {
      setLoading(false)
    }
  }

  // 如果未登录，显示登录提示
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100 mb-4">请先登录</h1>
          <p className="text-slate-400 mb-6">您需要登录才能创建提示词</p>
          <Button onClick={() => router.push('/login')}>
            前往登录
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
          <h1 className="text-4xl font-bold text-slate-100 mb-2">创建提示词</h1>
          <p className="text-slate-400">创建一个新的AI提示词，分享给社区或私人使用</p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

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
                  填写提示词的基本信息
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
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                            <SelectValue placeholder="选择提示词分类" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
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
                  编写提示词的具体内容和示例
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
                          placeholder="输入完整的提示词内容..."
                          className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-slate-500">
                        这是提示词的核心内容，将直接用于AI对话
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
                            placeholder="提供一个使用示例的输入..."
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
                            placeholder="对应示例输入的期望输出..."
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
                  添加标签和选择适用的模型、使用场景
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 标签输入 */}
                <div>
                  <Label className="text-slate-300 mb-2 block">标签</Label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="输入标签后按回车添加"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      size="sm"
                      className="bg-cyan-500 hover:bg-cyan-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-slate-600 text-slate-100 hover:bg-slate-500"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 支持的模型 */}
                <div>
                  <Label className="text-slate-300 mb-2 block">支持的模型</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {MODEL_COMPATIBILITY_OPTIONS.map((model) => (
                      <div
                        key={model}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          supportedModels.includes(model)
                            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                            : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                        onClick={() => toggleModel(model)}
                      >
                        <span className="text-sm">{model}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 使用场景 */}
                <div>
                  <Label className="text-slate-300 mb-2 block">使用场景</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {USAGE_SCENARIO_OPTIONS.map((useCase) => (
                      <div
                        key={useCase}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          useCases.includes(useCase)
                            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                            : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                        onClick={() => toggleUseCase(useCase)}
                      >
                        <span className="text-sm">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 发布设置 */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Target className="h-5 w-5" />
                  发布设置
                </CardTitle>
                <CardDescription className="text-slate-400">
                  设置提示词的可见性和访问权限
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="is_public"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-600 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-slate-300">
                          公开提示词
                        </FormLabel>
                        <FormDescription className="text-slate-500">
                          允许其他用户查看和使用这个提示词
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
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
                disabled={loading}
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
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    创建中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    创建提示词
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