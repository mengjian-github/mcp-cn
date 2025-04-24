import { ServerInfo } from "@/schema";
import * as Avatar from "@radix-ui/react-avatar";
import { motion } from "motion/react";
import { FC } from "react";

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
 * 获取首字母或首个字符
 * @param name 名称
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
 * 根据字符串生成固定的背景色
 * @param str 输入字符串
 * @returns 背景色
 */
const getAvatarColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

interface AuthorSectionProps {
  server: ServerInfo;
  onViewProfile: () => void;
}

/**
 * 作者信息区域组件
 */
export const AuthorSection: FC<AuthorSectionProps> = ({ server }) => {
  const avatarText = getInitials(server.creator);
  const avatarColor = getAvatarColor(server.creator);

  return (
    <motion.div
      className="mb-6 border border-gray-200 shadow-sm rounded-lg overflow-hidden bg-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200">
              <Avatar.Fallback
                className="w-full h-full flex items-center justify-center text-white text-lg font-medium"
                style={{ backgroundColor: avatarColor }}
              >
                {avatarText}
              </Avatar.Fallback>
            </Avatar.Root>
            <span className="text-gray-800">{server.creator}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-0">MCP 服务开发者</p>
        {/* <button onClick={onViewProfile} className="mt-3 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
          查看完整资料
        </button> */}
      </div>
    </motion.div>
  );
};
