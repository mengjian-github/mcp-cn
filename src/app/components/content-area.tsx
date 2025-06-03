"use client";

import { ServerInfo } from "@/schema";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { AnimatePresence, motion } from "motion/react";
import { FC } from "react";
import { ServerCard } from "./server-card";

interface ContentAreaProps {
  servers: ServerInfo[];
  loading?: boolean;
  error: string | null;
  onClearFilters?: () => void;
}

// 服务器卡片网格组件
interface ServerGridProps {
  servers: ServerInfo[];
  title: string;
}

const ServerGrid: FC<ServerGridProps> = ({ servers, title }) => {
  if (servers.length === 0) return null;

  return (
    <div className="mb-10">
      <motion.div
        className="mb-5 ml-1"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Heading size="4" className="text-gray-800">
          {title}{" "}
          <span className="text-gray-400 text-sm ml-2">({servers.length})</span>
        </Heading>
      </motion.div>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="sync">
          {servers.map((server) => {
            const serverId = server.server_id;
            return (
              <motion.div
                className="w-full h-full"
                key={serverId}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0 },
                  layout: { type: "spring", stiffness: 1000, damping: 80 },
                }}
              >
                <ServerCard server={server} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export const ContentArea: FC<ContentAreaProps> = ({
  servers,
  loading = false,
  error,
  onClearFilters,
}) => {
  if (loading) {
    return (
      <div className="p-8 text-center w-full">
        <div>loading</div>
        <motion.div
          className="mx-auto p-8 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Text className="text-gray-600">加载中...</Text>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center w-full">
        <Flex align="center" gap="2" className="text-red-600">
          <motion.div
            initial={{ rotate: -90 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <ExclamationTriangleIcon width={20} height={20} />
          </motion.div>
          <Heading size="3">加载错误</Heading>
        </Flex>
        <Text className="text-red-500 mt-2">{error}</Text>
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <motion.div
        className="p-8 text-center w-full"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="mx-auto p-8 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Heading size="3" className="mb-2">
            未找到匹配的服务器
          </Heading>
          <Text className="text-gray-500 mb-4">尝试不同的搜索词或类别</Text>
          {onClearFilters ? (
            <motion.button
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200 ml-2"
              onClick={onClearFilters}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              清除所有筛选条件
            </motion.button>
          ) : null}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="py-8 w-full bg-transparent flex-1">
      {/* 精选工具 */}
      <ServerGrid servers={servers} title="精选工具" />
    </div>
  );
};
