"use client";

import { ServerInfo } from "@/schema";
import { trackPageClick } from "@/tracks";
import { getPackageName } from "@/utils";
import * as Avatar from "@radix-ui/react-avatar";
import classNames from "classnames";
import Link from "next/link";
import { FC } from "react";
// 获取标签数量
const TAG_COUNT = 2;

// 常量定义
const THOUSAND = 1000;

// 文字头像的背景色
const AVATAR_COLORS = [
  "#165DFF", // 蓝色
  "#3491FA", // 浅蓝色
  "#4080FF", // 亮蓝色
  "#F53F3F", // 红色
  "#F77234", // 橙色
  "#FF7D00", // 橙黄色
  "#7B61FF", // 紫色
  "#722ED1", // 深紫色
  "#168CFF", // 天蓝色
  "#3C7EFF", // 皇家蓝
];

/**
 * 格式化使用次数（如果超过1000则显示为k）
 * @param count 使用次数
 * @returns {string} 格式化后的字符串
 */
const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  } else if (count >= THOUSAND) {
    return `${(count / THOUSAND).toFixed(1).replace(/\.0$/, '')}K`;
  } else {
    return count.toString();
  }
};

/**
 * 获取服务器名称的首字母或首个字符
 * @param name 服务器名称
 * @returns 首字母或字符
 */
const getInitials = (name: string): string => {
  if (!name) {
    return "?";
  }
  // 对于中文名称，直接返回第一个字符
  if (/[\u4e00-\u9fa5]/.test(name.charAt(0))) {
    return name.charAt(0);
  }
  // 对于英文名称，返回首字母大写
  return name.charAt(0).toUpperCase();
};

/**
 * 根据服务器ID获取稳定的颜色
 * @param id 服务器ID（字符串或数字）
 * @returns 颜色代码
 */
const getAvatarColor = (id: string | number): string => {
  // 将ID转换为字符串
  const idStr = String(id);
  const index =
    Math.abs(
      idStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0),
    ) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export interface ServerCardProps {
  server: ServerInfo;
  highlight?: boolean;
}
/**
 * 服务器卡片组件
 * @param props 组件属性
 * @returns {JSX.Element} 返回JSX元素
 */
export const ServerCard: FC<ServerCardProps> = ({
  server,
  highlight = false,
}) => {
  /**
   * 处理卡片点击事件
   */
  const handleCardClick = () => {
    if (typeof window === "undefined") return;
    trackPageClick("jump_server_detail", {
      server_id: server.server_id,
      server_name: server.display_name,
    });
  };

  /**
   * 获取服务器的名称，优先使用 display_name，其次是 displayName
   */
  const serverName = server.display_name;
  // 获取使用计数，优先使用 use_count，其次是 usageCount
  const useCount = server.use_count;
  // 获取标签，确保为数组
  const serverTags = server.tag ? server.tag?.split(",") : [];
  // 获取服务器 ID
  const serverId = server.server_id;
  // 获取头像字符和颜色
  const avatarText = getInitials(serverName);
  const avatarColor = getAvatarColor(serverId);

  return (
    <Link
      href={`/server/${server.server_id}`}
      className={classNames(
        "w-full h-full rounded-xl shadow-sm border border-gray-200/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 hover:border-blue-200 hover:-translate-y-1 p-5 bg-white/90 backdrop-blur-sm cursor-pointer flex flex-col group",
        {
          "ring-2 ring-blue-500 ring-opacity-50": highlight,
        },
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-center mb-4">
        <Avatar.Root className="mr-3 flex-shrink-0 inline-flex h-[50px] w-[50px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
          {server.logo ? (
            <Avatar.Image
              className="h-[85%] w-[85%] object-contain bg-gray-50 border border-gray-200 rounded-full m-auto"
              src={server.logo}
              alt={serverName}
            />
          ) : (
            <Avatar.Fallback
              className="flex h-full w-full items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: avatarColor }}
            >
              {avatarText}
            </Avatar.Fallback>
          )}
        </Avatar.Root>
        <span className="text-lg font-semibold truncate text-gray-800 group-hover:text-blue-600 transition-colors duration-200">{serverName}</span>
      </div>
      <div className="flex flex-col flex-grow">
        <span className="text-sm text-gray-500 truncate mb-2 font-[12px]">
          {getPackageName(server.package_url)}
        </span>
        <div className="mb-4 flex-grow">
          <p className="text-sm text-gray-700 line-clamp-3">
            {server.description}
          </p>
        </div>

        <div className="mt-auto space-y-2">
          {/* 使用次数显示 */}
          <div className="flex items-center">
            <div className="text-xs text-gray-500 flex items-center">
              <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>{formatCount(useCount || 0)} 次使用</span>
            </div>
          </div>
          
          {/* 标签显示 */}
          {serverTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {serverTags.slice(0, TAG_COUNT).map((tag) => (
                <span
                  key={`${serverId}-${tag}`}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
