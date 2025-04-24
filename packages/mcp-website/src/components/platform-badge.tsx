import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import { FC } from "react";

interface PlatformBadgeProps {
  platform: string;
}

export const PlatformBadge: FC<PlatformBadgeProps> = ({ platform }) => {
  // 平台名称中文映射
  const platformNames: Record<string, string> = {
    web: "网页",
    mobile: "移动端",
    desktop: "桌面端",
    api: "接口",
    server: "服务器",
    cloud: "云端",
    bot: "机器人",
  };

  // 平台颜色映射
  const platformColors: Record<string, string> = {
    web: "before:bg-[#0076ff]",
    mobile: "before:bg-[#ff7e14]",
    desktop: "before:bg-[#22c55e]",
    api: "before:bg-[#7b5cff]",
    server: "before:bg-[#ff4b00]",
    cloud: "before:bg-[#ff4b00]",
    bot: "before:bg-[#ff4b00]",
  };

  const normalizedPlatform = platform.toLowerCase();
  const colorClass = platformColors[normalizedPlatform] || "before:bg-gray-400";

  return (
    <motion.span
      className={cn(
        "relative inline-flex items-center justify-center px-2.5 py-1 rounded text-xs font-medium",
        "bg-black/5 text-gray-600 mr-1.5 overflow-hidden",
        'before:content-[""] before:absolute before:left-0 before:top-0 before:h-full before:w-[3px]',
        "shadow-sm backdrop-blur-sm",
        "transition-all duration-300",
        "hover:translate-y-[-2px] hover:bg-black/8 hover:shadow-md",
        "dark:bg-white/6 dark:text-gray-400 dark:shadow-md dark:hover:bg-white/10",
        colorClass,
      )}
      whileHover={{
        y: -2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    >
      {platformNames[normalizedPlatform] || platform}
    </motion.span>
  );
};
