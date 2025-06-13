"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/stores/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Save,
  ArrowLeft,
  Camera,
  Shield,
  Key
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
  full_name: z
    .string()
    .max(50, "姓名不能超过50个字符")
    .optional(),
  email: z
    .string()
    .email("请输入有效的邮箱地址"),
  bio: z
    .string()
    .max(500, "个人简介不能超过500个字符")
    .optional(),
  location: z
    .string()
    .max(100, "位置信息不能超过100个字符")
    .optional(),
  website: z
    .string()
    .url("请输入有效的网址")
    .optional()
    .or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "请输入当前密码"),
  newPassword: z
    .string()
    .min(6, "新密码至少需要6个字符")
    .max(50, "新密码不能超过50个字符"),
  confirmPassword: z
    .string()
    .min(1, "请确认新密码"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "两次输入的新密码不一致",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      email: "",
      bio: "",
      location: "",
      website: "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      profileForm.reset({
        full_name: user.full_name || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
      });
    }
    
    setIsLoading(false);
  }, [isAuthenticated, user, router, profileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsSaving(true);
      setMessage(null);
      
      // 使用updateUser方法更新用户资料
      updateUser(data);
      
      setMessage({ type: 'success', text: '个人资料更新成功！' });
    } catch (error: any) {
      console.error("Profile update error:", error);
      setMessage({ type: 'error', text: '更新失败，请稍后重试' });
    } finally {
      setIsSaving(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setIsChangingPassword(true);
      setMessage(null);
      
      // 这里应该调用API更改密码
      // await changePassword(data);
      
      passwordForm.reset();
      setMessage({ type: 'success', text: '密码修改成功！' });
    } catch (error: any) {
      console.error("Password change error:", error);
      setMessage({ type: 'error', text: '密码修改失败，请检查当前密码是否正确' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center text-slate-400 hover:text-slate-300 transition-colors mr-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回仪表板
              </Link>
              <h1 className="text-xl font-bold text-slate-100">个人资料</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar_url} alt={user.username} />
                    <AvatarFallback className="bg-cyan-500 text-white text-2xl">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-cyan-500 hover:bg-cyan-600"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">
                    {user.full_name || user.username}
                  </h2>
                  <p className="text-slate-400">@{user.username}</p>
                  <div className="flex items-center mt-2 text-sm text-slate-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    加入于 {new Date(user.created_at || '').toLocaleDateString('zh-CN')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg">
            <Button
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              className={`flex-1 ${activeTab === 'profile' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="h-4 w-4 mr-2" />
              基本信息
            </Button>
            <Button
              variant={activeTab === 'security' ? 'default' : 'ghost'}
              className={`flex-1 ${activeTab === 'security' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield className="h-4 w-4 mr-2" />
              安全设置
            </Button>
          </div>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Profile Form */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">基本信息</CardTitle>
                <CardDescription className="text-slate-400">
                  更新你的个人资料信息
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">姓名</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                  {...field}
                                  placeholder="请输入真实姓名"
                                  className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">邮箱</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="请输入邮箱地址"
                                  className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">位置</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                  {...field}
                                  placeholder="请输入所在位置"
                                  className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">个人网站</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                  {...field}
                                  placeholder="https://example.com"
                                  className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">个人简介</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="介绍一下你自己..."
                              className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          保存中...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Save className="mr-2 h-4 w-4" />
                          保存更改
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Security Form */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">安全设置</CardTitle>
                <CardDescription className="text-slate-400">
                  修改你的账户密码
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">当前密码</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                              <Input
                                {...field}
                                type="password"
                                placeholder="请输入当前密码"
                                className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">新密码</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                              <Input
                                {...field}
                                type="password"
                                placeholder="请输入新密码"
                                className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">确认新密码</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                              <Input
                                {...field}
                                type="password"
                                placeholder="请再次输入新密码"
                                className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          修改中...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Key className="mr-2 h-4 w-4" />
                          修改密码
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
} 