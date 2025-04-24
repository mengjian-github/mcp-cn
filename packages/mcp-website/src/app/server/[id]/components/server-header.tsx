import { getPackageName } from "@/utils";
import { dayjsInstance } from "@/utils/dayjs";
import { ServerInfo } from "@mcp-monorepo/shared/zod";
import { motion, Variants } from "motion/react";
import { FC } from "react";

interface ServerHeaderProps {
  server: ServerInfo;
  isLiked: boolean;
  onLikeToggle: () => void;
}

/**
 * 服务器头部组件
 */
export const ServerHeader: FC<ServerHeaderProps> = ({ server }) => {
  // 动画变体
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.15,
      },
    },
  };

  return (
    <motion.div
      className="flex justify-between items-start mb-8 flex-wrap gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex-1 min-w-[300px]">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {server.display_name}
          </h1>
          <div className="flex items-center flex-wrap gap-3">
            <span className="inline-block px-2 py-1 text-xs font-mono text-gray-600 bg-gray-100 border border-gray-200 rounded">
              {getPackageName(server.package_url)}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-1.5 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 2v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 2v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 10h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                发布时间：{dayjsInstance(server.created_at).fromNow()}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-1.5 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 7v5l3 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                更新时间：{dayjsInstance(server.updated_at).fromNow()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
