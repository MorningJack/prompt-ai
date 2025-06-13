"use client";

import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Sparkles, Users, BookOpen, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section with Lamp */}
      <LampContainer>
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 text-center"
        >
          <h1 className="bg-gradient-to-br from-slate-300 to-slate-500 pt-10 pb-20 bg-clip-text text-4xl font-medium tracking-tight text-transparent md:text-7xl">
            Prompt AI <br /> 智能提示词管理平台
          </h1>
          <p className="mt-10 text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            发现、创建和分享高质量的 AI 提示词，让你的 AI 对话更加精准高效
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/prompts">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <Search className="mr-2 h-5 w-5" />
                浏览提示词
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-1000 hover:bg-slate-300">
                开始创建
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </LampContainer>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              为什么选择 Prompt AI？
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              我们提供最全面的 AI 提示词管理解决方案，帮助你充分发挥 AI 的潜力
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-cyan-500" />
                  </div>
                  <CardTitle className="text-slate-100">精选提示词库</CardTitle>
                  <CardDescription className="text-slate-400">
                    汇集各领域专家精心设计的高质量提示词，覆盖写作、编程、分析等多个场景
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-cyan-500" />
                  </div>
                  <CardTitle className="text-slate-100">社区协作</CardTitle>
                  <CardDescription className="text-slate-400">
                    与全球 AI 爱好者分享经验，评价和改进提示词，共同构建更好的 AI 生态
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-cyan-500" />
                  </div>
                  <CardTitle className="text-slate-100">智能分类</CardTitle>
                  <CardDescription className="text-slate-400">
                    按用途、模型兼容性和应用场景智能分类，快速找到最适合的提示词
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-cyan-500" />
                  </div>
                  <CardTitle className="text-slate-100">多模型支持</CardTitle>
                  <CardDescription className="text-slate-400">
                    支持 GPT、Claude、Gemini 等主流 AI 模型，确保提示词的广泛兼容性
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-cyan-500" />
                  </div>
                  <CardTitle className="text-slate-100">强大搜索</CardTitle>
                  <CardDescription className="text-slate-400">
                    基于语义的智能搜索，支持标签、分类和关键词多维度查找
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-cyan-500" />
                  </div>
                  <CardTitle className="text-slate-100">个人收藏</CardTitle>
                  <CardDescription className="text-slate-400">
                    创建个人提示词库，收藏喜欢的内容，随时随地访问你的专属工具箱
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6">
              准备好提升你的 AI 体验了吗？
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              加入我们的社区，发现无限可能的 AI 提示词世界
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  免费注册
                </Button>
              </Link>
              <Link href="/prompts">
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  浏览提示词
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
