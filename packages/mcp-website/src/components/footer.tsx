"use client";

import { Text } from "@radix-ui/themes";
import { FC } from "react";

/**
 * 页脚组件
 */
export const Footer: FC = () => (
  <footer className="backdrop-blur-lg border-t border-gray-200 bg-white/80">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-center gap-2">
        <Text className="text-sm text-gray-500">Powered by MCP Hub Org</Text>
        <span className="text-gray-300">|</span>
        <Text className="text-sm text-gray-500">
          © {new Date().getFullYear()}
        </Text>
      </div>
    </div>
  </footer>
);
