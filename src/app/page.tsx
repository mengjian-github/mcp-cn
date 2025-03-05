"use client";

import { useState } from "react";
import { ServerList } from "@/components/server/server-list";
import { ServerSearch } from "@/components/server/server-search";
import { ServerFilters } from "@/components/server/server-filters";
import { servers } from "@/data/servers";
import { categories } from "@/data/categories";
import { tags } from "@/data/tags";
import { MCPServer } from "@/types/mcp";
import { HeroSection } from "@/components/ui/hero-section";
import { FeaturesSection } from "@/components/ui/features-section";

export default function Home() {
  const [filteredServers, setFilteredServers] = useState<MCPServer[]>(servers);
  const [activeFilters, setActiveFilters] = useState<{ category?: string; tag?: string }>({});
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = (filter: { category?: string; tag?: string }) => {
    setActiveFilters(filter);
    applyFilters(filter, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(activeFilters, query);
  };

  const applyFilters = (filter: { category?: string; tag?: string }, query: string) => {
    let result = servers;

    // 应用类别过滤
    if (filter.category) {
      result = result.filter(server => server.category.id === filter.category);
    }

    // 应用标签过滤
    if (filter.tag) {
      result = result.filter(server => 
        server.tags.some(tag => tag.id === filter.tag)
      );
    }

    // 应用搜索查询
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(server => 
        server.name.toLowerCase().includes(lowerQuery) || 
        server.description.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredServers(result);
  };

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      
      <div className="bg-background/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              浏览MCP服务器
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              探索我们丰富的中国本土平台MCP服务器集合，找到适合您项目的集成方案
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="sticky top-20">
                <ServerFilters 
                  categories={categories} 
                  tags={tags} 
                  onFilterChange={handleFilterChange} 
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="mb-6">
                <ServerSearch onSearch={handleSearch} />
              </div>
              <ServerList servers={filteredServers} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
