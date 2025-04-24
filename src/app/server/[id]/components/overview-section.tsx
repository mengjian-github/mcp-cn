import { ServerInfo, ServerTool } from "@/schema";
import { CubeIcon } from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";
import { Flame, Tag } from "lucide-react";
import { motion, Variants } from "motion/react";
import { FC } from "react";
import { InstallationGuide } from "./installation-guide";

interface OverviewSectionProps {
  server: ServerInfo;
  tools: ServerTool[];
}

/**
 * 概览部分组件
 */
export const OverviewSection: FC<OverviewSectionProps> = ({
  server,
  tools,
}) => {
  const tags = server.tag?.split(",").filter(Boolean) ?? [];

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, bounce: 0 } },
  };

  return (
    <motion.div className="w-full" initial="hidden" animate="visible">
      <motion.div className="mb-6" variants={itemVariants}>
        <h2 className="flex items-center text-lg font-medium mb-4">
          <CubeIcon className="w-5 h-5 mr-2 text-blue-500" />
          描述
        </h2>
        <p className="text-gray-600 leading-relaxed">{server.description}</p>
      </motion.div>

      <Separator.Root className="h-px w-full bg-gray-200 my-6" />

      <motion.div variants={itemVariants}>
        <InstallationGuide server={server} />
      </motion.div>

      <Separator.Root className="h-px w-full bg-gray-200 my-6" />

      {tools.length > 0 && (
        <motion.div variants={itemVariants}>
          <h2 className="flex items-center text-lg font-medium mb-4">
            <Flame className="w-5 h-5 mr-2 text-blue-500" />
            热门工具
          </h2>
          <div
            className={`grid gap-4 mt-4 ${tools.length === 1 ? "grid-cols-1" : "md:grid-cols-2 grid-cols-1"}`}
          >
            {tools.slice(0, 4).map((tool) => (
              <motion.div
                key={tool.name}
                className="p-4 bg-gray-50 rounded-md border border-gray-100 transition-all"
              >
                <h3 className="font-semibold text-gray-800 mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {tool.translation ?? tool.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {tags.length > 0 && (
        <>
          <Separator.Root className="h-px w-full bg-gray-200 my-6" />

          <motion.div variants={itemVariants}>
            <h2 className="flex items-center text-lg font-medium mb-4">
              <Tag className="w-5 h-5 mr-2 text-blue-500" />
              标签
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <motion.span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};
