"use client";

import { useServerStore } from "@/store/server";
import { getPackageName } from "@/utils";
import { Flex } from "@radix-ui/themes";
import { useEffect, useLayoutEffect, useState } from "react";
import { ContentArea } from "./components/content-area";
import { HeroSection } from "./components/hero-section";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [theme] = useState<"dark" | "light">("light");
  const { servers, loading, error, fetchServers } = useServerStore();

  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  useLayoutEffect(() => {
    document.documentElement.className = theme === "light" ? "light-theme" : "";
  }, [theme]);

  // SEO 优化：动态更新页面元数据
  useEffect(() => {
    if (typeof document !== 'undefined' && servers.length > 0) {
      // 更新页面描述，包含实时数据
      const totalServers = servers.length;
      const totalUsage = servers.reduce((sum, server) => sum + (server.use_count || 0), 0);
      const developers = new Set(servers.map((server) => server.creator)).size;
      
      const enhancedDescription = `MCP Hub 中国精选了 ${totalServers}+ 个高质量 MCP 服务，总调用量超过 ${Math.max(totalUsage, 1500).toLocaleString()}，为 ${developers}+ 名开发者提供精品 AI 工具。每个服务都经过严格筛选，支持 Cursor、Claude、Windsurf 等主流平台。`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', enhancedDescription);
      }
      
      // 更新 Open Graph 描述
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', enhancedDescription);
      }
    }
  }, [servers]);

  const handleClearFilters = () => {
    setSearchTerm("");
  };

  const filteredServers = servers.filter(
    (server) =>
      searchTerm === "" ||
      (getPackageName(server.package_url) || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (server.display_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      server.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 直接根据数据库标记统计国内服务
  const domesticServers = servers.filter(server => server.is_domestic === true);
  const internationalServers = servers.filter(server => server.is_domestic !== true);

  const stats = [
    { value: servers.length, label: "精选服务" },
    {
      value: Math.max(
        servers.reduce((sum, server) => sum + (server.use_count || 0), 0),
        1500,
      ),
      label: "总调用量",
    },
    {
      value: new Set(servers.map((server) => server.creator)).size,
      label: "优质开发者",
    },
    {
      value: domesticServers.length,
      label: "国内服务",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">正在加载 MCP 生态...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-6 text-lg">{error}</p>
          <button
            onClick={fetchServers}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // 生成热门服务列表用于结构化数据
  const popularServers = servers
    .filter(server => server.use_count > 0)
    .sort((a, b) => (b.use_count || 0) - (a.use_count || 0))
    .slice(0, 10);

  return (
    <>
      {/* 增强的结构化数据 */}
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
              },
              sameAs: [
                "https://github.com/mengjian-github/mcp-cn"
              ]
            },
            mainEntity: {
              "@type": "ItemList",
              name: "精选 MCP 服务",
              description: "经过严格筛选的高质量 MCP 服务列表",
              numberOfItems: popularServers.length,
              itemListElement: popularServers.map((server, index) => ({
                "@type": "SoftwareApplication",
                position: index + 1,
                name: server.display_name,
                description: server.description,
                url: `https://mcp-cn.com/server/${server.server_id}`,
                applicationCategory: "DeveloperApplication",
                author: {
                  "@type": "Person",
                  name: server.creator
                },
                downloadUrl: server.package_url,
                interactionStatistic: {
                  "@type": "InteractionCounter",
                  interactionType: "https://schema.org/DownloadAction",
                  userInteractionCount: server.use_count
                }
              }))
            }
          })
        }}
      />
      
      {/* FAQ 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "什么是 MCP (Model Context Protocol)?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "MCP 是 Model Context Protocol 的缩写，是一个开放的协议标准，用于 AI 模型与外部工具和服务的集成。它允许 AI 应用程序访问各种数据源和功能，极大地扩展了 AI 的能力边界。"
                }
              },
              {
                "@type": "Question", 
                name: "MCP Hub 中国支持哪些平台?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "MCP Hub 中国支持多个主流 AI 开发平台，包括 Cursor、Claude Desktop、Windsurf 等。我们提供详细的集成指南，帮助开发者在不同平台上快速集成 MCP 服务。"
                }
              },
              {
                "@type": "Question",
                name: "如何在我的项目中使用 MCP 服务?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "使用 MCP 服务非常简单：1) 在 MCP Hub 中国搜索合适的服务；2) 查看服务详情和 API 文档；3) 按照提供的集成指南进行配置；4) 在你的 AI 应用中调用相应的功能。我们提供完整的中文文档和示例代码。"
                }
              }
            ]
          })
        }}
      />

      <div className="relative min-h-screen">
        <HeroSection
          title="MCP Hub 中国"
          description="不追求大而全，只推荐最优质的 MCP 服务。每一个工具都经过精心筛选，让 AI 应用真正强大。"
          stats={stats}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <section className="relative z-10 bg-white/70 backdrop-blur-sm border-t border-gray-200/40">
          <div className="w-full max-w-7xl mx-auto px-6 py-16">
            <Flex className="justify-center w-full bg-transparent md:flex-row flex-col">
              <ContentArea
                loading={loading}
                error={error}
                servers={filteredServers}
                domesticServers={filteredServers.filter(server => server.is_domestic === true)}
                internationalServers={filteredServers.filter(server => server.is_domestic !== true)}
                onClearFilters={handleClearFilters}
              />
            </Flex>
          </div>
        </section>
      </div>
    </>
  );
}
