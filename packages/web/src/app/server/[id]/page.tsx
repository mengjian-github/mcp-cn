"use client";

import { ServerInfo, ServerTool } from "@/schema";
import { Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Breadcrumb } from "./components/breadcrumb";
import { ServerHeader } from "./components/server-header";
import { TabsSection } from "./components/tabs-section";

// 为了 SEO，我们需要创建一个服务端组件来生成元数据
// 但由于当前页面使用了很多客户端逻辑，我们先保持客户端组件
// 建议后续重构为混合架构

/**
 * 服务器详情页面
 */
const ServerDetailPage: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();
  const serverId = id || "";

  const [server, setServer] = useState<ServerInfo | null>(null);
  const [tools, setTools] = useState<ServerTool[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  /**
   * 获取服务器详情
   */
  const fetchServerDetail = async (): Promise<ServerInfo> => {
    const response = await fetch(
      `/api/servers/get_details?serverId=${serverId}`,
    );

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    const responseData = (await response.json()) as {
      code: number;
      data: ServerInfo;
      message: string;
    };

    if (responseData.code === 0) {
      return responseData.data;
    }
    throw new Error(responseData.message);
  };

  // 使用 useQuery 请求服务器数据
  const serverQuery = useQuery({
    queryKey: ["serverDetail", serverId],
    queryFn: fetchServerDetail,
    staleTime: 5 * 60 * 1000, // 数据5分钟内不会被标记为过期
    retry: 2, // 失败重试次数
  });

  // 处理服务器数据的成功和错误状态
  useEffect(() => {
    if (serverQuery.isSuccess) {
      setServer(serverQuery.data);
      
      // 动态更新页面标题和描述 (客户端 SEO 优化)
      if (typeof document !== 'undefined') {
        document.title = `${serverQuery.data.display_name} - MCP Hub 中国`;
        
        // 更新 meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', 
            `${serverQuery.data.description} - 在 MCP Hub 中国发现和使用这个强大的 MCP 服务，支持 Cursor、Claude、Windsurf 等平台。`
          );
        }
        
        // 更新 Open Graph 标签
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', `${serverQuery.data.display_name} - MCP Hub 中国`);
        }
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute('content', serverQuery.data.description);
        }
        
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
          ogUrl.setAttribute('content', `https://mcp-cn.com/server/${serverId}`);
        }
      }
    }
    if (serverQuery.isError && serverQuery.error instanceof Error) {
      console.error("请求服务器数据失败:", serverQuery.error);
    }
  }, [
    serverQuery.isSuccess,
    serverQuery.isError,
    serverQuery.data,
    serverQuery.error,
    serverId
  ]);

  /**
   * 获取工具数据
   */
  const fetchTools = async (): Promise<ServerTool[]> => {
    const response = await fetch(
      `/api/meta_info/get_tools?serverId=${serverId}`,
    );

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    const responseData = (await response.json()) as {
      code: number;
      data: {
        tools: ServerTool[];
      };
      message: string;
    };

    if (responseData.code === 0) {
      return responseData.data.tools;
    }
    throw new Error(responseData.message);
  };

  // 使用 useQuery 请求工具数据
  const toolsQuery = useQuery({
    queryKey: ["toolsData", serverId],
    queryFn: fetchTools,
    staleTime: 5 * 60 * 1000, // 数据5分钟内不会被标记为过期
    retry: 2, // 失败重试次数
  });

  // 处理工具数据的成功和错误状态
  useEffect(() => {
    if (toolsQuery.isSuccess) {
      setTools(toolsQuery.data);
    }
    if (toolsQuery.isError && toolsQuery.error instanceof Error) {
      console.error("请求工具数据失败:", toolsQuery.error);
    }
  }, [
    toolsQuery.isSuccess,
    toolsQuery.isError,
    toolsQuery.data,
    toolsQuery.error,
  ]);

  // 返回首页
  const handleBackToHome = () => {
    router.push("/");
  };

  // 处理收藏
  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  if (serverQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">正在加载服务详情...</p>
        </div>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Text size="5" weight="bold">
            未找到服务器
          </Text>
          <Text>抱歉，我们无法找到您请求的服务器。</Text>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={handleBackToHome}
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 结构化数据 JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: server.display_name,
            description: server.description,
            url: `https://mcp-cn.com/server/${serverId}`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: ["Windows", "macOS", "Linux"],
            softwareVersion: "latest",
            author: {
              "@type": "Person",
              name: server.creator
            },
            publisher: {
              "@type": "Organization",
              name: "MCP Hub 中国"
            },
            downloadUrl: server.package_url,
            installUrl: server.package_url,
            aggregateRating: server.use_count > 0 ? {
              "@type": "AggregateRating",
              ratingValue: "4.5",
              reviewCount: Math.max(1, Math.floor(server.use_count / 10))
            } : undefined,
            interactionStatistic: {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/DownloadAction",
              userInteractionCount: server.use_count
            }
          })
        }}
      />
      
      <div className="min-h-[calc(100vh-105px)] bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-6 md:px-6">
          <Breadcrumb server={server} onBackToHome={handleBackToHome} />
          <ServerHeader
            server={server}
            isLiked={isLiked}
            onLikeToggle={handleLikeToggle}
          />

          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            <TabsSection
              server={server}
              tools={tools}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* <div className="w-full lg:w-80 shrink-0">
              <AuthorSection
                server={server}
                onViewProfile={handleViewAuthorProfile}
              />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServerDetailPage;
