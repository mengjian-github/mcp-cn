"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Heading, Text } from "@radix-ui/themes";
import { motion } from "motion/react";
import { FC, useEffect, useState } from "react";
import { AnimatedCounter } from "./animated-counter";

interface StatItem {
  value: number;
  label: string;
}

interface HeroSectionProps {
  title: string;
  description: string;
  stats: StatItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const HeroSection: FC<HeroSectionProps> = ({
  title,
  description,
  stats,
  searchTerm,
  onSearchChange,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden flex items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 移除所有的背景装饰元素 */}

        {/* 保留网格纹理，但降低不透明度 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNGMEY0RjgiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMzBjMCAxNi41NjktMTMuNDMxIDMwLTMwIDMwQzEzLjQzMSA2MCAwIDQ2LjU2OSAwIDMwIDAgMTMuNDMxIDEzLjQzMSAwIDMwIDBjMTYuNTY5IDAgMzAgMTMuNDMxIDMwIDMweiIgc3Ryb2tlPSIjRTZFQkYxIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-[1] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left content */}
          <motion.div
            className="lg:col-span-7 text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 20 : 40,
            }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="inline-block px-4 py-1 mb -6 rounded-full bg-blue-100/70 backdrop-blur border border-blue-200/50">
              <Text className="text-blue-800 font-medium text-sm">
                MCP 服务市场
              </Text>
            </div>

            <Heading className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight [text-wrap:balance] text-gray-900 leading-[1.1]">
              <span className="inline-block relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 text-6xl">
                  {title}
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-3 bg-blue-200/50 rounded-full -z-0"></span>
              </span>
            </Heading>

            <Text className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed [text-wrap:balance]">
              {description}
            </Text>

            <div className="relative max-w-xl mb-16 mt-8">
              <input
                className="w-full h-14 pl-6 pr-14 bg-white/90 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-xl shadow-blue-900/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-700"
                placeholder="搜索 MCP 服务..."
                value={searchTerm}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                }}
              />
              <div className="absolute h-full flex items-center justify-center right-2 top-0">
                <motion.button
                  className="w-10 h-10 text-blue-800 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MagnifyingGlassIcon width={20} height={20} />
                </motion.button>
              </div>
            </div>

            {/* Stats on mobile */}
            <div className="grid grid-cols-2 gap-6 lg:hidden mb-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-blue-100/50 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 20,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * index,
                    ease: "easeOut",
                  }}
                >
                  <AnimatedCounter
                    value={stat.value}
                    className="text-3xl font-bold text-blue-700 mb-1 block"
                  />
                  <Text className="text-sm text-gray-600">{stat.label}</Text>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right stats section on desktop */}
          <motion.div
            className="lg:col-span-5 hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              scale: isVisible ? 1 : 0.95,
            }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-blue-100/70 shadow-xl shadow-blue-900/5 relative overflow-hidden">
              <Heading
                as="h3"
                className="text-xl font-semibold mb-6 text-gray-800 relative z-10"
              >
                平台数据一览
              </Heading>

              <div className="grid grid-cols-2 gap-6 relative z-10">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: isVisible ? 1 : 0,
                      y: isVisible ? 0 : 20,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + 0.1 * index,
                      ease: "easeOut",
                    }}
                  >
                    <AnimatedCounter
                      value={stat.value}
                      className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 mb-1 block"
                    />
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
