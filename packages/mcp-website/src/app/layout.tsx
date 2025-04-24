"use client";

// 使用 Next.js 内置字体系统
import { Inter } from "next/font/google";

// 导入基础样式
import "@/styles/global.css";
import "@radix-ui/themes/styles.css";

// 导入组件
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Toaster } from "@/components/toaster";
import { Theme } from "@radix-ui/themes";
import { Providers } from "../components/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`light-theme ${inter.variable}`}>
      <body className={inter.className}>
        <Providers>
          <Theme appearance="light" accentColor="blue">
            <div className="min-h-screen">
              <Header />
              {children}
              <Footer />
            </div>
          </Theme>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
