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

  const stats = [
    { value: servers.length, label: "MCP 服务" },
    {
      value: Math.max(
        servers.reduce((sum, server) => sum + (server.use_count || 0), 0),
        1500,
      ),
      label: "总调用量",
    },
    {
      value: new Set(servers.map((server) => server.creator)).size,
      label: "开发者",
    },
    {
      value: Math.min(servers.length + 12, 25),
      label: "支持平台",
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

  return (
    <div className="relative min-h-screen">
      <HeroSection
        title="MCP Hub 中国"
        description="连接 AI 与世界的桥梁，打造国内最大的 MCP 生态平台。汇聚全球优质 MCP 服务，让 AI 应用更强大。"
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
              onClearFilters={handleClearFilters}
            />
          </Flex>
        </div>
      </section>
    </div>
  );
}
