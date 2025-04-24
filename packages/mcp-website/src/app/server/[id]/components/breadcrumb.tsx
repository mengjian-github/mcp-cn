import { FC } from "react";
import { ServerInfo } from "@mcp-monorepo/shared/zod";
import { motion } from "motion/react";
import * as Separator from "@radix-ui/react-separator";
import Link from "next/link";
interface BreadcrumbProps {
  server: ServerInfo;
  onBackToHome: () => void;
}

/**
 * 面包屑导航组件
 */
export const Breadcrumb: FC<BreadcrumbProps> = ({ server }) => {
  return (
    <motion.div
      className="flex items-center mb-6 flex-wrap text-sm py-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link href="/">
        <motion.span
          className="text-blue-500 cursor-pointer hover:text-blue-700 hover:underline transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          首页
        </motion.span>
      </Link>

      <Separator.Root className="mx-2.5 text-gray-400" orientation="vertical">
        /
      </Separator.Root>

      <span className="text-gray-500 font-medium">{server.display_name}</span>
    </motion.div>
  );
};
