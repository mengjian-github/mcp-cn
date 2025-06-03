"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Heading, Text } from "@radix-ui/themes";
import { motion } from "motion/react";
import { FC, useEffect, useState } from "react";
import { AnimatedCounter } from "./animated-counter";
import { Sparkles, Zap, Users, Globe } from "lucide-react";

interface StatItem {
  value: number;
  label: string;
  icon?: React.ReactNode;
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

  // 增强统计数据显示
  const enhancedStats = [
    { ...stats[0], icon: <Zap className="w-5 h-5" />, color: "from-blue-500 to-cyan-500" },
    { ...stats[1], icon: <Sparkles className="w-5 h-5" />, color: "from-purple-500 to-pink-500" },
    { ...stats[2], icon: <Users className="w-5 h-5" />, color: "from-green-500 to-emerald-500" },
    { ...stats[3], icon: <Globe className="w-5 h-5" />, color: "from-orange-500 to-red-500" },
  ];

  return (
    <header className="relative overflow-hidden flex items-center min-h-[85vh] pt-8 pb-16" role="banner">
      {/* 增强背景效果 */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* 动态渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/50 to-indigo-50/30"></div>
        
        {/* 浮动装饰元素 */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-l from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNGMEY0RjgiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMzBjMCAxNi41NjktMTMuNDMxIDMwLTMwIDMwQzEzLjQzMSA2MCAwIDQ2LjU2OSAwIDMwIDAgMTMuNDMxIDEzLjQzMSAwIDMwIDBjMTYuNTY5IDAgMzAgMTMuNDMxIDMwIDMweiIgc3Ryb2tlPSIjRTZFQkYxIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-[0.02]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-[1] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left content */}
          <motion.div
            className="lg:col-span-7 text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : 40,
            }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* 标签徽章 */}
            <motion.div
              className="inline-flex items-center px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200/50 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
              <Text className="text-blue-800 font-semibold text-sm">
                🇨🇳 精选优质 MCP 服务平台
              </Text>
            </motion.div>

            {/* 主标题 */}
            <Heading as="h1" className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight [text-wrap:balance] leading-[1.1]">
              <motion.span
                className="inline-block relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
                  {title}
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-4 bg-gradient-to-r from-blue-200/60 to-indigo-200/60 rounded-full -z-0"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                />
              </motion.span>
            </Heading>

            {/* 描述文字 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Text className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed [text-wrap:balance]">
                {description}
              </Text>
              
              {/* 特色标签 */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  "✨ 精选推荐",
                  "🔧 高质量工具",
                  "📚 中文文档",
                  "🤝 社区驱动"
                ].map((tag, index) => (
                  <motion.span
                    key={tag}
                    className="px-3 py-1 text-sm bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full text-gray-700 font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* 搜索框 */}
            <motion.div
              className="relative max-w-xl mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              role="search"
            >
              <div className="relative">
                <input
                  type="search"
                  name="search"
                  autoComplete="off"
                  aria-label="搜索 MCP 服务"
                  className="w-full h-16 pl-6 pr-16 bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-xl shadow-blue-900/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-900/10 text-gray-700 text-lg placeholder:text-gray-400"
                  placeholder="🔍 搜索精选 MCP 服务，发现 AI 的无限可能..."
                  value={searchTerm}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                  }}
                />
                <motion.button
                  type="button"
                  aria-label="执行搜索"
                  className="absolute h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center rounded-xl right-2 top-2 transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MagnifyingGlassIcon width={20} height={20} />
                </motion.button>
              </div>
              
              {/* 搜索提示 */}
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                <span>热门搜索:</span>
                {["文件操作", "数据库", "网络请求", "AI工具"].map((keyword, index) => (
                  <button
                    key={keyword}
                    onClick={() => onSearchChange(keyword)}
                    className="px-2 py-1 bg-gray-100/80 hover:bg-blue-100/80 rounded-md transition-colors duration-200 hover:text-blue-600"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 移动端统计数据 */}
            <div className="grid grid-cols-2 gap-4 lg:hidden">
              {enhancedStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 1.2 + 0.1 * index }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                      {stat.icon}
                    </div>
                  </div>
                  <AnimatedCounter
                    value={stat.value}
                    className="text-2xl font-bold text-gray-800 mb-1 block"
                  />
                  <Text className="text-sm text-gray-600 font-medium">{stat.label}</Text>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 右侧桌面端统计数据 */}
          <motion.div
            className="lg:col-span-5 hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl border border-blue-100/70 shadow-2xl shadow-blue-900/5 relative overflow-hidden">
              {/* 装饰背景 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-bl-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <Heading as="h3" className="text-xl font-bold text-gray-800">
                    生态数据实时
                  </Heading>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {enhancedStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="relative group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                      transition={{ duration: 0.6, delay: 0.6 + 0.1 * index }}
                    >
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 border border-white/50 backdrop-blur-sm group-hover:from-white/70 group-hover:to-white/50 transition-all duration-300 group-hover:shadow-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white shadow-sm`}>
                            {stat.icon}
                          </div>
                        </div>
                        
                        <AnimatedCounter
                          value={stat.value}
                          className={`text-3xl font-bold mb-2 block text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}
                        />
                        
                        <div className="text-sm text-gray-600 font-semibold">
                          {stat.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 底部说明 */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-100/30">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">数据实时更新</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};
