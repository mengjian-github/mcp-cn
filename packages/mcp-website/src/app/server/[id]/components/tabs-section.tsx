import { cn } from "@/utils/cn";
import { ServerInfo, ServerTool } from "@mcp-monorepo/shared/zod";
import { FC } from "react";
import { GuideSection } from "./guide-section";
import { OverviewSection } from "./overview-section";
import { ToolsSection } from "./tools-section";

interface TabProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: FC<TabProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-3 text-sm font-medium transition-colors focus:outline-none",
        isActive
          ? "border-b-2 border-blue-500 text-blue-600"
          : "border-b-2 border-transparent text-gray-600 hover:text-gray-900",
      )}
    >
      {label}
    </button>
  );
};

interface TabsSectionProps {
  server: ServerInfo;
  tools: ServerTool[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabsSection: FC<TabsSectionProps> = ({
  server,
  tools,
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "overview", label: "概览" },
    { id: "usage", label: "工具" },
    server.introduction ? { id: "guide", label: "指南" } : undefined,
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div className="flex-1">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 border-b border-gray-200 flex">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => {
                onTabChange(tab.id);
              }}
            />
          ))}
        </div>
        <div className="p-6">
          {activeTab === "overview" && (
            <OverviewSection server={server} tools={tools} />
          )}
          {activeTab === "usage" && <ToolsSection tools={tools} />}
          {activeTab === "guide" && (
            <GuideSection url={server.introduction ?? ""} />
          )}
        </div>
      </div>
    </div>
  );
};
