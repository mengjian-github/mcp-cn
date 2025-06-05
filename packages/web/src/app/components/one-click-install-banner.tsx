"use client";

import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { isCursorDeeplinkSupported } from "@/utils";

/**
 * Cursor一键安装功能介绍横幅
 */
export const OneClickInstallBanner: FC = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsSupported(isCursorDeeplinkSupported());
    
    // 检查是否已经关闭过横幅
    const dismissed = localStorage.getItem('cursor-banner-dismissed');
    setIsDismissed(dismissed === 'true');
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('cursor-banner-dismissed', 'true');
  };

  if (!isSupported || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <motion.div
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">🎉 全新功能：Cursor一键安装</h3>
              <p className="text-blue-100 text-sm">
                支持直接在Cursor中配置MCP服务，无需手动编辑配置文件！鼠标悬停服务卡片即可看到⚡图标。
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-blue-100 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>已检测到Cursor支持</span>
              </div>
            </div>
            
            <motion.button
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              onClick={handleDismiss}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="关闭提示"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}; 