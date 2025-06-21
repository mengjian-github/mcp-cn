import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";

// 导入基础样式
import "@/styles/global.css";
import "@radix-ui/themes/styles.css";

// 导入组件
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Toaster } from "@/components/toaster";
import { Theme } from "@radix-ui/themes";
import { Providers } from "../components/providers";
import VersionChecker from "@/components/VersionChecker";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// SEO 元数据配置
export const metadata: Metadata = {
  title: {
    default: "MCP Hub 中国 - 精选优质 MCP 服务平台",
    template: "%s | MCP Hub 中国"
  },
  description: "MCP Hub 中国专注于精选优质 MCP 服务，不追求大而全，只推荐经过严格筛选的高质量工具。每个服务都经过人工测试验证，为开发者提供最佳的 AI 工具集成体验。",
  keywords: [
    "MCP",
    "Model Context Protocol",
    "AI工具",
    "人工智能",
    "Cursor",
    "Claude",
    "Windsurf",
    "开源",
    "中国",
    "生态平台",
    "服务发现",
    "API接入",
    "开发者工具"
  ],
  authors: [{ name: "MCP Hub 中国团队" }],
  creator: "MCP Hub 中国团队",
  publisher: "MCP Hub 中国",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mcp-cn.com"),
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://mcp-cn.com",
    title: "MCP Hub 中国 - 精选优质 MCP 服务平台",
    description: "精选优质 MCP 服务平台，不追求大而全，只推荐经过严格筛选的高质量工具。让 AI 应用真正强大。",
    siteName: "MCP Hub 中国",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "MCP Hub 中国 - MCP 生态平台",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Hub 中国 - 精选优质 MCP 服务平台",
    description: "精选优质 MCP 服务平台，不追求大而全，只推荐经过严格筛选的高质量工具。让 AI 应用真正强大。",
    images: ["/images/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // 可以在此添加搜索引擎验证代码
    // google: "验证码",
    // baidu: "验证码",
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`light-theme ${inter.variable}`}>
      <head>
        {/* 预连接到重要的第三方域名 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Favicon 和图标 */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />

        {/* 其他尺寸的图标 */}
        <link rel="icon" type="image/svg+xml" href="/favicon-16x16.png.svg" sizes="16x16" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" sizes="32x32" />

        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MCP Hub 中国",
              description: "精选优质 MCP 服务平台，不追求大而全，只推荐最好用的",
              url: "https://mcp-cn.com",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://mcp-cn.com/?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              publisher: {
                "@type": "Organization",
                name: "MCP Hub 中国",
                url: "https://mcp-cn.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://mcp-cn.com/logo.png"
                }
              }
            })
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 注册 Service Worker
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW: 注册成功', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('SW: 注册失败', error);
                    });
                });
              }

              // 处理 chunk 加载失败的情况
              window.addEventListener('error', function(e) {
                const isChunkLoadError = e.message.includes('Loading chunk') ||
                                       e.message.includes('ChunkLoadError') ||
                                       (e.filename && e.filename.includes('/_next/static/chunks/'));

                if (isChunkLoadError && !window.chunkErrorHandled) {
                  window.chunkErrorHandled = true;
                  console.warn('检测到资源加载失败，正在刷新页面...');

                  // 清除可能的缓存
                  if ('caches' in window) {
                    caches.keys().then(function(names) {
                      names.forEach(function(name) {
                        caches.delete(name);
                      });
                    });
                  }

                  // 延迟刷新，避免无限循环
                  setTimeout(function() {
                    window.location.reload();
                  }, 1000);
                }
              });

              // 处理 webpack chunk 加载错误
              if (typeof window !== 'undefined' && window.__webpack_require__) {
                const originalRequire = window.__webpack_require__;
                window.__webpack_require__ = function(moduleId) {
                  try {
                    return originalRequire(moduleId);
                  } catch (error) {
                    if (error.name === 'ChunkLoadError' && !window.chunkErrorHandled) {
                      window.chunkErrorHandled = true;
                      console.warn('检测到 Chunk 加载失败，正在刷新页面...');
                      setTimeout(function() {
                        window.location.reload();
                      }, 1000);
                    }
                    throw error;
                  }
                };
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <Theme appearance="light" accentColor="blue">
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </Theme>
          <Toaster />
          <VersionChecker />
        </Providers>
      </body>
    </html>
  );
}
