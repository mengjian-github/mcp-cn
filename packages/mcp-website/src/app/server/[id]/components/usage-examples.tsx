import { UsageSample } from "@/interfaces";
import { ServerInfo } from "@mcp-monorepo/shared/zod";
import { motion } from "motion/react";
import { FC } from "react";

interface UsageExamplesProps {
  server: ServerInfo;
  samples: UsageSample[];
}

/**
 * 使用示例组件
 */
export const UsageExamples: FC<UsageExamplesProps> = ({ server, samples }) => {
  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="py-4">
      <h2 className="text-lg font-medium mb-4">快速开始</h2>
      <p className="text-gray-600 mb-6">
        以下示例展示了 {server.display_name} 的一些基本用法，帮助您快速上手。
      </p>

      <motion.div
        className="flex flex-col gap-6 my-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {samples.map((sample) => (
          <motion.div
            key={sample.id}
            className="overflow-hidden rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] hover:border-blue-300"
            variants={itemVariants}
            whileHover={{
              y: -4,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.3 },
            }}
          >
            <div className="p-6">
              <h3 className="text-base font-medium text-gray-800 mb-4">
                {sample.title}
              </h3>

              <div className="mb-4 overflow-hidden rounded-lg">
                <pre className="p-5 bg-gray-900 text-gray-100 font-mono text-sm leading-relaxed rounded-lg overflow-x-auto">
                  <code>{sample.code}</code>
                </pre>
              </div>

              <p className="text-sm text-gray-600 mt-4">{sample.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
