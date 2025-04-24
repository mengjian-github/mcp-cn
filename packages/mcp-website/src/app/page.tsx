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
      label: "调用量",
    },
    {
      value: new Set(servers.map((server) => server.creator)).size,
      label: "开发者",
    },
    {
      value: Math.min(servers.length, 6),
      label: "平台数量",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchServers}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-blue-50 relative">
      <HeroSection
        title="MCP Hub"
        description="一站式 MCP 解决方案，释放 AI 应用无限潜能，让你的研发、办公更高效！"
        stats={stats}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="pb-10">
        <div className="w-full max-w-[1280px] mx-auto px-6">
          <Flex className="justify-center w-full bg-transparent md:flex-row flex-col">
            <ContentArea
              loading={loading}
              error={error}
              servers={filteredServers}
              onClearFilters={handleClearFilters}
            />
          </Flex>
        </div>
      </div>
    </div>
  );
}
