"use client";

import { ServerInfo, ServerTool } from "@/schema";
import { Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Breadcrumb } from "./components/breadcrumb";
import { ServerHeader } from "./components/server-header";
import { TabsSection } from "./components/tabs-section";

/**
 * 服务器详情页面
 */
const ServerDetailPage: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const packageName = pathname.split("/").pop() ?? "";

  const [server, setServer] = useState<ServerInfo | null>(null);
  const [tools, setTools] = useState<ServerTool[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  /**
   * 获取服务器详情
   */
  const fetchServerDetail = async (): Promise<ServerInfo> => {
    const response = await fetch(
      `/api/servers/get_details?qualifiedName=${packageName}`,
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
    queryKey: ["serverDetail", packageName],
    queryFn: fetchServerDetail,
    staleTime: 5 * 60 * 1000, // 数据5分钟内不会被标记为过期
    retry: 2, // 失败重试次数
  });

  // 处理服务器数据的成功和错误状态
  useEffect(() => {
    if (serverQuery.isSuccess) {
      setServer(serverQuery.data);
    }
    if (serverQuery.isError && serverQuery.error instanceof Error) {
      console.error("请求服务器数据失败:", serverQuery.error);
    }
  }, [
    serverQuery.isSuccess,
    serverQuery.isError,
    serverQuery.data,
    serverQuery.error,
  ]);

  /**
   * 获取工具数据
   */
  const fetchTools = async (): Promise<ServerTool[]> => {
    const response = await fetch(
      `/api/meta_info/get_tools?qualifiedName=${packageName}`,
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
    queryKey: ["toolsData", packageName],
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
        <div className="flex flex-col items-center justify-center h-64"></div>
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
  );
};

export default ServerDetailPage;
