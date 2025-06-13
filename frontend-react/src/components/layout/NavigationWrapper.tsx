"use client";

import { NavBar } from "@/components/ui/tubelight-navbar";
import { useAuth } from "@/stores/auth";
import { Home, Library, User, Star, Plus } from "lucide-react";

export default function NavigationWrapper() {
  const { isAuthenticated } = useAuth();

  const mainNavItems = [
    { name: "首页", url: "/", icon: Home },
    { name: "提示词库", url: "/prompts", icon: Library },
    ...(isAuthenticated ? [
      { name: "我的提示词", url: "/my-prompts", icon: User },
    ] : []),
    { name: "精选推荐", url: "/featured", icon: Star },
    ...(isAuthenticated ? [
      { name: "创建提示词", url: "/create", icon: Plus },
    ] : []),
  ];

  return <NavBar items={mainNavItems} />;
} 