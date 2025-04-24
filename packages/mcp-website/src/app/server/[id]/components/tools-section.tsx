"use client";

import { ServerTool } from "@mcp-monorepo/shared/zod";
import * as Collapsible from "@radix-ui/react-collapsible";
import { motion, Variants } from "motion/react";
import { FC, useEffect, useState } from "react";

export interface ToolsSectionProps {
  tools: ServerTool[];
}

/**
 * 工具列表区域组件
 */
export const ToolsSection: FC<ToolsSectionProps> = ({ tools }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});

  // 初始化默认展开所有项目和语言显示状态
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    const initialLanguageState: Record<string, boolean> = {};
    tools.forEach((tool) => {
      initialExpandedState[tool.name] = true;
      initialLanguageState[tool.name] = false; // 默认显示翻译
    });
    setExpandedItems(initialExpandedState);
    setShowOriginal(initialLanguageState);
  }, [tools]);

  const containerVariants: Variants = {
    visible: {
      transition: {
        staggerChildren: 0,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, bounce: 0 } },
  };

  const toggleExpand = (toolName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [toolName]: !prev[toolName],
    }));
  };

  const toggleLanguage = (toolName: string) => {
    setShowOriginal((prev) => ({
      ...prev,
      [toolName]: !prev[toolName],
    }));
  };

  if (tools.length === 0) {
    return (
      <motion.div
        className="flex justify-center items-center h-24 bg-gray-50 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-gray-500">该服务器没有可用的工具</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-3 my-3"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {tools.map((tool) => (
        <motion.div
          key={tool.name}
          className="flex flex-row justify-between items-start p-4 bg-white border border-gray-100 rounded-lg hover:border-blue-200 cursor-pointer"
          variants={itemVariants}
          whileHover={{ transition: { duration: 0 } }}
        >
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h3 className="m-0 text-black font-medium font-mono">
                {tool.name}
              </h3>

              <button
                className="text-xs text-blue-500 hover:text-blue-600 transition-colors flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(tool.name);
                }}
              >
                {expandedItems[tool.name] ? (
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 15l-6-6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    收起
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    展开
                  </div>
                )}
              </button>
            </div>

            <Collapsible.Root open={expandedItems[tool.name] || false}>
              <Collapsible.Content
                className={
                  expandedItems[tool.name]
                    ? "text-gray-600 text-sm"
                    : "text-gray-600 text-sm line-clamp-2"
                }
              >
                <div className="flex flex-col gap-2">
                  <div>
                    {showOriginal[tool.name]
                      ? tool.description
                      : (tool.translation ?? tool.description)}
                  </div>
                  {!!tool.translation && (
                    <button
                      className="text-xs text-gray-400 hover:text-blue-500 transition-colors self-start"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLanguage(tool.name);
                      }}
                    >
                      {showOriginal[tool.description] ? "查看翻译" : "查看原文"}
                    </button>
                  )}
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
