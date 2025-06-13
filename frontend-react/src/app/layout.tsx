import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
//import Navbar from "@/components/layout/Navbar";
import NavigationWrapper from "@/components/layout/NavigationWrapper";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prompt AI - 智能提示词管理平台",
  description: "发现、创建、管理和分享高质量的 AI 提示词",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-slate-950">
            
            <NavigationWrapper />
            <main className="pb-20 sm:pb-8">
              {children}
            </main>
            <Toaster 
              position="top-right"
              theme="dark"
              richColors
              closeButton
            />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
