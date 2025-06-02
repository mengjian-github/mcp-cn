"use client";

import { Text } from "@radix-ui/themes";
import { FC, useState } from "react";
import { Github, ExternalLink, MessageCircle, FileText, Heart, Shield, ScrollText } from "lucide-react";
import Image from "next/image";

/**
 * 页脚组件
 */
export const Footer: FC = () => {
  const [showWechat, setShowWechat] = useState(false);

  return (
    <footer className="mt-24 backdrop-blur-lg border-t border-gray-200/60 bg-white/95 relative shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* 品牌信息 */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10">
                <Image
                  src="/logo.svg"
                  alt="MCP Hub Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              </div>
              <span className="text-xl font-bold text-gray-800">MCP Hub 中国</span>
            </div>
            <Text className="text-sm text-gray-600 leading-relaxed max-w-sm">
              连接 AI 与世界的桥梁，打造国内最大的 MCP 生态平台。让每个开发者都能轻松构建强大的 AI 应用。
            </Text>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>开源 • 免费 • 社区驱动</span>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">快速链接</h3>
            <div className="space-y-3">
              <a 
                href="https://wvehg9sdj2q.feishu.cn/wiki/Hx7Ow0tF8iJEW4kS3LmcdkXCn3i?fromScene=spaceOverview&open_tab_from=wiki_home"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 group"
              >
                <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                官方文档
                <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
              </a>
              <a 
                href="/playground"
                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 group"
              >
                <span className="w-4 h-4 mr-2 flex items-center justify-center group-hover:scale-110 transition-transform">🛝</span>
                在线体验
              </a>
              <a 
                href="#servers"
                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 group"
              >
                <span className="w-4 h-4 mr-2 flex items-center justify-center group-hover:scale-110 transition-transform">🔧</span>
                MCP 服务
              </a>
            </div>
          </div>

          {/* 开源与社区 */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">开源与社区</h3>
            <div className="space-y-3">
              <a 
                href="https://github.com/mengjian-github/mcp-cn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 group"
              >
                <Github className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                GitHub 仓库
                <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
              </a>
              <a 
                href="https://github.com/mengjian-github/mcp-cn/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 group"
              >
                <span className="w-4 h-4 mr-2 flex items-center justify-center group-hover:scale-110 transition-transform">🐛</span>
                问题反馈
                <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
              </a>
              <a 
                href="https://github.com/mengjian-github/mcp-cn/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 group"
              >
                <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                贡献指南
                <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
              </a>
            </div>
          </div>

          {/* 联系我们 */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">联系我们</h3>
            <div className="space-y-3">
              <div className="relative">
                <button
                  onMouseEnter={() => setShowWechat(true)}
                  onMouseLeave={() => setShowWechat(false)}
                  className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-all duration-200 group"
                >
                  <MessageCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  微信联系
                </button>
                
                {/* 微信二维码弹窗 */}
                {showWechat && (
                  <div className="absolute bottom-full left-0 mb-3 p-4 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200/60 z-50 transform transition-all duration-200">
                    <div className="text-xs text-gray-500 mb-3 text-center font-medium">扫码添加微信</div>
                    <img 
                      src="/images/wx.jpg" 
                      alt="微信二维码" 
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center">
                  <span className="mr-2">📧</span>
                  <span>商务合作</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">💬</span>
                  <span>技术交流</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🤝</span>
                  <span>开源协作</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部版权和链接 */}
        <div className="mt-16 pt-8 border-t border-gray-200/60">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Text>© {new Date().getFullYear()} MCP Hub 中国</Text>
              <span className="text-gray-300">•</span>
              <Text>让 AI 应用更强大</Text>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <a 
                href="https://github.com/mengjian-github/mcp-cn/blob/main/PRIVACY.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                <Shield className="w-3 h-3 mr-1" />
                隐私政策
              </a>
              <span className="text-gray-300">•</span>
              <a 
                href="https://github.com/mengjian-github/mcp-cn/blob/main/TERMS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                <ScrollText className="w-3 h-3 mr-1" />
                服务条款
              </a>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1 text-gray-500">
                Made with <Heart className="w-3 h-3 text-red-500" /> in China
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
